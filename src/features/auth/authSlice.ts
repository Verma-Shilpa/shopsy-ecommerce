import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserSession } from "@/features/auth/sessionStorage";
import type { RootState } from "@/store/store";

type AuthState = {
  user: UserSession | null;
  hydrated: boolean;
};

const initialState: AuthState = {
  user: null,
  hydrated: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateSession(state, action: PayloadAction<UserSession | null>) {
      state.user = action.payload;
      state.hydrated = true;
    },
    login(state, action: PayloadAction<UserSession>) {
      state.user = action.payload;
      state.hydrated = true;
    },
    logout(state) {
      state.user = null;
      state.hydrated = true;
    }
  }
});

export const { hydrateSession, login, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export default authSlice.reducer;
