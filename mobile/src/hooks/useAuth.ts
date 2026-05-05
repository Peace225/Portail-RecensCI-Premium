import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import { RootState } from '../store';
import { login, logout, setAuthReady } from '../store/userSlice';
import api from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const checkSession = async () => {
      const token = await SecureStore.getItemAsync('recensci_token');
      if (!token) {
        dispatch(logout());
        dispatch(setAuthReady(true));
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        dispatch(login({
          id: data.id,
          name: data.fullName || data.name || data.email,
          email: data.email || '',
          role: data.role,
          nni: data.nni || null,
          photoUrl: data.photoUrl || data.photo_url || null,
          structureId: data.institutionId || data.institution_id || data.structureId || null,
        }));
      } catch {
        await SecureStore.deleteItemAsync('recensci_token');
        dispatch(logout());
      } finally {
        dispatch(setAuthReady(true));
      }
    };
    checkSession();
  }, [dispatch]);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('recensci_token');
    dispatch(logout());
  };

  return {
    user: userState.isLoggedIn ? userState : null,
    loading: !userState.isAuthReady,
    isLoggedIn: userState.isLoggedIn,
    role: userState.role,
    logout: handleLogout,
  };
};
