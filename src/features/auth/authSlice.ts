import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserSession } from "@/features/auth/sessionStorage";
import { RootState } from "@/store/store";

type AuthState = {
  user: UserSession | null;
  restored: boolean;
};

const initialState: AuthState = {
  user: null,
  restored: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreSession(state, action: PayloadAction<UserSession | null>) {
      state.user = action.payload;
      state.restored = true;
    },
    login(state, action: PayloadAction<UserSession>) {
      state.user = action.payload;
      state.restored = true;
    },
    logout(state) {
      state.user = null;
      state.restored = true;
    },
  },
});

export const { restoreSession, login, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
