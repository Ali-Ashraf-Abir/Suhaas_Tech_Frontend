import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import { authAPI } from '../features/auth/authApi';
import { inviteAPI } from '../features/inviteApi';
import { userApi } from '../features/userApi';
import { projectAPI } from '../features/projectApi';


export const store = configureStore({
  
  reducer: {
    auth: authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [inviteAPI.reducerPath]: inviteAPI.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [projectAPI.reducerPath]: projectAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authAPI.middleware)
      .concat(inviteAPI.middleware)
      .concat(userApi.middleware)
      .concat(projectAPI.middleware),
});

setupListeners(store.dispatch);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

