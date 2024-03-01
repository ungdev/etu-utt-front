'use client';

import styles from './style.module.scss';
import Widget1 from '@/components/homeWidgets/Widget1';
import Widget2 from '@/components/homeWidgets/Widget2';
import Widget3 from '@/components/homeWidgets/Widget3';
import WidgetRenderer from '@/components/homeWidgets/WidgetRenderer';
import { useState } from 'react';

export const widgetsEnum = {
  widget1: Widget1,
  widget2: Widget2,
  widget3: Widget3,
};

const defaultWidgets = [
  { widget: 'widget1', x: 0, y: 0, width: 1, height: 1 },
  { widget: 'widget2', x: 0, y: 1, width: 3, height: 1 },
  //{ widget: 'widget3', x: 3, y: 0, width: 1, height: 2 },
] satisfies WidgetInstance[];

export type BoundingBox = { x: number; y: number; width: number; height: number };

export type WidgetInstance = BoundingBox & { widget: keyof typeof widgetsEnum };

export default function HomePage() {
  const [widgets, setWidgets] = useState(defaultWidgets);
  return (
    <div className={styles.page}>
      {widgets.map((widget, i) => {
        return (
          <WidgetRenderer
            key={i}
            widget={widget}
            otherWidgetsBB={widgets
              .filter((_, j) => j !== i)
              .map((w) => ({ x: w.x, y: w.y, width: w.width, height: w.height }))}
            changeDivBB={(newWidget) => {
              setWidgets([...widgets.slice(0, i), { ...newWidget, widget: widget.widget }, ...widgets.slice(i + 1)]);
            }}
          />
        );
      })}
    </div>
  );
}
