import { normalizeColor, privateApi, publicApi } from "./client";

const unwrap = (response) => response.data;

const toPayload = ({ title, description = "", team, color, start, end }) => ({
  title,
  description,
  team,
  color: normalizeColor(color),
  start,
  end,
});

export const TimeTablesAPI = {
  list: async ({ from, to } = {}) =>
    unwrap(
      await publicApi.get("/api/timetables", {
        params: { from, to },
      })
    ),

  create: async (payload) =>
    unwrap(await privateApi.post("/api/timetables", toPayload(payload))),

  update: async (timetableId, payload) =>
    unwrap(
      await privateApi.patch(`/api/timetables/${timetableId}`, toPayload(payload))
    ),

  remove: async (timetableId) =>
    unwrap(await privateApi.delete(`/api/timetables/${timetableId}`)),
};
