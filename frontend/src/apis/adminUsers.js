import { privateApi } from "./client";

const unwrap = (response) => response.data;

const toPageableParams = ({ page = 0, size = 10, sort = [] } = {}) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  sort.forEach((value) => params.append("sort", value));
  return params;
};

export const AdminUsersAPI = {
  list: async ({ keyword, type, pageable } = {}) =>
    unwrap(
      await privateApi.get("/api/admin/users", {
        params: (() => {
          const params = toPageableParams(pageable);
          if (keyword) params.set("keyword", keyword);
          if (type) params.set("type", type);
          return params;
        })(),
      })
    ),

  get: async (userId) =>
    unwrap(await privateApi.get(`/api/admin/users/${userId}`)),

  remove: async (userId) =>
    unwrap(await privateApi.delete(`/api/admin/users/${userId}`)),

  changeRole: async (userId, type) =>
    unwrap(
      await privateApi.patch(`/api/admin/users/${userId}/role`, {
        type,
      })
    ),

  getPosts: async (userId, pageable) =>
    unwrap(
      await privateApi.get(`/api/admin/users/${userId}/posts`, {
        params: toPageableParams(pageable),
      })
    ),

  getComments: async (userId, pageable) =>
    unwrap(
      await privateApi.get(`/api/admin/users/${userId}/comments`, {
        params: toPageableParams(pageable),
      })
    ),

  getDashboard: async () =>
    unwrap(await privateApi.get("/api/admin/users/dashboard")),
};
