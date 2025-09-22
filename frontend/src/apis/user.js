import axios from "axios";
import { getAuthAxios } from "./authAxios";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/* 회원가입 */
export const signup = async (name, email, password, code) => {
  const result = await api.post("/api/auth/signup", {
    name,
    email,
    password,
    code,
  });
  return result.data;
};

/* 비밀번호 재설정 */
export const resetPassword = async (email, password, code) => {
  const result = await api.post("/api/auth/reset-password", {
    email,
    password,
    code,
  });
  return result.data;
};

/* 새 RefreshToken 발급 */

export const getNewRefreshToken = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const result = await api.post("/api/auth/refresh", {});
    return result.data;
  } catch (error) {
    alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
    localStorage.removeItem("accessToken");
    window.location.href = "/"; // 강제 이동!
  }
};

/* 로그아웃 */
export const logout = async () => {
  try {
    await api.post("/api/auth/logout", {});
  } catch (error) {
    console.error("로그아웃 요청 실패", error);
  } finally {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }
};

/* 로그인 */
export const login = async (email, password) => {
  const result = await api.post("/api/auth/login", {
    email,
    password,
  });

  const accessToken = result.headers["authorization"]?.split("Bearer ")[1]; // 응답 형식 : Authorization: Bearer abc.def.jhi
  if (accessToken) localStorage.setItem("accessToken", accessToken);

  return result.data;
};

/* 메일 인증 */
export const verifyEmail = async (email, code) => {
  const result = await api.get("/api/auth/verify-email", {
    params: { email, code },
  });
  return result.data;
};

/* 메일 인증 코드 보내기 */
export const sendVerification = async (email) => {
  const result = await api.get("/api/auth/send-verification", {
    params: { email },
  });
  return result.data;
};

/* 메일 중복 확인 */
export const checkEmail = async (email) => {
  const result = await api.get("/api/auth/check-email", {
    params: { email },
  });
  return result.data;
};

export const getMyPage = async (token) => {
  const authAxios = getAuthAxios(token);
  const result = authAxios.get("/accounts/mypage");
  return result;
};
