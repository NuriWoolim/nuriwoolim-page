import {
  clearAccessToken,
  extractAccessToken,
  getAccessToken,
  publicApi,
  setAccessToken,
} from "./client";

const unwrap = (response) => response.data;

export const AuthAPI = {
  signup: async ({ name, email, password, code }) =>
    unwrap(
      await publicApi.post("/api/auth/signup", {
        name,
        email,
        password,
        code,
      })
    ),

  sendSignupVerification: async ({ email }) =>
    unwrap(
      await publicApi.post("/api/auth/signup/send-verification", {
        email,
      })
    ),

  verifySignupEmail: async ({ email, code }) =>
    unwrap(
      await publicApi.post("/api/auth/signup/verify-email", {
        email,
        code,
      })
    ),

  checkEmail: async ({ email }) =>
    unwrap(
      await publicApi.post("/api/auth/check-email", {
        email,
      })
    ),

  sendPasswordResetVerification: async ({ email }) =>
    unwrap(
      await publicApi.post("/api/auth/password-reset/send-verification", {
        email,
      })
    ),

  resetPassword: async ({ email, code }) =>
    unwrap(
      await publicApi.post("/api/auth/reset-password", {
        email,
        code,
      })
    ),

  login: async ({ email, password }) => {
    const response = await publicApi.post("/api/auth/login", {
      email,
      password,
    });

    const accessToken = extractAccessToken(response.headers);
    if (accessToken) setAccessToken(accessToken);

    return response.data;
  },

  logout: async () => {
    try {
      return unwrap(await publicApi.post("/api/auth/logout", {}));
    } finally {
      clearAccessToken();
    }
  },

  refresh: async () => {
    const token = getAccessToken();
    const response = await publicApi.post(
      "/api/auth/refresh",
      {},
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : undefined,
      }
    );

    const accessToken = extractAccessToken(response.headers);
    if (accessToken) setAccessToken(accessToken);

    return {
      accessToken,
      data: response.data,
    };
  },
};
