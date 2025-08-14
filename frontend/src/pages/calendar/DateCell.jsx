import { React, useState, useEffect } from "react";
import styled from "styled-components";
import { TimeTableAPI } from "../../apis/common";
import DetailedDate from "./detailedDate";

const DateCellContainer = styled.div`
  h2 {
    font-size: 1rem;
    margin: 0px;
    margin-bottom: 5px;
  }
  border: solid 2px red;
  padding: 5px;
  color: ${({ $color }) => $color};
`;

const TimeTableContainer = styled.div`
  border: solid 2px green;
  padding: 2px;
  white-space: nowrap; /* 줄바꿈 안 함 */
  overflow: hidden; /* 넘친 부분 숨김 */
  text-overflow: ellipsis;
`;

const DateCell = ({ dateObj, color }) => {
  const date = new Date(dateObj);
  const today = new Date();

  const [timeTables, setTimeTables] = useState({ timetables: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTimeTables = async () => {
      try {
        setLoading(true);
        const result = await TimeTableAPI.getTimeTable();
        setTimeTables(result);
      } catch (error) {
        console.log("getTimeTable error ", error);
      } finally {
        setLoading(false);
      }
    };

    getTimeTables();
  }, []);

  

  return (
    <>
      <DateCellContainer $color={color}>
        <h2>{date.getDate()}</h2>

        {timeTables.timetables.slice(0, 2).map((timetable) => (
          <TimeTableContainer>
            {timetable.start.split("T")[1]} {timetable.title}
          </TimeTableContainer>
        ))}

        {timeTables.timetables.length > 2 && (
          <div>외 {timeTables.timetables.length - 2}개 일정</div>
        )}
      </DateCellContainer>

      {/* <DetailedDate timeTables={timeTables} /> */}
    </>
  );
};

export default DateCell;
