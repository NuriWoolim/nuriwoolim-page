const baseURL = import.meta.env.VITE_API_URL;

import axios from "axios";
import { getAuthAxios } from "./authAxios";

const api = getAuthAxios();

export const TimeTableAPI = {
  createTimeTable: async ({ title, description, team, color, start, end }) => {
    const accessToken = localStorage.getItem("accessToken");

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
    const result = await api.get(`${baseURL}/api/timetables`, {
      params: {
        from,
        to,
      },
      withCredentials: true,
    });
    return result;
  },
  deleteTimeTable: {},
  updateTimeTable: {},
};
