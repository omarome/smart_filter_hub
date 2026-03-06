/**
 * API client for the Smart Filter Hub backend.
 *
 * The base URL is configured via the VITE_API_BASE_URL environment variable:
 *   - Development: http://localhost:8080/api  (direct to Spring Boot)
 *   - Production:  /api                       (NGINX reverse proxy or proxy rule)
 *
 * Optional HTTP Basic credentials can be provided via two additional
 * environment variables. In Netlify you would define:
 *
 *   VITE_API_USERNAME = yourUsername
 *   VITE_API_PASSWORD = yourPassword
 *
 * The helper below will automatically add an Authorization header when both
 * values are present.
 */
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// build auth header if username/password are supplied
function getAuthHeader() {
  const user = import.meta.env.VITE_API_USERNAME;
  const pass = import.meta.env.VITE_API_PASSWORD;
  if (user && pass) {
    const token = btoa(`${user}:${pass}`);
    return { Authorization: `Basic ${token}` };
  }
  return {};
}

/**
 * Fetches all users from the backend API.
 */
export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE}/users`, {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }
  return response.json();
};

/**
 * Fetches field/variable definitions from the backend API.
 * Each variable has: id, name, label, offset, type (UDINT, STRING, BOOL, etc.)
 */
export const fetchVariables = async () => {
  const response = await fetch(`${API_BASE}/variables`, {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch variables: ${response.status}`);
  }
  return response.json();
};
