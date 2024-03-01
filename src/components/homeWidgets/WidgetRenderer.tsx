import styles from './WidgetRenderer.module.scss';
import { BoundingBox, WidgetInstance, widgetsEnum } from '@/app/page';
import { useEffect, useMemo, useRef } from 'react';
import { isClientSide } from '@/utils/environment';

export default function WidgetRenderer({
  widget,
  otherWidgetsBB = [],
  changeDivBB = () => {},
}: {
  widget: WidgetInstance;
  otherWidgetsBB?: BoundingBox[];
  changeDivBB?: (newWidget: BoundingBox) => void;
}) {
  // We use a native callback, in which we need the latest version of these props, so we use refs
  const otherWidgetsBBRef = useRef(otherWidgetsBB);
  otherWidgetsBBRef.current = otherWidgetsBB;
  const changeDivBBRef = useRef(changeDivBB);
  changeDivBBRef.current = changeDivBB;
  // References to the DOM elements
  const resizerRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<HTMLDivElement>(null);
  const fakeElementRef = useRef<HTMLDivElement>(null);
  // Data about the fake element, it will be used to snap the widget to the grid
  const fakeElement = useRef<BoundingBox | null>(null);
  // True when the widget is being resized, to let the observer know it should skip the observation
  const isSnapResizing = useRef(false);
  // We need something faster than a useState to avoid a double call of the second useEffect
  const dragging = useRef<boolean>(false);
  const observer = useMemo<ResizeObserver | undefined>(
    () =>
      isClientSide()
        ? new ResizeObserver(function (mutations) {
            if (mutations[0].target === document.body) return;
            if (isSnapResizing.current) {
              setTimeout(() => (isSnapResizing.current = false), 0.1);
              return;
            }
            if (!fakeElement.current) {
              createFakeElement();
            } else {
              const widgetBB = resizerRef.current!.getBoundingClientRect();
              const parentBB = resizerRef.current!.parentElement!.parentElement!.getBoundingClientRect();
              modifyFakeElement({
                width: Math.round((widgetBB.width / parentBB.width) * 10),
                height: Math.round((widgetBB.height / parentBB.height) * 10),
              });
            }
          })
        : undefined,
    [isClientSide()],
  );
  useEffect(() => {
    if (!resizerRef.current || !draggerRef.current || !fakeElementRef.current || !observer) return;
    updateFakeElement();
    observer.observe(document.body);
    observer.observe(resizerRef.current);
    const onMouseDown = () => {
      dragging.current = true;
      createFakeElement();
    };
    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      snap();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const bb = resizerRef.current!.getBoundingClientRect();
      const parentBB = resizerRef.current!.parentElement!.parentElement!.getBoundingClientRect();
      const left = bb.left - parentBB.left + e.movementX;
      const top = bb.top - parentBB.top + e.movementY;
      resizerRef.current!.style.left = `${left}px`;
      resizerRef.current!.style.top = `${top}px`;
      modifyFakeElement({
        x: Math.round((left / parentBB.width) * 10),
        y: Math.round((top / parentBB.height) * 10),
      });
    };
    draggerRef.current!.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      observer.disconnect();
      draggerRef.current!.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, [resizerRef.current, draggerRef.current, fakeElementRef.current, observer]);
  const createFakeElement = () => {
    const widgetBB = resizerRef.current!.getBoundingClientRect();
    const parentBB = resizerRef.current!.parentElement!.parentElement!.getBoundingClientRect();
    fakeElement.current = {
      x: Math.round(((widgetBB.left - parentBB.left) / parentBB.width) * 10),
      y: Math.round(((widgetBB.top - parentBB.top) / parentBB.height) * 10),
      width: Math.round((widgetBB.width / parentBB.width) * 10),
      height: Math.round((widgetBB.height / parentBB.height) * 10),
    };
    updateFakeElement();
  };
  const modifyFakeElement = (bb: Partial<BoundingBox>) => {
    if (!fakeElement.current) return;
    const newFakeElement = { ...fakeElement.current, ...bb };
    if (
      newFakeElement.x < 0 ||
      newFakeElement.y < 0 ||
      newFakeElement.x + newFakeElement.width > 10 ||
      newFakeElement.y + newFakeElement.height > 10
    )
      return;
    for (const otherBB of otherWidgetsBBRef.current) {
      if (
        newFakeElement.x + newFakeElement.width > otherBB.x &&
        newFakeElement.x < otherBB.x + otherBB.width &&
        newFakeElement.y + newFakeElement.height > otherBB.y &&
        newFakeElement.y < otherBB.y + otherBB.height
      ) {
        return;
      }
    }
    fakeElement.current = newFakeElement;
    updateFakeElement();
  };
  const updateFakeElement = () => {
    if (!fakeElement.current) {
      fakeElementRef.current!.style.display = 'none';
      return;
    }
    fakeElementRef.current!.style.display = 'block';
    fakeElementRef.current!.style.left = `${fakeElement.current.x * 10}%`;
    fakeElementRef.current!.style.top = `${fakeElement.current.y * 10}%`;
    fakeElementRef.current!.style.width = `${fakeElement.current.width * 10}%`;
    fakeElementRef.current!.style.height = `${fakeElement.current.height * 10}%`;
  };
  const snap = () => {
    isSnapResizing.current = true;
    // We need to do it here because if the width or height has not changed, the inline style will not be updated, and thus not override what the user set.
    resizerRef.current!.style.left = `${fakeElement.current!.x * 10}%`;
    resizerRef.current!.style.top = `${fakeElement.current!.y * 10}%`;
    resizerRef.current!.style.width = `${fakeElement.current!.width * 10}%`;
    resizerRef.current!.style.height = `${fakeElement.current!.height * 10}%`;
    changeDivBBRef.current(fakeElement.current!);
    fakeElement.current = null;
    updateFakeElement();
  };
  const Widget = widgetsEnum[widget.widget];
  return (
    <div className={styles.widgetRenderer}>
      <div
        ref={resizerRef}
        className={styles.widgetResizer}
        style={{
          left: `${widget.x * 10}%`,
          top: `${widget.y * 10}%`,
          width: `${widget.width * 10}%`,
          height: `${widget.height * 10}%`,
        }}
        onClick={() => fakeElement.current && snap()}>
        <div ref={draggerRef} className={styles.widgetDragger}>
          <Widget />
        </div>
      </div>
      <div ref={fakeElementRef} className={styles.fakeElement} />
    </div>
  );
}
