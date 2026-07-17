const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }
  });
  const result = await response.json();
  if (!response.ok || result.success === false) {
    throw new Error(result.error?.message || "Request failed.");
  }
  return result.data;
}

export function login(password) {
  return request("/auth/login", { method: "POST", body: JSON.stringify({ password }) });
}

export function registerPushToken(jwt, token, platform) {
  return request("/admin/push-tokens", {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({ token, platform })
  });
}
