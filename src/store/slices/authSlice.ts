import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, refreshToken, getStoredTokens, isTokenExpired, saveTokens } from '../../services/authService';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;

export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const tokens = await login(email, password);
    saveTokens(tokens);
    // TODO: Fetch user profile using the access token
    // For now, we'll just set a mock user
    dispatch(setUser({
      id: '1',
      email,
      username: email.split('@')[0],
    }));
  } catch (error: any) {
    const errorMessage = error.message || 'Login failed';
    dispatch(setError(errorMessage));
    throw error; // Re-throw the error to be caught by the Login component
  } finally {
    dispatch(setLoading(false));
  }
};

export const checkAuth = () => async (dispatch: any) => {
  const { accessToken, refreshToken: storedRefreshToken, tokenExpiresAt, refreshTokenExpiresAt } = getStoredTokens();
  
  if (!accessToken || !storedRefreshToken) {
    return;
  }

  if (isTokenExpired(tokenExpiresAt)) {
    if (isTokenExpired(refreshTokenExpiresAt)) {
      // Both tokens expired, user needs to login again
      return;
    }
    try {
      const newTokens = await refreshToken(storedRefreshToken);
      saveTokens(newTokens);
      // TODO: Fetch user profile using the new access token
    } catch (error) {
      // Refresh token failed, user needs to login again
      return;
    }
  }

  // TODO: Fetch user profile using the access token
  // For now, we'll just set the authenticated state
  dispatch(setUser({
    id: '1',
    email: 'user@example.com',
    username: 'user',
  }));
};

export default authSlice.reducer; 