import React from "react";
import styled from "styled-components";
import DateCell from "./calendar/DateCell";

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
  grid-template-columns: repeat(7, 100px);
  grid-template-rows: 30px repeat(6, 110px);

  border: 2px black solid;
  width: 700px;
`;

const WeekDayCell = styled.div`
  border: solid 2px blue;
`;

const Calendar = () => {
  const row = 6;
  const col = 7;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const curDate = new Date();

  const firstDay = new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    1
  ).getDay();

  const lastDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth() + 1,
    0
  ).getDate();

  const prevLastDate = new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    0
  ).getDate();

  const createCalendarDates = () => {
    const dates = [];

    // 이전 달 날짜
    for (let i = firstDay - 1; i >= 0; i--) {
      dates.push(
        new Date(
          curDate.getFullYear(),
          curDate.getMonth() - 1,
          prevLastDate - i
        )
      );
    }

    // 이번 달 날짜
    for (let date = 1; date <= lastDate; date++) {
      dates.push(new Date(curDate.getFullYear(), curDate.getMonth(), date));
    }

    // 다음 달 날짜
    const totalCells = row * col;
    const remainingCells = totalCells - dates.length;
    for (let date = 1; date <= remainingCells; date++) {
      dates.push(new Date(curDate.getFullYear(), curDate.getMonth() + 1, date));
    }

    return dates;
  };

  const calendarDates = createCalendarDates();

  return (
    <CalendarSection>
      <CalendarWrapper>
        <h2>CALENDAR</h2>
        <GridContainer>
          {Array.from({ length: col }, (_, index) => {
            return <WeekDayCell key={index}> {days[index]} </WeekDayCell>;
          })}
          {Array.from({ length: col * row }, (_, index) => {
            return (
              <DateCell key={index} dateObj={calendarDates[index]} />
            );
          })}
        </GridContainer>
      </CalendarWrapper>
    </CalendarSection>
  );
};

export default Calendar;
