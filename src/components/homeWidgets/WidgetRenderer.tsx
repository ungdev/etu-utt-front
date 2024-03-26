import styles from './WidgetRenderer.module.scss';
import { useEffect, useMemo, useRef } from 'react';
import { isClientSide } from '@/utils/environment';
import { BoundingBox, gridSize, WidgetInstance, WIDGETS } from '@/module/parking';
import Menu from '@/icons/Menu';
import Button from '@/components/UI/Button';

const GAP_SIZE = 5;

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
  const widgetRef = useRef(widget);
  widgetRef.current = widget;
  const changeDivBBRef = useRef(changeBB);
  changeDivBBRef.current = changeBB;
  // References to the DOM elements
  const resizerRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<HTMLDivElement>(null);
  const fakeElementRef = useRef<HTMLDivElement>(null);
  const removeButtonRef = useRef<HTMLDivElement>(null);
  // Data about the fake element, it will be used to snap the widget to the grid
  const fakeElement = useRef<BoundingBox | null>(null);
  // True when the widget is being resized, to let the observer know it should skip the observation
  const isSnapResizing = useRef(false);
  // We need something faster than a useState to avoid a double call of the second useEffect
  const draggingInfo = useRef<{ x: number; y: number } | null>(null);
  const parkingSize = useRef<{ width: number; height: number } | null>(null);
  const observer = useMemo<ResizeObserver | undefined>(
    () =>
      isClientSide()
        ? new ResizeObserver(function (mutations) {
            if (mutations[0].target === resizerRef.current!.parentElement!.parentElement) {
              parkingSize.current = {
                width: resizerRef.current!.parentElement!.parentElement!.clientWidth,
                height: resizerRef.current!.parentElement!.parentElement!.clientHeight,
              };
              positionTile(resizerRef.current!, widgetRef.current);
            }
            if (mutations[0].target !== resizerRef.current) return;
            if (isSnapResizing.current) {
              return;
            }
            if (!fakeElement.current) {
              createFakeElement();
            } else {
              const widgetBB = resizerRef.current!.getBoundingClientRect();
              modifyFakeElement({
                width: Math.round((widgetBB.width / parkingSize.current!.width) * gridSize[0]),
                height: Math.round((widgetBB.height / parkingSize.current!.height) * gridSize[1]),
              });
            }
          })
        : undefined,
    [isClientSide()],
  );
  useEffect(() => {
    parkingSize.current = {
      width: resizerRef.current!.parentElement!.parentElement!.clientWidth,
      height: resizerRef.current!.parentElement!.parentElement!.clientHeight,
    };
    positionTile(resizerRef.current!, widgetRef.current);
  }, []);
  useEffect(() => {
    if (!resizerRef.current || !draggerRef.current || !fakeElementRef.current || !observer || !modifyingLayout) return;
    updateFakeElement();
    // observer.observe(document.body);
    observer.observe(resizerRef.current.parentElement!.parentElement!);
    observer.observe(resizerRef.current);
    const onMouseDownResizer = () => {
      isSnapResizing.current = false;
    };
    const onMouseDownDragger = (e: MouseEvent) => {
      if (e.target === removeButtonRef.current) return;
      const bb = draggerRef.current!.getBoundingClientRect();
      draggingInfo.current = {
        x: e.clientX - bb.x,
        y: e.clientY - bb.y,
      };
      createFakeElement();
    };
    const onMouseUp = () => {
      isSnapResizing.current = true;
      if (!draggingInfo.current) return;
      draggingInfo.current = null;
      snap();
    };
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
    resizerRef.current!.addEventListener('mousedown', onMouseDownResizer);
    draggerRef.current!.addEventListener('mousedown', onMouseDownDragger);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      observer.disconnect();
      draggerRef.current?.removeEventListener('mousedown', onMouseDownDragger); // draggerRef.current might be null if this element was just removed
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [resizerRef.current, draggerRef.current, fakeElementRef.current, observer, modifyingLayout]);
  const createFakeElement = () => {
    fakeElement.current = {
      x: widgetRef.current.x,
      y: widgetRef.current.y,
      width: widgetRef.current.width,
      height: widgetRef.current.height,
    };
    updateFakeElement();
  };
  const modifyFakeElement = (bb: Partial<BoundingBox>) => {
    if (!fakeElement.current) return;
    const newFakeElement = { ...fakeElement.current, ...bb };
    if (
      newFakeElement.width < WIDGETS[widgetRef.current.widget].minWidth ||
      newFakeElement.height < WIDGETS[widgetRef.current.widget].minHeight
    ) {
      return;
    }
    if (newFakeElement.x < 0) {
      newFakeElement.x = fakeElement.current.x;
    }
    if (newFakeElement.y < 0) {
      newFakeElement.y = fakeElement.current.y;
    }
    if (newFakeElement.x + newFakeElement.width > gridSize[0]) {
      if (newFakeElement.x === fakeElement.current.x) {
        newFakeElement.width = fakeElement.current.width;
      } else {
        newFakeElement.x = fakeElement.current.x;
      }
    }
    if (newFakeElement.y + newFakeElement.height > gridSize[1]) {
      if (newFakeElement.y === fakeElement.current.y) {
        newFakeElement.height = fakeElement.current.height;
      } else {
        newFakeElement.y = fakeElement.current.y;
      }
    }
    for (const otherBB of otherWidgetsBBRef.current) {
      if (
        newFakeElement.x + newFakeElement.width > otherBB.x &&
        newFakeElement.x < otherBB.x + otherBB.width &&
        newFakeElement.y + newFakeElement.height > otherBB.y &&
        newFakeElement.y < otherBB.y + otherBB.height
      ) {
        if (fakeElement.current.x === otherBB.x + otherBB.width) {
          newFakeElement.x = fakeElement.current.x;
        }
        if (fakeElement.current.y === otherBB.y + otherBB.height) {
          newFakeElement.y = fakeElement.current.y;
        }
        if (fakeElement.current.x + fakeElement.current.width === otherBB.x) {
          newFakeElement.width = fakeElement.current.width;
        }
        if (fakeElement.current.y + fakeElement.current.height === otherBB.y) {
          newFakeElement.height = fakeElement.current.height;
        }
        // If the condition is still true, we cannot do anything more.
        // It can happen if the given bb is not entirely in the page.
        // The first conditions of the function will then have modified the bb in a way that makes the collisions unpredictable
        // (The new bb is not necessarily in the given one, so nothing ensures there are no collisions)
        if (
          newFakeElement.x + newFakeElement.width > otherBB.x &&
          newFakeElement.x < otherBB.x + otherBB.width &&
          newFakeElement.y + newFakeElement.height > otherBB.y &&
          newFakeElement.y < otherBB.y + otherBB.height
        ) {
          return;
        }
      }
    }
    fakeElement.current = newFakeElement;
    updateFakeElement();
  };
  const updateFakeElement = () => {
    if (!fakeElement.current) {
      fakeElementRef.current!.style.display = 'none';
      resizerRef.current!.style.zIndex = '1';
      return;
    }
    fakeElementRef.current!.style.display = 'block';
    positionTile(fakeElementRef.current!, fakeElement.current);
    resizerRef.current!.style.zIndex = '2';
  };
  const snap = () => {
    positionTile(resizerRef.current!, fakeElement.current!);
    changeDivBBRef.current(fakeElement.current!);
    fakeElement.current = null;
    updateFakeElement();
  };
  const positionTile = (element: HTMLElement, position: BoundingBox) => {
    const tileWidth = (parkingSize.current!.width - (gridSize[0] - 1) * GAP_SIZE) / gridSize[0];
    const tileHeight = (parkingSize.current!.height - (gridSize[1] - 1) * GAP_SIZE) / gridSize[1];
    // We need to do it here because if the width or height has not changed, the inline style will not be updated, and thus not override what the user set.
    element.style.left = `${(tileWidth + GAP_SIZE) * position.x}px`;
    element.style.top = `${(tileHeight + GAP_SIZE) * position.y}px`;
    element.style.width = `${tileWidth * position.width + (position.width - 1) * GAP_SIZE}px`;
    element.style.height = `${tileHeight * position.height + (position.height - 1) * GAP_SIZE}px`;
  };
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
}
