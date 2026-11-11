const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API Request Failed');
  }

  return data;
}

export async function login(email, password) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(userData) {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function logout() {
  const result = await request('/logout', { method: 'POST' });
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  return result;
}

export async function getCurrentUser() {
  return request('/me');
}

export async function listRecords(moduleSlug, params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/${moduleSlug}` + (query ? `?${query}` : '');
  return request(endpoint);
}

export async function getRecordById(moduleSlug, id) {
  return request(`/${moduleSlug}/${id}`);
}

export async function createRecord(moduleSlug, payload) {
  return request(`/${moduleSlug}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateRecord(moduleSlug, id, payload) {
  return request(`/${moduleSlug}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function patchRecord(moduleSlug, id, payload) {
  return request(`/${moduleSlug}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteRecord(moduleSlug, id) {
  return request(`/${moduleSlug}/${id}`, {
    method: 'DELETE',
  });
}

export async function updateRecordStatus(moduleSlug, id, status) {
  return request(`/${moduleSlug}/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function listAuditLogs(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = '/audit/logs' + (query ? `?${query}` : '');
  return request(endpoint);
}

export async function getSystemHealth() {
  return request('/system/health');
}

export async function toggleModuleMaintenance(moduleCode) {
  return request(`/system/modules/${moduleCode}/toggle-maintenance`, {
    method: 'POST',
  });
}

export { request };
