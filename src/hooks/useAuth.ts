

import { useAppSelector } from '../app/hook';
import { selectCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice';

export const useAuth = () => {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return {
    user,
    isAuthenticated,
  };
};