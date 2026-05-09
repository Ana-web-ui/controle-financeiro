// services/api.js
const API_URL = "http://127.0.0.1:8000";

// ─── Helpers de token ───────────────────────────────────────────
function getAccessToken() {
  return localStorage.getItem("access_token");
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

function saveTokens(access_token, refresh_token) {
  localStorage.setItem("access_token", access_token);
  if (refresh_token) {
    localStorage.setItem("refresh_token", refresh_token);
  }
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// ─── Renovação automática do access token ───────────────────────
async function refreshAccessToken() {
  const refresh_token = getRefreshToken();

  if (!refresh_token) {
    clearTokens();
    window.location.href = "/login";
    return null;
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) {
    clearTokens();
    window.location.href = "/login";
    return null;
  }

  const data = await response.json();
  saveTokens(data.access_token, null); // só atualiza o access token
  return data.access_token;
}

// ─── Fetch com retry automático ─────────────────────────────────
// Substitui o fetch normal: se receber 401, renova o token e tenta de novo
async function apiFetch(endpoint, options = {}) {
  const token = getAccessToken();

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  let response = await fetch(`${API_URL}${endpoint}`, config);

  // Token expirou — tenta renovar e repetir a requisição
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (!newToken) return null; // redirecionou pro login

    config.headers.Authorization = `Bearer ${newToken}`;
    response = await fetch(`${API_URL}${endpoint}`, config);
  }

  return response;
}

// ─── Auth ────────────────────────────────────────────────────────
export async function register(email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erro ao registrar");
  }

  return data;
}

export async function login(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erro ao fazer login");
  }

  // Salva os dois tokens (seu backend precisa retornar os dois)
  saveTokens(data.access_token, data.refresh_token);

  return data;
}

export async function logout() {
  const refresh_token = getRefreshToken();

  if (refresh_token) {
    await apiFetch("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    });
  }

  clearTokens();
  window.location.href = "/login";
}

// ─── Usuário ─────────────────────────────────────────────────────
export async function getMe() {
  const response = await apiFetch("/me");
  return response?.json();
}

// ─── Chat ────────────────────────────────────────────────────────
export async function sendMessage(message) {
  const response = await apiFetch("/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

  return response?.json();
}