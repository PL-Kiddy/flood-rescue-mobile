import { API_BASE_URL } from '../constants/api';

let authToken = null;
let onUnauthorized = null;

export function setApiToken(token) {
  authToken = token;
}

export function setOnUnauthorized(callback) {
  onUnauthorized = callback;
}

function getHeaders(customHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && onUnauthorized) {
    onUnauthorized();
  }
  if (!res.ok) {
    const err = new Error(data.message || data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: getHeaders(options.headers),
  });
  return handleResponse(res);
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body) => apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
};
