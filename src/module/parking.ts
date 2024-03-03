import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import Widget1 from '@/components/homeWidgets/Widget1';
import Widget2 from '@/components/homeWidgets/Widget2';
import Widget3 from '@/components/homeWidgets/Widget3';

export type BoundingBox = { x: number; y: number; width: number; height: number };
export type WidgetInstance = BoundingBox & { widget: keyof typeof WIDGETS; id: number };

export function collidesWith(bb1: BoundingBox, bb2: BoundingBox) {
  return (
    bb1.x + bb1.width > bb2.x && bb2.x + bb2.width > bb1.x && bb1.y + bb1.height > bb2.y && bb2.y + bb2.height > bb1.y
  );
}

export const WIDGETS = {
  widget1: Widget1,
  widget2: Widget2,
  widget3: Widget3,
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
    { widget: 'widget1', x: 0, y: 0, width: 1, height: 1, id: Math.random() },
    { widget: 'widget2', x: 0, y: 1, width: 3, height: 1, id: Math.random() },
    { widget: 'widget3', x: 3, y: 0, width: 1, height: 2, id: Math.random() },
  ] as WidgetInstance[],
});

export const { modifyBB, addWidget, removeWidget } = pageSettingsSlice.actions;

export default pageSettingsSlice.reducer;
