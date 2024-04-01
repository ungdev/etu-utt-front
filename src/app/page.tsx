'use client';

import styles from './style.module.scss';
import WidgetRenderer from '@/components/homeWidgets/WidgetRenderer';
import { usePageSettings } from '@/module/pageSettings';
import Button from '@/components/UI/Button';
import { useStateWithReference } from '@/utils/hooks';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addWidget, modifyBB, removeWidget, WIDGETS } from '@/module/homepage';
import { useEffect, useMemo, useState } from 'react';
import { isClientSide } from '@/utils/environment';

function AdditionalNavbarComponent({
  modifyingLayout,
  onAdd,
  onModify,
  onDone,
}: {
  modifyingLayout: boolean;
  onAdd: (widget: keyof typeof WIDGETS) => void;
  onModify: () => void;
  onDone: () => void;
}) {
  const [widgetToAdd, setWidgetToAdd] = useState<keyof typeof WIDGETS>('ueBrowserWidget');
  return (
    <>
      <Button onClick={modifyingLayout ? onDone : onModify}>{modifyingLayout ? 'Terminer' : 'Modifier'}</Button>
      {modifyingLayout && (
        <>
          <select
            value={widgetToAdd}
            onChange={(e) => setWidgetToAdd((e.target as HTMLSelectElement).value as keyof typeof WIDGETS)}>
            <option value="widget1">widget1</option>
            <option value="widget2">widget2</option>
            <option value="widget3">widget3</option>
          </select>
          <Button onClick={() => onAdd(widgetToAdd)}>Ajouter</Button>
        </>
      )}
    </>
  );
}

export default function HomePage() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [modifyingLayout, setModifyingLayout, modifyingLayoutRef] = useStateWithReference(false);
  usePageSettings(
    {
      navbarAdditionalComponent: isSmallScreen
        ? null
        : () => (
            <AdditionalNavbarComponent
              modifyingLayout={modifyingLayoutRef.current}
              onModify={() => setModifyingLayout(true)}
              onDone={() => setModifyingLayout(false)}
              onAdd={(widget) => dispatch(addWidget(widget))}
            />
          ),
    },
    [modifyingLayout, isSmallScreen],
  );
  const resizeObserver = useMemo(
    () =>
      isClientSide()
        ? new ResizeObserver(() => {
            setIsSmallScreen((isSmallScreen) => {
              if (!isSmallScreen && window.innerWidth <= 1024) setModifyingLayout(false);
              return window.innerWidth <= 1024;
            });
          })
        : null,
    [isClientSide()],
  );
  const widgets = useAppSelector((state) => state.homepage);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!resizeObserver) return;
    resizeObserver.observe(document.body);
    return () => resizeObserver.disconnect();
  }, [resizeObserver]);
  return (
    <div className={styles.page}>
      {!isSmallScreen
        ? widgets.map((widget, i) => {
            return (
              <WidgetRenderer
                key={widget.id}
                widget={widget}
                modifyingLayout={modifyingLayout}
                otherWidgetsBB={widgets
                  .filter((_, j) => j !== i)
                  .map((w) => ({ x: w.x, y: w.y, width: w.width, height: w.height }))}
                changeBB={(newWidget) => dispatch(modifyBB(i, { ...widget, ...newWidget }))}
                remove={() => dispatch(removeWidget(i))}
              />
            );
          })
        : widgets.map((widget) => {
            const Widget = WIDGETS[widget.widget].component;
            return <Widget key={widget.id} />;
          })}
    </div>
  );
}
