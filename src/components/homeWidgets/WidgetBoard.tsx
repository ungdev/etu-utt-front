import { isClientSide } from '@/utils/environment';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import WidgetRenderer from '@/components/homeWidgets/WidgetRenderer';
import DailyTimetableWidget from '@/components/homeWidgets/DailyTimetableWidget';
import UEBrowserWidget from '@/components/homeWidgets/UEBrowserWidget';
import UserBrowserWidget from '@/components/homeWidgets/UserBrowserWidget';
import TodaysBirthdaysWidget from '@/components/homeWidgets/TodaysBirthdaysWidget';
import { usePageLoaded } from '@/module/pageSettings';
import { createPortal } from 'react-dom';
import Button from '@/components/UI/Button';
import { useAppTranslation } from '@/lib/i18n';
import { useNavbarPortal } from '@/components/utilities/Wrapper';

export type BoundingBox = { x: number; y: number; width: number; height: number };
export type WidgetInstance = BoundingBox & { widget: keyof typeof WIDGETS; id: number };

export function collidesWith(bb1: BoundingBox, bb2: BoundingBox) {
  return (
    bb1.x + bb1.width > bb2.x && bb2.x + bb2.width > bb1.x && bb1.y + bb1.height > bb2.y && bb2.y + bb2.height > bb1.y
  );
}

export const WIDGETS = {
  dailyTimetableWidget: { component: DailyTimetableWidget, minWidth: 4, minHeight: 5, maxWidth: 10, maxHeight: 10 },
  ueBrowserWidget: { component: UEBrowserWidget, minWidth: 3, minHeight: 2, maxWidth: 10, maxHeight: 3 },
  userBrowserWidget: { component: UserBrowserWidget, minWidth: 3, minHeight: 2, maxWidth: 10, maxHeight: 3 },
  todaysBirthdays: { component: TodaysBirthdaysWidget, minWidth: 3, minHeight: 2, maxWidth: 10, maxHeight: 10 },
} as const;

export const gridSize = [10, 10];

const update = (setState: (fn: (state: WidgetInstance[]) => WidgetInstance[]) => void, widget: WidgetInstance) => {
  setState((state: WidgetInstance[]) => {
    const newIndex = state.findIndex(
      (sWidget) => sWidget.y > widget.y || (sWidget.y === widget.y && sWidget.x >= widget.x),
    );
    const index = state.findIndex((sWidget) => sWidget.id === widget.id);
    if (newIndex === -1) {
      return [...state.slice(0, index), ...state.slice(index + 1), widget];
    }
    if (newIndex < index) {
      return [...state.slice(0, newIndex), widget, ...state.slice(newIndex, index), ...state.slice(index + 1)];
    }
    if (newIndex > index) {
      return [...state.slice(0, index), ...state.slice(index + 1, newIndex), widget, ...state.slice(newIndex)];
    }
    return [...state.slice(0, index), widget, ...state.slice(index + 1)];
  });
};

const addWidget = (
  setState: (fn: (state: WidgetInstance[]) => WidgetInstance[]) => void,
  widget: keyof typeof WIDGETS,
) => {
  setState((state: WidgetInstance[]) => {
    for (let y = 0; y < gridSize[1]; y++) {
      for (let x = 0; x < gridSize[0]; x++) {
        const bb: BoundingBox = { x, y, width: 1, height: 1 };
        if (state.every((widget) => !collidesWith(bb, widget))) {
          const index = state.findIndex((widget) => widget.y > y || (widget.y === y && widget.x > x));
          if (index === -1) {
            return [...state, { id: Math.random(), widget, ...bb }];
          }
          return [...state.slice(0, index), { id: Math.random(), widget, ...bb }, ...state.slice(index)];
        }
      }
    }
    return [];
  });
};

const removeWidget = (setState: (fn: (state: WidgetInstance[]) => WidgetInstance[]) => void, index: number) => {
  setState((state: WidgetInstance[]) => [...state.slice(0, index), ...state.slice(index + 1)]);
};

const generateId = () => Math.floor(100000 * Math.random());

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
  const [widgetToAdd /*, setWidgetToAdd*/] = useState<keyof typeof WIDGETS>('ueBrowserWidget');
  const { t } = useAppTranslation();
  return (
    <>
      <Button onClick={modifyingLayout ? onDone : onModify}>{modifyingLayout ? 'Terminer' : 'Modifier'}</Button>
      {modifyingLayout && (
        <>
          {/*<select
            value={widgetToAdd}
            onChange={(e) => setWidgetToAdd((e.target as HTMLSelectElement).value as keyof typeof WIDGETS)}>
            <option value="widget1">widget1</option>
            <option value="widget2">widget2</option>
            <option value="widget3">widget3</option>
          </select>*/}
          <Button onClick={() => onAdd(widgetToAdd)}>{t('common:navbar.addWidget')}</Button>
        </>
      )}
    </>
  );
}

const WidgetBoardContext = createContext<WidgetInstance[]>([]);
export const useWidgetBoard = () => useContext(WidgetBoardContext);

export default function WidgetBoard() {
  const [widgets, setWidgets] = useState([
    { widget: 'ueBrowserWidget', x: 0, y: 0, width: 3, height: 2, id: generateId() },
    { widget: 'todaysBirthdays', x: 3, y: 0, width: 3, height: 10, id: generateId() },
    { widget: 'dailyTimetableWidget', x: 6, y: 0, width: 4, height: 10, id: generateId() },
    { widget: 'userBrowserWidget', x: 0, y: 2, width: 3, height: 2, id: generateId() },
  ] as WidgetInstance[]);

  const { markPageLoaded: markLoaded } = usePageLoaded();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [modifyingLayout, setModifyingLayout] = useState(false);
  const navbar = useNavbarPortal();

  const updateWidget = (widget: WidgetInstance) => update(setWidgets, widget);
  const insertWidget = (type: keyof typeof WIDGETS) => addWidget(setWidgets, type);
  const deleteWidget = (index: number) => removeWidget(setWidgets, index);

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
    [],
  );

  useEffect(() => {
    if (!resizeObserver) return;
    resizeObserver.observe(document.body);
    return () => resizeObserver.disconnect();
  }, [resizeObserver]);

  return (
    <WidgetBoardContext value={widgets}>
      {!isSmallScreen
        ? widgets.map((widget, i) => {
            return (
              <WidgetRenderer
                changeBB={(newWidget) => updateWidget({ ...widget, ...newWidget })}
                remove={() => deleteWidget(i)}
                key={widget.id}
                widget={widget}
                modifyingLayout={modifyingLayout}
                onLoaded={markLoaded}
              />
            );
          })
        : widgets.map((widget) => {
            const Widget = WIDGETS[widget.widget].component;
            return <Widget key={widget.id} />;
          })}
      {navbar &&
        createPortal(
          !isSmallScreen && (
            <AdditionalNavbarComponent
              modifyingLayout={modifyingLayout}
              onModify={() => setModifyingLayout(true)}
              onDone={() => setModifyingLayout(false)}
              onAdd={(widget) => insertWidget(widget)}
            />
          ),
          navbar,
        )}
    </WidgetBoardContext>
  );
}
