import { privateApi } from "./client";

const unwrap = (response) => response.data;

export const UsersAPI = {
  getMe: async () => unwrap(await privateApi.get("/api/users/me")),

  changePassword: async ({
    currentPassword,
    newPassword,
    newPasswordConfirm,
  }) =>
    unwrap(
      await privateApi.patch("/api/users/password-change", {
        currentPassword,
        newPassword,
        newPasswordConfirm,
      })
    ),
};
