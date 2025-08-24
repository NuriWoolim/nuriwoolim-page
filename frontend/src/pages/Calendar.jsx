import { React, useState, useEffect } from "react";
import styled from "styled-components";
import DateCell from "./calendar/DateCell";
import { TimeTableAPI } from "../apis/common";
import { createDate } from "../tools/DateTool";

/* Calendar 섹션의 전체 배경 */
const CalendarSection = styled.section`
  background-color: #fefaef;
  padding: 45px 0;
`;

/* Calendar 섹션의 컨테이너 박스 */

const CalendarWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 0px 40px 40px;
  background-color: #ffffff;
  border: 4px solid #033148;

  > h2 {
    font-family: Plus Jakarta Sans;
    font-weight: 800;
    font-size: 40px;
    line-height: 127%;
    letter-spacing: -6%;
    text-transform: uppercase;
  }

  > p {
    font-family: Pretendard;
    font-weight: 500;
    font-size: 30px;
    line-height: 127%;
    letter-spacing: -3%;
    text-transform: uppercase;
  }

  > ul {
    list-style: none;
    padding: 0;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, calc(100% / 7));
  grid-template-rows: 30px repeat(6, 120px);
  width: 100%;

  border: 2px black solid;
`;

const WeekDayCell = styled.div`
  border: solid 2px blue;
`;

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
  const firstDayOfWeek = startDate.getDay();

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

const Calendar = () => {
  const row = 6;
  const col = 7;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const curDate = new Date();

  const [calendarState, setCalendarState] = useState(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    return createCalendarData(startDate);
  });

  const getTimeTables = async () => {
    try {
      // 한달간 기간 설정
      const result = await TimeTableAPI.getTimeTable();
      const resultdata = result.data;

      const newMonthTT = Array.from({ length: 42 }, () => []);
      calendarState.dates.map((date, i) => {
        resultdata.data.map((timetable) => {
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
    }
  };
  const [monthTT, setMonthTT] = useState(() =>
    Array.from({ length: 30 }, () => [])
  );

  const onMonthChange = (direction) => {
    setCalendarState((prevState) => {
      const newStartDate = new Date(prevState.startDate);
      newStartDate.setMonth(newStartDate.getMonth() + direction);
      return createCalendarData(newStartDate);
    });
  };

  useEffect(() => {
    getTimeTables();
  }, [calendarState]);

  const getColor = (date) => {
    const isSameMonth = date.getMonth() === calendarState.startDate.getMonth();
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) {
      // 일요일
      return isSameMonth ? "red" : "rgba(255,0,0,0.7)";
    } else if (dayOfWeek === 6) {
      // 토요일
      return isSameMonth ? "blue" : "rgba(0,255,255,0.7)";
    } else {
      // 평일
      return isSameMonth ? "black" : "gray";
    }
  };

  return (
    <CalendarSection>
      <CalendarWrapper>
        <h2>CALENDAR</h2>
        <h2>
          {calendarState.startDate.getFullYear()}년{" "}
          {calendarState.startDate.getMonth() + 1}월
        </h2>
        <button onClick={() => onMonthChange(1)}>up</button>
        <button onClick={() => onMonthChange(-1)}>down</button>
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
                color={getColor(calendarState.dates[index])}
              />
            );
          })}
        </GridContainer>
      </CalendarWrapper>
    </CalendarSection>
  );
};

export default Calendar;
