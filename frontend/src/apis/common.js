const baseURL = import.meta.env.VITE_API_URL;

import axios from "axios";
import { getAuthAxios } from "./authAxios";

const api = getAuthAxios();

export const TimeTableAPI = {
  createTimeTable: async ({ title, description, team, color, start, end }) => {
    const result = await api.post(
      `${baseURL}/api/timetables`,
      {
        title,
        description,
        team,
        color,
        start,
        end,
      }
      //   {
      //     // headers: {
      //     //   Authorization: `Bearer ${accessToken}`,
      //     // },
      //     // withCredentials: true,
      //   }
    );

    return result;
  },
  getTimeTable: async (from, to) => {
    // get은 토큰 필요 없어서 auth 아닌 일반 axious로
    const result = await axios.get(`${baseURL}/api/timetables`, {
      params: {
        from,
        to,
      },
      withCredentials: true,
    });
    return result;
  },
  deleteTimeTable: async (id) => {
    const result = await api.delete(`${baseURL}/api/timetables/${id}`);
    return result;
  },
  updateTimeTable: async ({
    title,
    description,
    team,
    color,
    start,
    end,
    id,
  }) => {
    const result = await api.patch(`${baseURL}/api/timetables/${id}`, {
      title,
      description,
      team,
      color,
      start,
      end,
    });
    return result;
  },
};
