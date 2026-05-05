import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'CITIZEN' | 'AGENT' | 'ENTITY_ADMIN' | 'ADMIN' | 'SUPER_ADMIN';

export interface UserState {
  id: string | null;
  nni: string | null;
  name: string;
  email: string;
  photoUrl: string | null;
  role: UserRole | null;
  structureId: string | null;  // structureId = institutionId
  isLoggedIn: boolean;
  isAuthReady: boolean;
}

const initialState: UserState = {
  id: null,
  nni: null,
  name: '',
  email: '',
  photoUrl: null,
  role: null,
  structureId: null,
  isLoggedIn: false,
  isAuthReady: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Omit<UserState, 'isLoggedIn' | 'isAuthReady'>>) => {
      return { ...action.payload, isLoggedIn: true, isAuthReady: true };
    },
    logout: () => ({ ...initialState, isAuthReady: true }),
    setAuthReady: (state, action: PayloadAction<boolean>) => {
      state.isAuthReady = action.payload;
    },
  },
});

export const { login, logout, setAuthReady } = userSlice.actions;
export default userSlice.reducer;
