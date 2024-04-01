import styles from './WidgetRenderer.module.scss';
import { useEffect, useMemo, useRef } from 'react';
import { isClientSide } from '@/utils/environment';
import { BoundingBox, collidesWith, gridSize, WidgetInstance, WIDGETS } from '@/module/homepage';
import Menu from '@/icons/Menu';
import Button from '@/components/UI/Button';

const GAP_SIZE = 15;

export default function WidgetRenderer({
  widget,
  modifyingLayout,
  otherWidgetsBB = [],
  changeBB = () => {},
  remove = () => {},
}: {
  widget: WidgetInstance;
  modifyingLayout: boolean;
  otherWidgetsBB: BoundingBox[];
  changeBB: (newWidget: BoundingBox) => void;
  remove: () => void;
}) {
  // We use a native callback, in which we need the latest version of these props, so we use refs
  const otherWidgetsBBRef = useRef(otherWidgetsBB);
  otherWidgetsBBRef.current = otherWidgetsBB;
  // The WidgetInstance that stores all the data about the widget
  const widgetRef = useRef(widget);
  widgetRef.current = widget;
  // A callback stored in a ref, called when we change the bounding box of the widget
  const changeDivBBRef = useRef(changeBB);
  changeDivBBRef.current = changeBB;
  // References to the DOM elements
  const resizerRef = useRef<HTMLDivElement>(null); // The div that permits resizing
  const draggerRef = useRef<HTMLDivElement>(null); // The div that permits dragging
  const fakeElementRef = useRef<HTMLDivElement>(null); // The fake element that will be displayed when modifying the bounding box
  const removeButtonRef = useRef<HTMLDivElement>(null); // The button to remove the widget
  // Data about the fake element, it will be used to snap the widget to the grid
  const fakeElement = useRef<BoundingBox | null>(null);
  // Used to let the observer know if the resizing is due to the user or if it is caused by the snapping of the element / the page being resized
  // It's always false, except when user is pressing the mouse button on the resizer
  const isUserResizing = useRef(false);
  // We need something faster than a useState to avoid a double call of the second useEffect, so we need to put it in a ref (as it is instantaneous)
  // This variable contains information the relative position of the mouse to the dragged element when starting the drag.
  // If there is currently no dragging, it is null.
  const draggingInfo = useRef<{ x: number; y: number } | null>(null);
  const homepageSize = useRef<{ width: number; height: number } | null>(null); // The size in pixels of the homepage (the page minus the navbar)
  // Define an observer that will look for 2 things : widget resizing and page resizing.
  // When the page is resized, we need to update the widget's absolute position and size and the homepage size
  // When the widget is resized, we need to update the fake element's size and position
  const observer = useMemo<ResizeObserver | undefined>(
    () =>
      isClientSide() // ResizeObserver does not exist server side
        ? new ResizeObserver(function (mutations) {
            if (!resizerRef.current) return; // It can happen as the destructor of the useEffect that uses the observer takes time to be called.
            // If the parent is resized, update the homepage size and the widget's position / size accordingly.
            if (mutations[0].target === resizerRef.current.parentElement!.parentElement) {
              homepageSize.current = {
                width: resizerRef.current.parentElement!.parentElement!.clientWidth,
                height: resizerRef.current.parentElement!.parentElement!.clientHeight,
              };
              isUserResizing.current = false;
              positionTile(resizerRef.current, widgetRef.current);
              return;
            }
            if (!isUserResizing.current) return; // If the user is not the source of this resizing (here the element being snapped), we skip the event
            // If there is no fake element at the moment, that means we just started modifying the bounding box.
            if (!fakeElement.current) {
              createFakeElement();
            } else {
              // We simply update the fake element's size.
              const widgetBB = resizerRef.current.getBoundingClientRect();
              modifyFakeElement({
                width: Math.round((widgetBB.width / homepageSize.current!.width) * gridSize[0]),
                height: Math.round((widgetBB.height / homepageSize.current!.height) * gridSize[1]),
              });
            }
          })
        : undefined,
    [isClientSide()],
  );
  // This useEffect is in charge of connecting and disconnecting the observer.
  useEffect(() => {
    if (!resizerRef.current || !observer) return;
    observer.observe(resizerRef.current.parentElement!.parentElement!);
    observer.observe(resizerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [resizerRef.current, observer]);
  // This useEffect adds event on elements :
  // - The resizer to detect the start of the resizing
  // - The dragger to detect the start of the dragging
  // - The document to make the dragging work (during the dragging & ending of dragging)
  useEffect(() => {
    if (!resizerRef.current || !draggerRef.current || !fakeElementRef.current || !modifyingLayout) return;
    // The user starts resizing the widget. Tell it to the observer.
    const onMouseDownResizer = () => {
      isUserResizing.current = true;
    };
    // The user clicks on the dragger, it's the beginning of a drag.
    const onMouseDownDragger = (e: MouseEvent) => {
      if (e.target === removeButtonRef.current) return;
      const bb = draggerRef.current!.getBoundingClientRect();
      draggingInfo.current = {
        x: e.clientX - bb.x,
        y: e.clientY - bb.y,
      };
      createFakeElement();
    };
    // The user releases the mouse button (not necessarily on the dragger, if he is too fast, so put the event on the body), it's the end of the drag.
    const onMouseUp = () => {
      isUserResizing.current = false;
      if (!draggingInfo.current) return;
      draggingInfo.current = null;
      snap();
    };
    // The user moves the mouse, we need to update the position of the element and the fake element.
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingInfo.current) return;
      const widgetBB = resizerRef.current!.getBoundingClientRect();
      const parentBB = resizerRef.current!.parentElement!.parentElement!.getBoundingClientRect();
      const left = Math.max(
        0,
        Math.min(parentBB.width - widgetBB.width, e.clientX - parentBB.left - draggingInfo.current.x),
      );
      const top = Math.max(
        0,
        Math.min(parentBB.height - widgetBB.height, e.clientY - parentBB.top - draggingInfo.current.y),
      );
      resizerRef.current!.style.left = `${left}px`;
      resizerRef.current!.style.top = `${top}px`;
      modifyFakeElement({
        x: Math.round((left / parentBB.width) * gridSize[0]),
        y: Math.round((top / parentBB.height) * gridSize[1]),
      });
    };
    // Finally, add all events...
    resizerRef.current!.addEventListener('mousedown', onMouseDownResizer);
    draggerRef.current!.addEventListener('mousedown', onMouseDownDragger);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    // ...and remove them in the destructor
    return () => {
      draggerRef.current?.removeEventListener('mousedown', onMouseDownDragger); // draggerRef.current might be null if this element was just removed
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [resizerRef.current, draggerRef.current, fakeElementRef.current, modifyingLayout]);
  // Creates a new fake element, from the widget's position and size.
  const createFakeElement = () => {
    fakeElement.current = {
      x: widgetRef.current.x,
      y: widgetRef.current.y,
      width: widgetRef.current.width,
      height: widgetRef.current.height,
    };
    updateFakeElement();
  };
  // Modifies certain data of the fake element. Does a lot of checks to verify the new bounding box is valid. If not, it will try to adjust its position.
  const modifyFakeElement = (bb: Partial<BoundingBox>) => {
    if (!fakeElement.current) return;
    const newFakeElement = { ...fakeElement.current, ...bb };
    // Check the minimum and maximum size of the widget
    if (
      newFakeElement.width < WIDGETS[widgetRef.current.widget].minWidth ||
      newFakeElement.height < WIDGETS[widgetRef.current.widget].minHeight ||
      newFakeElement.width > WIDGETS[widgetRef.current.widget].maxWidth ||
      newFakeElement.height > WIDGETS[widgetRef.current.widget].maxHeight
    ) {
      return;
    }
    for (const otherBB of otherWidgetsBBRef.current) {
      if (!collidesWith(newFakeElement, otherBB)) continue;
      // From now on, remember that the new fake element collides with the otherBB.
      // If the left of the *original* fake element collides with the right of otherBB, don't change the x position.
      if (fakeElement.current.x === otherBB.x + otherBB.width) {
        newFakeElement.x = fakeElement.current.x;
      }
      // If the top of the *original* fake element collides with the bottom of otherBB, reset the y position.
      if (fakeElement.current.y === otherBB.y + otherBB.height) {
        newFakeElement.y = fakeElement.current.y;
      }
      // If the right of the *original* fake element collides with the left of otherBB, reset the width.
      if (fakeElement.current.x + fakeElement.current.width === otherBB.x) {
        newFakeElement.width = fakeElement.current.width;
      }
      // If the bottom of the *original* fake element collides with the top of otherBB, reset the height.
      if (fakeElement.current.y + fakeElement.current.height === otherBB.y) {
        newFakeElement.height = fakeElement.current.height;
      }
    }
    // Now, there are no more problems with the new bounding box. We can update the fake element.
    fakeElement.current = newFakeElement;
    updateFakeElement();
  };
  // Updates the display of the fake element
  const updateFakeElement = () => {
    // If there is no fake element, we hide the fake element div. We also put the resizer at a z-index that will not interfere with the
    if (!fakeElement.current) {
      fakeElementRef.current!.style.display = 'none';
    } else {
      // If there is a fake element, display it and position it.
      fakeElementRef.current!.style.display = 'block';
      positionTile(fakeElementRef.current!, fakeElement.current);
    }
  };
  // Snaps the widget to the grid. The new position of the widget is given by the position of the fake element.
  const snap = () => {
    isUserResizing.current = false; // The user is no longer resizing
    positionTile(resizerRef.current!, fakeElement.current!);
    changeDivBBRef.current(fakeElement.current!); // Call the callback to update the widget's position for the parent
    fakeElement.current = null; // We can disable and hide the fake element
    updateFakeElement();
  };
  // Positions an element at a certain position in the grid
  const positionTile = (element: HTMLElement, position: BoundingBox) => {
    const tileWidth = (homepageSize.current!.width - (gridSize[0] + 1) * GAP_SIZE) / gridSize[0];
    const tileHeight = (homepageSize.current!.height - (gridSize[1] + 1) * GAP_SIZE) / gridSize[1];
    element.style.left = `${(tileWidth + GAP_SIZE) * position.x + GAP_SIZE}px`;
    element.style.top = `${(tileHeight + GAP_SIZE) * position.y + GAP_SIZE}px`;
    element.style.width = `${tileWidth * position.width + (position.width - 1) * GAP_SIZE}px`;
    element.style.height = `${tileHeight * position.height + (position.height - 1) * GAP_SIZE}px`;
  };
  // And finally, renders the component
  const Widget = WIDGETS[widgetRef.current.widget].component;
  return (
    <div className={styles.widgetRenderer}>
      <div
        ref={resizerRef}
        className={`${styles.widgetResizer} ${modifyingLayout ? styles.modifyingLayout : ''}`}
        onClick={() => fakeElement.current && snap()}>
        <div ref={draggerRef} className={styles.widgetDragger}>
          <Widget />
          {modifyingLayout && (
            <div className={styles.removeButton} ref={removeButtonRef}>
              <Button onClick={remove} noStyle={true}>
                <Menu />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div ref={fakeElementRef} className={styles.fakeElement} />
    </div>
  );
  // Pfiouf, that was a long one !
}
