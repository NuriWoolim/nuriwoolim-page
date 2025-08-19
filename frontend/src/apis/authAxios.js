import axios from "axios";
import { getNewRefreshToken } from "./user";

export const getAuthAxios = () => {
  // Generate instance
  const authAxios = axios.create({
    baseURL: "https://nuriwoolim.n-e.kr",
    withCredentials: false, // 일반 API 요청에는 RefreshToken 쿠키를 포함시키지 않을 것
  });

  // 요청 직전에 accessToken을 매번 최신으로 자동으로 붙이기
  authAxios.interceptors.response.use((config) => {
    const token = localStorage.getItem("accessToken");

    // 이때 /api/auth는 비인증 구간이므로 토큰 금지.
    if (token && !config.url.startsWith("/api/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 응답 오류 처리 (accessToken 만료 시 자동으로 갱신 후, 재요청)
  authAxios.interceptors.response.use(
    (response) => response.data, // 응답이 잘 왔으면 받은 응답을 반환
    async (error) => {
      // 에러가 발생했을 때 아래 코드들을 실행
      const result = getNewRefreshToken();
      error.config.headers.Authorization = result.accessToken;
      // 오류가 발생한 요청을 했을 때, 헤더에 담아서 보낸 토큰을 새 토큰으로 변경
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      return (await axios.get(error.config.url, error.config)).data;
      //에러가 발생한 요청의 url을 그대로 가져와서 사용하고, 필요한 데이터들은
      //error.config 객체 내에 담겨있기 때문에 그대로 다시 가져와서 get 요청
    }
  );
  return authAxios;
};
