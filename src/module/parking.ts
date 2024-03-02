import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import Widget1 from '@/components/homeWidgets/Widget1';
import Widget2 from '@/components/homeWidgets/Widget2';
import Widget3 from '@/components/homeWidgets/Widget3';

export type BoundingBox = { x: number; y: number; width: number; height: number };
export type WidgetInstance = BoundingBox & { widget: keyof typeof WIDGETS; id: number };

export const WIDGETS = {
  widget1: Widget1,
  widget2: Widget2,
  widget3: Widget3,
} as const;

export const gridSize = [10, 10];

export const pageSettingsSlice = createSlice({
  name: 'user',
  reducers: {
    setParking: (state, action: PayloadAction<WidgetInstance[]>) => action.payload,
  },
  initialState: [
    { widget: 'widget1', x: 0, y: 0, width: 1, height: 1, id: Math.random() },
    { widget: 'widget2', x: 0, y: 1, width: 3, height: 1, id: Math.random() },
    { widget: 'widget3', x: 3, y: 0, width: 1, height: 2, id: Math.random() },
  ] as WidgetInstance[],
});

export const { setParking } = pageSettingsSlice.actions;

export default pageSettingsSlice.reducer;
