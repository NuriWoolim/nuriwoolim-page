import { React, useState, useEffect } from "react";
import styled from "styled-components";
import { TimeTableAPI } from "../../apis/common";
import CustomModal from "../CustomModal";
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

const DateCell = ({ dateObj, timetables, color }) => {
  const date = new Date(dateObj);
  const today = new Date();

  // api 불러오는 중인 상태 (필요 없을 수도)
  const [loading, setLoading] = useState(true);

  const [isDetailedDateOpen, setIsDetailedDateOpen] = useState(false);

  return (
    <>
      <DateCellContainer
        $color={color}
        onClick={() => setIsDetailedDateOpen(true)}
      >
        <h2>{date.getDate()}</h2>

        {timetables
          ? timetables.slice(0, 2).map((timetable, index) => (
              <TimeTableContainer key={index}>
                {timetable.start.split("T")[1]} {timetable.title}
              </TimeTableContainer>
            ))
          : null}

        {timetables && timetables.length > 2 && (
          <div>외 {timetables.length - 2}개 일정</div>
        )}
      </DateCellContainer>

      <CustomModal
        isOpen={isDetailedDateOpen}
        onRequestClose={() => setIsDetailedDateOpen(false)}
      >
        <DetailedDate dateObj={dateObj} />
      </CustomModal>
    </>
  );
};

export default DateCell;
