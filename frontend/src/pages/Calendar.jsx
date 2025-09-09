import { React, useState, useEffect } from "react";
import styled from "styled-components";
import DateCell from "./calendar/DateCell";
import { TimeTableAPI } from "../apis/common";
import { createDate } from "../tools/DateTool";

/* Calendar 섹션의 전체 배경 */
const CalendarSection = styled.section`
  background-color: #fefaef;
  padding: 2.8rem 0;
`;

/* Calendar 섹션의 컨테이너 박스 */
const CalendarWrapper = styled.div`
  width: 92%;
  margin: 0 auto;
  padding: 0px 17rem 0 17rem;
  box-sizing: border-box;
  background-color: #ffffff;
  border: 4px solid #033148;

  > ul {
    list-style: none;
    padding: 0;
  }
`;

// 전체 테이블
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, calc(100% / 7));
  grid-template-rows: 2.7rem repeat(6, 9rem);
  width: 100%;

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
  width: 17rem;
  justify-content: space-between;
  align-items: center;
  margin: 1.2rem 0 1.2rem 0;
  h2 {
    color: #486284;

    font-family: Pretendard;
    font-size: 2.2rem;
    font-weight: 900;
    margin: 0;
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

  button img{
    height: 1.5rem;
    margin-top: 5px;
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

  return (
    <CalendarSection>
      <CalendarWrapper>
        <h1>CALENDAR</h1>

        <MonthYearContainer>
          <button onClick={() => onMonthChange(-1)}>
            <img src="/assets/rightarrow_blue.svg" className="down" />
          </button>
          <h2>
            {months[calendarState.startDate.getMonth()]},{" "}
            {calendarState.startDate.getFullYear()}
          </h2>
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
                isSameMonth={
                  calendarState.dates[index].getMonth() ===
                  calendarState.startDate.getMonth()
                }
              />
            );
          })}
        </GridContainer>
      </CalendarWrapper>
    </CalendarSection>
  );
};

export default Calendar;
