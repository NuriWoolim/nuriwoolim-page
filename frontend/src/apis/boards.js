import { privateApi, publicApi } from "./client";

const unwrap = (response) => response.data;

export const BoardsAPI = {
  list: async ({ page = 0, size = 10 } = {}) =>
    unwrap(
      await publicApi.get("/api/boards", {
        params: { page, size },
      })
    ),

  get: async (boardId) => unwrap(await publicApi.get(`/api/boards/${boardId}`)),

  create: async ({ title, description, type }) =>
    unwrap(
      await privateApi.post("/api/boards", {
        title,
        description,
        type,
      })
    ),

  update: async (boardId, { title, description, type }) =>
    unwrap(
      await privateApi.patch(`/api/boards/${boardId}`, {
        title,
        description,
        type,
      })
    ),

  remove: async (boardId) => unwrap(await privateApi.delete(`/api/boards/${boardId}`)),
};
