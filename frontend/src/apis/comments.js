import { privateApi, publicApi } from "./client";

const unwrap = (response) => response.data;

export const CommentsAPI = {
  list: async ({ postId, page = 0, size = 20 }) =>
    unwrap(
      await publicApi.get("/api/comments", {
        params: { postId, page, size },
      })
    ),

  get: async (commentId) =>
    unwrap(await publicApi.get(`/api/comments/${commentId}`)),

  create: async ({ postId, content }) =>
    unwrap(
      await privateApi.post("/api/comments", {
        postId,
        content,
      })
    ),

  update: async (commentId, { content }) =>
    unwrap(
      await privateApi.patch(`/api/comments/${commentId}`, {
        content,
      })
    ),

  remove: async (commentId) =>
    unwrap(await privateApi.delete(`/api/comments/${commentId}`)),
};
