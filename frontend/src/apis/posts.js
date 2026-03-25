import { privateApi, publicApi } from "./client";

const unwrap = (response) => response.data;

export const PostsAPI = {
  list: async ({ boardId, page = 0, size = 10 }) =>
    unwrap(
      await publicApi.get("/api/posts", {
        params: { boardId, page, size },
      })
    ),

  get: async (postId) => unwrap(await privateApi.get(`/api/posts/${postId}`)),

  create: async ({ boardId, title, content, type }) =>
    unwrap(
      await privateApi.post("/api/posts", {
        boardId,
        title,
        content,
        type,
      })
    ),

  update: async (postId, { title, content, type }) =>
    unwrap(
      await privateApi.patch(`/api/posts/${postId}`, {
        title,
        content,
        type,
      })
    ),

  remove: async (postId) => unwrap(await privateApi.delete(`/api/posts/${postId}`)),
};
