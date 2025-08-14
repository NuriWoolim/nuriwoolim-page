const baseURL = import.meta.env.VITE_API_URL;

export const TimeTableAPI = {
  createTimeTable: async (data) => {
    const result = {
      id: 1,
      title: "로켓트",
      team: "진석팀",
      description: "보컬 없는 합주 준사운드에서",
      start: "2025-8-14T16:00", //"2023-12-25T16:00"
      end: "2025-8-14T18:00", //"2023-12-25T18:00"
    };
    return result;
  },
  getTimeTable: async (data) => {
    const result = {
      from: "2025-8-14T09:00", // "2023-12-25T16:00"
      to: "2025-8-14T22:00", // "2023-12-25T18:00"
      timetables: [
        {
          id: 1,
          title: "로켓트",
          team: "진석팀",
          description: "보컬 없는 합주 준사운드에서",
          start: "2025-8-14T16:00", //"2023-12-25T16:00"
          end: "2025-8-14T18:00", //"2023-12-25T18:00"
        },
        {
          id: 2,
          title: "사랑하긴했었나요스텨가는인연이었나요",
          team: "지은팀",
          description: "보컬 없는 합주 준사운드에서 ㅣ안ㄹㄴㅁ아ㅣㅜ러물",
          start: "2025-8-14T10:00", //"2023-12-25T16:00"
          end: "2025-8-14T12:00", //"2023-12-25T18:00"
        },
        {
          id: 3,
          title: "게와수돗물",
          team: "호정팀",
          description: "끝나고 회식하죠",
          start: "2025-8-14T12:00", //"2023-12-25T16:00"
          end: "2025-8-14T14:00", //"2023-12-25T18:00"
        },
        {
          id: 4,
          title: "마지막 편지",
          team: "동혁팀",
          description: "보컬 없는 합주 준사운드에서 ㅣ안ㄹㄴㅁ아ㅣㅜ러물",
          start: "2025-8-14T20:00", //"2023-12-25T16:00"
          end: "2025-8-14T22:00", //"2023-12-25T18:00"
        },
      ],
    };
    return result;
  },
  deleteTimeTable: {},
  updateTimeTable: {},
};
