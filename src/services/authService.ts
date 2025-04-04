import axios from 'axios';

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080';
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || 'morocco-view';
const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'morocco-view-client';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

export const login = async (username: string, password: string): Promise<TokenResponse> => {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'password');
  formData.append('client_id', KEYCLOAK_CLIENT_ID);
  formData.append('username', username);
  formData.append('password', password);

  try {
    const response = await axios.post(
      `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response?.status >= 400 && error.response?.status < 500) {
      throw new Error(error.response?.data?.error_description || 'Invalid credentials');
    }
    throw error;
  }
};

export const refreshToken = async (refreshToken: string): Promise<TokenResponse> => {
  const formData = new URLSearchParams();
  formData.append('grant_type', 'refresh_token');
  formData.append('client_id', KEYCLOAK_CLIENT_ID);
  formData.append('refresh_token', refreshToken);

  const response = await axios.post(
    `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
};

export const saveTokens = (tokens: TokenResponse) => {
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
  localStorage.setItem('token_expires_at', (Date.now() + tokens.expires_in * 1000).toString());
  localStorage.setItem('refresh_token_expires_at', (Date.now() + tokens.refresh_expires_in * 1000).toString());
};

export const getStoredTokens = () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const tokenExpiresAt = localStorage.getItem('token_expires_at');
  const refreshTokenExpiresAt = localStorage.getItem('refresh_token_expires_at');

  return {
    accessToken,
    refreshToken,
    tokenExpiresAt: tokenExpiresAt ? parseInt(tokenExpiresAt) : null,
    refreshTokenExpiresAt: refreshTokenExpiresAt ? parseInt(refreshTokenExpiresAt) : null,
  };
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
  localStorage.removeItem('refresh_token_expires_at');
};

export const isTokenExpired = (expiresAt: number | null) => {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt;
};

export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

export const getUserInfo = () => {
  const { accessToken } = getStoredTokens();
  if (!accessToken) return null;

  const decodedToken = parseJwt(accessToken);
  if (!decodedToken) return null;

  return {
    name: `${decodedToken.given_name || ''} ${decodedToken.family_name || ''}`.trim(),
    email: decodedToken.email || '',
    address: decodedToken.address || '',
    phone_number: decodedToken.phone_number || ''
  };
}; 