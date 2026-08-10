const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }
  });

  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Server is starting up, please try again in a few seconds.");
  }

  if (!response.ok || result.success === false) {
    const error = new Error(result.error?.message || "Request failed.");
    error.code = result.error?.code;
    throw error;
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

export function getBookings(jwt) {
  return request("/bookings", {
    headers: { Authorization: `Bearer ${jwt}` }
  });
}

export function updateBookingStatus(jwt, id, status, driverName) {
  return request(`/bookings/${id}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${jwt}` },
    body: JSON.stringify(driverName ? { status, driverName } : { status })
  });
}
