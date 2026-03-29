import { TimeTablesAPI } from "./timetables";
import { SchedulesAPI } from "./schedules";

const asAxiosLike = async (promise) => ({
  data: await promise,
});

export const TimeTableAPI = {
  createTimeTable: async ({ title, description, team, color, start, end }) => {
    return asAxiosLike(
      TimeTablesAPI.create({
        title,
        description,
        team,
        color,
        start,
        end,
      })
    );
  },
  getTimeTable: async (from, to) => {
    return asAxiosLike(
      TimeTablesAPI.list({
        from,
        to,
      })
    );
  },
  deleteTimeTable: async (id) => asAxiosLike(TimeTablesAPI.remove(id)),
  updateTimeTable: async ({
    title,
    description,
    team,
    color,
    start,
    end,
    id,
  }) => {
    return asAxiosLike(
      TimeTablesAPI.update(id, {
        title,
        description,
        team,
        color,
        start,
        end,
      })
    );
  },
};

export const ScheduleAPI = {
  getSchedule: async (from, to) =>
    asAxiosLike(
      SchedulesAPI.list({
        from,
        to,
      })
    ),
};

export const TimeLineAPI = {
  createTimeLine: async ({ title, description, color, start, end }) => {
    return asAxiosLike(
      SchedulesAPI.create({
        title,
        description,
        color,
        start,
      })
    );
  },
  getTimeLine: async (from, to) => {
    return asAxiosLike(
      SchedulesAPI.listForTimeline({
        from,
        to,
      })
    );
  },
  deleteTimeLine: async (id) => asAxiosLike(SchedulesAPI.remove(id)),
  updateTimeLine: async ({ title, description, color, start, end, id }) =>
    asAxiosLike(
      SchedulesAPI.update(id, {
        title,
        description,
        color,
        start,
      })
    ),
};
