import { privateApi } from "./client";

const unwrap = (response) => response.data;

export const DevAPI = {
  changeRole: async ({ email, role }) =>
    unwrap(
      await privateApi.get("/api/dev/change-role", {
        params: { email, role },
      })
    ),
};
