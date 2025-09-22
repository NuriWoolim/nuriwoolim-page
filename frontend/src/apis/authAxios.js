import axios from "axios";
import { getNewRefreshToken } from "./user";

const BASE_URL = import.meta.env.VITE_API_URL;

export const getAuthAxios = () => {
  // Generate instance
  const authAxios = axios.create({
    baseURL: BASE_URL,
    withCredentials: false, // 일반 API 요청에는 RefreshToken 쿠키를 포함시키지 않을 것
  });

  // 요청 직전에 accessToken을 매번 최신으로 자동으로 붙이기
  authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    // 이때 /api/auth는 비인증 구간이므로 토큰 금지.
    if (token && !config.url.startsWith("/api/auth")) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 응답 오류 처리 (accessToken 만료 시 자동으로 갱신 후, 재요청)
  authAxios.interceptors.response.use(
    (response) => response, // 응답이 잘 왔으면 받은 응답을 반환
    async (error) => {
      const original = error.config;

      // 네트워크 에러라면 그냥 던지기
      if (!error.response) return Promise.reject(error);

      // 401일 때만 토큰 재발급 시도
      if (error.response.status === 401 && !original._retry) {
        original._retry = true;
        try {
          const result = await getNewRefreshToken();
          const newToken = result.accessToken;
          if (newToken) {
            localStorage.setItem("accessToken", newToken);
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newToken}`;
          }
          // 원래 요청 그대로 재시도하기
          return authAxios(original);
        } catch (error) {
          localStorage.removeItem("accessToken");
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
  return authAxios;
};
