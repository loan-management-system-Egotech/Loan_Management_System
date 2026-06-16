// ---------------------------------------------------------------------------
// Centralised API client for the LoanPro frontend.
//
//  - Prepends the configured API base URL to every request path.
//  - Attaches the stored JWT as a Bearer token automatically.
//  - Parses JSON responses and surfaces the backend's error `message`.
//  - On a 401 (expired / invalid session) it clears the stored session and
//    dispatches an `auth:unauthorized` event so the app can redirect to
//    /login — EXCEPT for the auth endpoints themselves, where a 401 simply
//    means "wrong credentials" and should be shown on the form.
//
// Usage:  import { apiGet, apiPost } from '../api/apiClient';
// ---------------------------------------------------------------------------

const API_BASE_URL =
  (import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:8080/api';

const TOKEN_KEY = 'loanpro_token';
const USER_KEY = 'loanpro_user';

// ---- Session storage helpers (single source of truth for the keys) --------

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ---- Error type carrying the HTTP status + parsed backend payload ---------

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

function isAuthEndpoint(path) {
  return path.replace(/^\//, '').startsWith('auth/');
}

async function request(method, path, body, { isFormData = false } = {}) {
  const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let payload;
  if (isFormData) {
    payload = body; // let the browser set the multipart boundary itself
  } else if (body !== undefined && body !== null) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, { method, headers, body: payload });
  } catch {
    throw new ApiError(
      'Unable to reach the server. Check your connection and that the backend is running.',
      0,
      null,
    );
  }

  // Parse the body once (may be empty for 204 No Content).
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    // A 401 on a protected endpoint means the session expired or is invalid.
    if (response.status === 401 && !isAuthEndpoint(path)) {
      clearSession();
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    const message =
      (data && typeof data === 'object' && data.message) ||
      (typeof data === 'string' && data) ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const apiGet = (path) => request('GET', path);
export const apiPost = (path, body) => request('POST', path, body);
export const apiPut = (path, body) => request('PUT', path, body);
export const apiDelete = (path) => request('DELETE', path);
export const apiUpload = (path, formData) => request('POST', path, formData, { isFormData: true });

export default {
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiUpload,
  getToken,
  getStoredUser,
  setSession,
  clearSession,
};
