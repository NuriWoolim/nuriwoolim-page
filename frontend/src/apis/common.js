const baseURL = import.meta.env.VITE_API_URL;

import axios from "axios";

const api = axios.create({
  baseURL: baseURL,
  timeout: 3000,
  headers: {},
});

export const TimeTableAPI = {
  createTimeTable: async (data) => {
    const result = {
      data: {
        id: 1,
        title: "로켓트",
        team: "진석팀",
        description: "보컬 없는 합주 준사운드에서",
        color: 1,
        start: "2025-8-14T16:00", //"2023-12-25T16:00"
        end: "2025-8-14T18:00", //"2023-12-25T18:00"
      },
      status: 200,
    };
    return result;
  },
  getTimeTable: async (data) => {
    const result = {
      response: 200,
      data: {
        from: "2025-8-14T09:00", // "2023-12-25T16:00"
        to: "2025-8-14T22:00", // "2023-12-25T18:00"
        data: [
          {
            id: 1,
            title: "로켓트",
            team: "진석팀",
            description: "보컬 없는 합주 준사운드에서",
            color: "4",
            start: "2025-8-14T16:00", //"2023-12-25T16:00"
            end: "2025-8-14T18:00", //"2023-12-25T18:00"
          },
          {
            id: 2,
            title: "사랑하긴했었나요스텨가는인연이었나요",
            team: "지은팀",
            description: "보컬 없는 합주 준사운드에서 ㅣ안ㄹㄴㅁ아ㅣㅜ러물",
            color: "1",
            start: "2025-8-14T10:00", //"2023-12-25T16:00"
            end: "2025-8-14T12:00", //"2023-12-25T18:00"
          },
          {
            id: 3,
            title: "게와수돗물",
            team: "호정팀",
            description: "끝나고 회식하죠",
            color: "5",
            start: "2025-8-14T12:00", //"2023-12-25T16:00"
            end: "2025-8-14T13:30", //"2023-12-25T18:00"
          },
          {
            id: 4,
            title: "마지막 편지",
            team: "동혁팀",
            description: "보컬 없는 합주 준사운드에서 ㅣ안ㄹㄴㅁ아ㅣㅜ러물",
            color: "2",
            start: "2025-8-16T20:00", //"2023-12-25T16:00"
            end: "2025-8-16T22:00", //"2023-12-25T18:00"
          },
        ],
      },
    };
    return result;
  },
  deleteTimeTable: {},
  updateTimeTable: {},
};
