import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import DailyTimetableWidget from '@/components/homeWidgets/DailyTimetableWidget';
import UEBrowserWidget from '@/components/homeWidgets/UEBrowserWidget';
import TestWidget from '@/components/homeWidgets/TestWidget';

export type BoundingBox = { x: number; y: number; width: number; height: number };
export type WidgetInstance = BoundingBox & { widget: keyof typeof WIDGETS; id: number };

export function collidesWith(bb1: BoundingBox, bb2: BoundingBox) {
  return (
    bb1.x + bb1.width > bb2.x && bb2.x + bb2.width > bb1.x && bb1.y + bb1.height > bb2.y && bb2.y + bb2.height > bb1.y
  );
}

export const WIDGETS = {
  dailyTimetableWidget: { component: DailyTimetableWidget, minWidth: 3, minHeight: 3 },
  ueBrowserWidget: { component: UEBrowserWidget, minWidth: 3, minHeight: 3 },
  // test: TestWidget,
} as const;

export const gridSize = [10, 10];

export const pageSettingsSlice = createSlice({
  name: 'user',
  reducers: {
    modifyBB: {
      reducer: (state, action: PayloadAction<{ index: number; widget: WidgetInstance }>) => [
        ...state.slice(0, action.payload.index),
        action.payload.widget,
        ...state.slice(action.payload.index + 1),
      ],
      prepare: (index: number, widget: WidgetInstance) => ({ payload: { index, widget } }),
    },
    addWidget: {
      reducer: (state, action: PayloadAction<Omit<WidgetInstance, keyof BoundingBox>>) => {
        for (let y = 0; y < gridSize[1]; y++) {
          for (let x = 0; x < gridSize[0]; x++) {
            const bb: BoundingBox = { x, y, width: 1, height: 1 };
            if (state.every((widget) => !collidesWith(bb, widget))) {
              return [...state, { ...action.payload, ...bb }];
            }
          }
        }
      },
      prepare: (widget: keyof typeof WIDGETS) => {
        return { payload: { widget, id: Math.random() } };
      },
    },
    removeWidget: {
      reducer: (state, action: PayloadAction<number>) => [
        ...state.slice(0, action.payload),
        ...state.slice(action.payload + 1),
      ],
      prepare: (index: number) => ({ payload: index }),
    },
  },
  initialState: [
    { widget: 'ueBrowserWidget', x: 0, y: 0, width: 3, height: 6, id: Math.random() },
    { widget: 'dailyTimetableWidget', x: 3, y: 1, width: 3, height: 3, id: Math.random() },
    // { widget: 'test', x: 0, y: 0, width: 1, height: 1, id: Math.random() },
  ] satisfies WidgetInstance[] as WidgetInstance[],
});

export const { modifyBB, addWidget, removeWidget } = pageSettingsSlice.actions;

export default pageSettingsSlice.reducer;
