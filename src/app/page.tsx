'use client';

import styles from './style.module.scss';
import WidgetRenderer from '@/components/homeWidgets/WidgetRenderer';
import { usePageSettings } from '@/module/pageSettings';
import Button from '@/components/UI/Button';
import { useStateWithReference } from '@/utils/hooks';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setParking } from '@/module/parking';

function AdditionalNavbarComponent({
  modifyingLayout,
  onModify,
  onDone,
}: {
  modifyingLayout: boolean;
  onModify: () => void;
  onDone: () => void;
}) {
  return <Button onClick={modifyingLayout ? onDone : onModify}>{modifyingLayout ? 'Terminer' : 'Modifier'}</Button>;
}

export default function HomePage() {
  const [modifyingLayout, setModifyingLayout, modifyingLayoutRef] = useStateWithReference(false);
  usePageSettings(
    {
      navbarAdditionalComponent: () => (
        <AdditionalNavbarComponent
          modifyingLayout={modifyingLayoutRef.current}
          onModify={() => setModifyingLayout(true)}
          onDone={() => setModifyingLayout(false)}
        />
      ),
    },
    [modifyingLayout],
  );
  const widgets = useAppSelector((state) => state.parking);
  const dispatch = useAppDispatch();
  return (
    <div className={styles.page}>
      {widgets.map((widget, i) => {
        return (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            modifyingLayout={modifyingLayout}
            otherWidgetsBB={widgets
              .filter((_, j) => j !== i)
              .map((w) => ({ x: w.x, y: w.y, width: w.width, height: w.height }))}
            changeBB={(newWidget) =>
              dispatch(setParking([...widgets.slice(0, i), { ...widget, ...newWidget }, ...widgets.slice(i + 1)]))
            }
            remove={() => dispatch(setParking(widgets.filter((_, j) => j !== i)))}
          />
        );
      })}
    </div>
  );
}
