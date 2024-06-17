import { configureStore, type ThunkMiddleware } from '@reduxjs/toolkit';
import { type ThunkAction } from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { nodeEnv } from '@/utils/environment';
import rootReducer from '@/module';
import { type UnknownAction } from 'redux';

const middleware = [] as ThunkMiddleware[];

if (nodeEnv() === 'development') {
  middleware.push(createLogger({ collapsed: true }) as never);
}

export const store = configureStore({
  reducer: rootReducer,
  devTools: nodeEnv() === 'development',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>;
