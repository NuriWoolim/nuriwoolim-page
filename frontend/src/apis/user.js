import { store, userDataState } from "../atoms";
import { RESET } from "jotai/utils";
import { AuthAPI } from "./auth";
import { UsersAPI } from "./users";
import { clearAccessToken } from "./client";

const syncUserState = (userData) => {
  store.set(userDataState, userData);
  return userData;
};

export const signup = async (name, email, password, code) =>
  AuthAPI.signup({
    name,
    email,
    password,
    code,
  });

export const sendVerification = async (email) =>
  AuthAPI.sendSignupVerification({
    email,
  });

export const verifyEmail = async (email, code) =>
  AuthAPI.verifySignupEmail({
    email,
    code,
  });

export const checkEmail = async (email) =>
  AuthAPI.checkEmail({
    email,
  });

export const sendPasswordResetVerification = async (email) =>
  AuthAPI.sendPasswordResetVerification({
    email,
  });

export const resetPassword = async (email, code) =>
  AuthAPI.resetPassword({
    email,
    code,
  });

export const login = async (email, password) => {
  const userData = await AuthAPI.login({
    email,
    password,
  });

  return syncUserState(userData);
};

export const logout = async () => {
  store.set(userDataState, RESET);
  try {
    await AuthAPI.logout();
  } catch (error) {
    console.error("로그아웃 요청 실패", error);
  } finally {
    clearAccessToken();
    window.location.href = "/login";
  }
};

export const getMyPage = async () => {
  const userData = await UsersAPI.getMe();
  return syncUserState(userData);
};

export const getNewRefreshToken = async () => {
  try {
    return await AuthAPI.refresh();
  } catch (error) {
    alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
    clearAccessToken();
    window.location.href = "/"; // 강제 이동!
  }
};

export const changePassword = async ({
  currentPassword,
  newPassword,
  newPasswordConfirm,
}) =>
  UsersAPI.changePassword({
    currentPassword,
    newPassword,
    newPasswordConfirm,
  });
