import axios from "axios";

export const API_ORIGIN = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

const createClient = () =>
  axios.create({
    baseURL: API_ORIGIN,
    withCredentials: true,
  });

export const publicApi = createClient();
export const privateApi = createClient();

export const getAccessToken = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("accessToken");
};

export const setAccessToken = (token) => {
  if (typeof window === "undefined" || !token) return;
  window.localStorage.setItem("accessToken", token);
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("accessToken");
};

export const extractAccessToken = (headers = {}) => {
  const headerValue =
    headers?.authorization ?? headers?.Authorization ?? headers?.Authorization?.toString?.();

  if (typeof headerValue !== "string") return null;
  if (!headerValue.startsWith("Bearer ")) return null;

  return headerValue.slice("Bearer ".length);
};

export const normalizeColor = (color = "") => color.replace("#", "").trim();

export const toDateString = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.split("T")[0];

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getAuthAxios = () => privateApi;

privateApi.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && config.url && !config.url.startsWith("/api/auth")) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const syncAccessToken = (response) => {
  const nextToken = extractAccessToken(response.headers);
  if (nextToken) setAccessToken(nextToken);
  return response;
};

publicApi.interceptors.response.use(syncAccessToken);

privateApi.interceptors.response.use(syncAccessToken, async (error) => {
  const originalRequest = error.config;
  const status = error.response?.status;

  if (!originalRequest || originalRequest._retry || status !== 401) {
    return Promise.reject(error);
  }

  if (originalRequest.url?.startsWith("/api/auth/refresh")) {
    clearAccessToken();
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  try {
    const currentToken = getAccessToken();
    const refreshResponse = await publicApi.post(
      "/api/auth/refresh",
      {},
      {
        headers: currentToken
          ? {
              Authorization: `Bearer ${currentToken}`,
            }
          : undefined,
      }
    );

    const refreshedToken = extractAccessToken(refreshResponse.headers);

    if (!refreshedToken) {
      clearAccessToken();
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;

    return privateApi(originalRequest);
  } catch (refreshError) {
    clearAccessToken();
    return Promise.reject(refreshError);
  }
});
