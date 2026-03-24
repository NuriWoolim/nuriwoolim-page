import { normalizeColor, privateApi, publicApi, toDateString } from "./client";

const unwrap = (response) => response.data;

const toSchedulePayload = ({
  title,
  description = "",
  color,
  date,
  start,
}) => ({
  title,
  description,
  color: normalizeColor(color),
  date: date || toDateString(start),
});

const normalizeTimelineItem = (schedule) => ({
  ...schedule,
  start: `${schedule.date}T00:00`,
  end: `${schedule.date}T23:59`,
});

const normalizeTimelineList = (response) => ({
  ...response,
  data: (response?.data ?? []).map(normalizeTimelineItem),
});

export const SchedulesAPI = {
  list: async ({ from, to } = {}) =>
    unwrap(
      await publicApi.get("/api/schedules", {
        params: { from, to },
      })
    ),

  create: async (payload) =>
    unwrap(await privateApi.post("/api/admin/schedules", toSchedulePayload(payload))),

  get: async (scheduleId) =>
    unwrap(await privateApi.get(`/api/admin/schedules/${scheduleId}`)),

  update: async (scheduleId, payload) =>
    unwrap(
      await privateApi.patch(
        `/api/admin/schedules/${scheduleId}`,
        toSchedulePayload(payload)
      )
    ),

  remove: async (scheduleId) =>
    unwrap(await privateApi.delete(`/api/admin/schedules/${scheduleId}`)),

  listForTimeline: async ({ from, to } = {}) =>
    normalizeTimelineList(await SchedulesAPI.list({ from, to })),
};
