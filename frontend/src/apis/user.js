import axios from "axios";
import { getAuthAxios } from "./authAxios";

const baseURL = "https://nuriwoolim.n-e.kr";

export const signup = async (username, email, password, nickname) => {
  const result = await axios.post(`${baseURL}/api/auth/signup`, {
    username,
    email,
    password,
    nickname,
  });
  return result;
};

export const login = async (username, password) => {
  const result = await axios.post(
    `${baseURL}/api/auth/login`,
    {
      username,
      password,
    },
    {
      withCredentials: true,
    }
  );

  const accessToken = result.headers["authorization"]?.split("Bearer ")[1]; // 응답 형식 : Authorization: Bearer abc.def.jhi
  if (accessToken) localStorage.setItem("accessToken", accessToken);

  return result.data;
};

export const logout = async () => {
  try {
    await axios.post(
      `${baseURL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
  } catch (error) {
    console.error("로그아웃 요청 실패", error);
  } finally {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }
};

export const getMyPage = async (token) => {
  const authAxios = getAuthAxios(token);
  const result = authAxios.get("/accounts/mypage");
  return result;
};

export const getNewRefreshToken = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const result = await axios.post(
      `${baseURL}/api/auth/refresh`,
      {
        refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return result.data;
  } catch (error) {
    alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/"; // 강제 이동!
  }
};
