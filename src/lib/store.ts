import { applyMiddleware, compose, configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { nodeEnv } from '@/utils/environment';
import rootReducer from '@/module';

const enhancers: [] = [];
const middleware = [thunk];

if (nodeEnv() === 'development') {
  middleware.push(createLogger({ collapsed: true }) as never);
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

export const store = configureStore({
  reducer: rootReducer,
  enhancers: [composedEnhancers],
  devTools: nodeEnv() === 'development',
  middleware,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
