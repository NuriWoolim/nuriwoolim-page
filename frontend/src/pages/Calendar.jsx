import { React, useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import DateCell from "./calendar/DateCell";
import DetailedDate from "./calendar/DetailedDate";
import WeeklyTimeTable from "./calendar/WeeklyTimeTable";
import { TimeTableAPI, ScheduleAPI } from "../apis/common";
import { createDate } from "../tools/DateTool";
/* Calendar 섹션의 전체 배경 */
const CalendarSection = styled.section`
  h1 {
    font-weight: 800;
    /* color: #033148; */
    font-size: 3rem;
    letter-spacing: -1.8px;
    margin: 2.1rem 0 2.1rem 0;
  }

  h2 {
    font-family: Pretendard;
    font-weight: 900;
    /* color: #fff; */
    font-size: 2rem;
    margin-top: 0;
    margin-bottom: 0;
  }

  h3 {
    font-family: Pretendard;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 800;
    line-height: normal;
    letter-spacing: -0.5px;
  }

  h4 {
    font-family: Pretendard;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-top: 0;
    margin-bottom: 0;
  }

  p {
    font-family: Pretendard;
    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    line-height: 110%;
    letter-spacing: -0.02369rem;

    margin-top: 0;
    margin-bottom: 0;
  }

  background-color: #fefaef;
  padding: 80px 0 7rem 0;

  .calendarTitle {
    font-family: Pretendard;
    font-weight: 800;
    font-size: 56px;
    line-height: 219%;
    letter-spacing: -0.05em;
    text-align: center;
    text-transform: uppercase;
    color: #033148;
    margin-bottom: 0;
  }
`;

/* Calendar 섹션의 컨테이너 박스 */
const CalendarWrapper = styled.div`
  display: flex;
  justify-content: center;

  /* padding: 0px 3rem; */
`;
const LeftPart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// 전체 테이블
const GridContainer = styled.div`
  display: grid;
  width: 105rem;
  grid-template-columns: repeat(7, 15rem);
  grid-template-rows: 4.5rem repeat(6, 14.2rem);

  border-top: 1px solid #033148;
  border-left: 1px solid #033148;
`;

// Days of Weeks의 셀 한 칸.
const WeekDayCell = styled.div`
  padding: 0.6rem;

  border-right: 1px solid #033148;
  border-bottom: 1px solid #033148;
  background: #486284;
  color: #fefaef;
  font-family: Pretendard;
  font-size: 1.1rem;
  font-weight: 800;
`;

// 현재 년월 라벨과 버튼들을 감싸는 컨테이너
const MonthYearContainer = styled.div`
  display: flex;
  width: 105rem;
  align-items: center;
  padding: 1.2rem 0 1.2rem 0;

  /* margin: 0 10px; */
  p {
    color: #486284;
    font-family: Pretendard;
    font-size: 2.2rem;
    font-weight: 900;
    padding: 0 15px;
  }
  button {
    background: none; /* 배경 제거 */
    width: 2rem;
    border: none; /* 보더 제거 */
    padding: 0; /* 기본 패딩 제거 */
    cursor: pointer; /* 포인터 커서 */
  }

  button:focus {
    outline: none;
  }

  button img {
    height: 1.5rem;
    margin-top: 5px;
    /* padding-inline: 10px; */
    /* margin-left: 10px; */
    /* margin-right: 10px; */
  }
  button:hover img {
    filter: brightness(0.8); /* 밝게 */
  }
  button:active img {
    filter: brightness(0.6); /* 어둡게 */
  }

  .down {
    transform: scaleX(-1);
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: white;
  box-shadow: 4px 4px 18px rgba(0, 0, 0, 0.6);
  overflow: hidden;
`;

function toLocalISOString(date) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 0부터 시작하니까 +1
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// YYYY-MM-DD 형식 (string($date) 타입 API용)
function toLocalDateString(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// 현재 달의 날짜들을 찾고 올바른 위치를 찾아주는 함수
const createCalendarData = (startDate) => {
  const dates = [];
  const row = 6;
  const col = 7;

  // 현재 달의 마지막 날
  const lastDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  ).getDate();

  // 이전 달의 마지막 날
  const prevLastDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    0
  ).getDate();

  // 첫 번째 날의 요일 (0: 일요일, 1: 월요일, ...)
  const firstDayOfWeek = (startDate.getDay() + 6) % 7;

  // 이전 달 날짜들 추가
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    dates.push(
      new Date(
        startDate.getFullYear(),
        startDate.getMonth() - 1,
        prevLastDate - i
      )
    );
  }

  // 현재 달 날짜들 추가
  for (let date = 1; date <= lastDate; date++) {
    dates.push(new Date(startDate.getFullYear(), startDate.getMonth(), date));
  }

  // 다음 달 날짜들 추가
  const totalCells = row * col;
  const remainingCells = totalCells - dates.length;
  for (let date = 1; date <= remainingCells; date++) {
    dates.push(
      new Date(startDate.getFullYear(), startDate.getMonth() + 1, date)
    );
  }

  return {
    startDate: startDate,
    dates: dates,
  };
};

const getWeekStartMonday = (date) => {
  const start = new Date(date);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
};

const isSameDate = (a, b) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const Calendar = () => {
  const row = 6;
  const col = 7;
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const curDate = new Date();

  const weekDates = useMemo(() => {
    const monday = getWeekStartMonday(curDate);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, []);

  const [calendarState, setCalendarState] = useState(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    return createCalendarData(startDate);
  });
  const [selectedDateObj, setSelectedDateObj] = useState(null);

  const getTimeTables = async () => {
    try {
      // 한달간 기간 설정
      const from = toLocalISOString(calendarState.dates[0]);
      const to = toLocalISOString(
        calendarState.dates[calendarState.dates.length - 1]
      );

      // 응답 딜레이 시 잔상 안남기도록 제거
      setMonthTT(() => Array.from({ length: 42 }, () => []));
      const result = await TimeTableAPI.getTimeTable(from, to);
      const timetables = result?.data?.data ?? [];

      const newMonthTT = Array.from({ length: 42 }, () => []);
      calendarState.dates.map((date, i) => {
        timetables.map((timetable) => {
          const start = createDate(timetable.start);
          const end = createDate(timetable.end);

          if (
            date.getDate() == start.getDate() &&
            date.getMonth() == start.getMonth()
          )
            newMonthTT[i].push(timetable);

          if (end.getDate() != start.getDate()) {
            if (
              date.getDate() == end.getDate() &&
              date.getMonth() == end.getMonth()
            )
              newMonthTT[i].push(timetable);
          }
        });
      });

      setMonthTT(newMonthTT);
    } catch (error) {
      console.log("getTimeTable error ", error);
      setMonthTT(Array.from({ length: 42 }, () => []));
    }
  };
  const [monthTT, setMonthTT] = useState(() =>
    Array.from({ length: 42 }, () => [])
  );
  const [weekTT, setWeekTT] = useState(() =>
    Array.from({ length: 7 }, () => [])
  );
  const [monthSchedules, setMonthSchedules] = useState(() =>
    Array.from({ length: 42 }, () => [])
  );

  const getWeekTimeTables = async () => {
    try {
      const fromDate = new Date(weekDates[0]);
      fromDate.setHours(0, 0, 0, 0);

      const toDate = new Date(weekDates[6]);
      toDate.setHours(23, 59, 0, 0);

      setWeekTT(() => Array.from({ length: 7 }, () => []));
      const result = await TimeTableAPI.getTimeTable(
        toLocalISOString(fromDate),
        toLocalISOString(toDate)
      );
      const timetables = result?.data?.data ?? [];

      const newWeekTT = Array.from({ length: 7 }, () => []);
      weekDates.forEach((dayDate, dayIndex) => {
        timetables.forEach((timetable) => {
          const start = createDate(timetable.start);
          const end = createDate(timetable.end);

          if (isSameDate(start, dayDate)) {
            newWeekTT[dayIndex].push(timetable);
          } else if (!isSameDate(start, end) && isSameDate(end, dayDate)) {
            newWeekTT[dayIndex].push(timetable);
          }
        });
      });

      setWeekTT(newWeekTT);
    } catch (error) {
      console.log("getWeekTimeTable error ", error);
      setWeekTT(Array.from({ length: 7 }, () => []));
    }
  };

  const getSchedules = async () => {
    try {
      const from = toLocalDateString(calendarState.dates[0]);
      const to = toLocalDateString(
        calendarState.dates[calendarState.dates.length - 1]
      );

      setMonthSchedules(() => Array.from({ length: 42 }, () => []));
      const result = await ScheduleAPI.getSchedule(from, to);
      const schedules = result?.data?.data ?? [];

      const newMonthSchedules = Array.from({ length: 42 }, () => []);
      calendarState.dates.forEach((date, i) => {
        schedules.forEach((schedule) => {
          // schedule.date는 "2023-12-25" 형식
          const [year, month, day] = schedule.date.split("-").map(Number);
          if (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          ) {
            newMonthSchedules[i].push(schedule);
          }
        });
      });

      setMonthSchedules(newMonthSchedules);
    } catch (error) {
      console.log("getSchedule error ", error);
      setMonthSchedules(Array.from({ length: 42 }, () => []));
    }
  };

  const onMonthChange = (direction) => {
    setCalendarState((prevState) => {
      const newStartDate = new Date(prevState.startDate);
      newStartDate.setMonth(newStartDate.getMonth() + direction);
      return createCalendarData(newStartDate);
    });
  };

  const openDetailedDate = (dateObj) => {
    setSelectedDateObj(dateObj);
  };

  const closeDetailedDate = (event) => {
    if (event && event.target !== event.currentTarget) return;
    setSelectedDateObj(null);
  };

  useEffect(() => {
    getTimeTables();
    getSchedules();
  }, [calendarState]);

  useEffect(() => {
    getWeekTimeTables();
  }, [weekDates]);

  const refreshAllTimeTables = () => {
    getTimeTables();
    getWeekTimeTables();
  };

  return (
    <CalendarSection>
      <h1 className="calendarTitle">CALENDAR</h1>
      <CalendarWrapper>
        <LeftPart style={{ alignItems: "center" }}>
          <WeeklyTimeTable
            weekDates={weekDates}
            weekTT={weekTT}
            onOpenDetailedDate={openDetailedDate}
          />

          <MonthYearContainer>
            <button onClick={() => onMonthChange(-1)}>
              <img src="/assets/rightarrow_blue.svg" className="down" />
            </button>
            <p>
              {months[calendarState.startDate.getMonth()]},{" "}
              {calendarState.startDate.getFullYear()}
            </p>
            <button onClick={() => onMonthChange(1)}>
              <img src="/assets/rightarrow_blue.svg" className="up" />
            </button>
          </MonthYearContainer>

          <GridContainer>
            {Array.from({ length: col }, (_, index) => {
              return <WeekDayCell key={index}> {days[index]} </WeekDayCell>;
            })}
            {Array.from({ length: col * row }, (_, index) => {
              return (
                <DateCell
                  key={index}
                  dateObj={calendarState.dates[index]}
                  timetables={monthTT[index]}
                  schedules={monthSchedules[index]}
                  isSameMonth={
                    calendarState.dates[index].getMonth() ===
                    calendarState.startDate.getMonth()
                  }
                  isSelected={selectedDateObj === calendarState.dates[index]}
                  onOpenDetailedDate={openDetailedDate}
                />
              );
            })}
          </GridContainer>
        </LeftPart>
      </CalendarWrapper>
      {selectedDateObj &&
        ReactDOM.createPortal(
          <ModalBackdrop onPointerDown={closeDetailedDate}>
            <ModalContainer onPointerDown={(e) => e.stopPropagation()}>
              <DetailedDate
                dateObj={selectedDateObj}
                getMonthTimeTables={refreshAllTimeTables}
                onClose={() => setSelectedDateObj(null)}
              />
            </ModalContainer>
          </ModalBackdrop>,
          document.body
        )}
    </CalendarSection>
  );
};

export default Calendar;
