import { React, useState, useRef } from "react";
import styled from "styled-components";
import { TimeTableAPI } from "../../apis/common";
import DetailedDate from "./DetailedDate";
import { lighten } from "polished";

const DateCellContainer = styled.div`

  padding: 0.4rem;
  border-right: 1px solid #033148;
  border-bottom: 1px solid #033148;
  background-color: ${({ $isSameMonth }) =>
    $isSameMonth ? "#fff" : "#EFE7D1"};

  color: rgba(0, 0, 0, ${({ $isSameMonth }) => ($isSameMonth ? "1" : "0.4")});

  p {
    margin-bottom: 0.2rem;
  }
`;

const TimeTableContainer = styled.div`
  height: 1.7rem;
  width: 100%;

  display: flex;
  padding: 2px;
  gap: 0.35rem;
  box-sizing: border-box;

  font-family: "Pretendard";
  font-size: 0.85rem;

  .time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1.2 0 0;
    padding-left: 0.2rem;
    padding-right: 0.2rem;

    text-align: center;
    font-weight: 900;
    border: none;
    border-radius: 2px;
    background-color: ${(props) => props.$color};
    color: ${(props) => lighten(0.5, props.$color)};
    white-space: nowrap; /* 줄바꿈 안 함 */
    overflow: hidden; /* 넘친 부분 숨김 */
    text-overflow: ellipsis;
  }

  .title {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 2 0 0;
    padding-left: 0.2rem;
    padding-right: 0.2rem;

    text-align: center;
    font-weight: 700;
    border: none;
    border-radius: 2px;

    background-color: ${(props) => lighten(0.4, props.$color)};
    color: ${({ $color }) => $color};
    white-space: nowrap; /* 줄바꿈 안 함 */
    overflow: hidden; /* 넘친 부분 숨김 */
    text-overflow: ellipsis;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
`;

const DropdownContainer = styled.div`
  position: fixed;
  z-index: 20;
  background: white;
  box-shadow: 4px 4px 18px rgba(0, 0, 0, 0.6);
  min-width: 300px;
  overflow: auto;

  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  transform: translate(-50%, -50%);
`;

const DateCell = ({ dateObj, timetables, isSameMonth, getMonthTimeTables }) => {
  const date = new Date(dateObj);
  const today = new Date();

  // api 불러오는 중인 상태 (필요 없을 수도)
  const [loading, setLoading] = useState(true);

  const [isDetailedDateOpen, setIsDetailedDateOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const divRef = useRef(null);

  // 드롭다운 열기 함수 (dateObj를 클릭할 때 호출)
  const openDetailedDate = (event) => {
    const rect = divRef.current.getBoundingClientRect();
    setDropdownPosition({
      x: rect.left + rect.width / 2,
      y: window.innerHeight / 2,
    });
    setIsDetailedDateOpen(true);
  };

  // 드롭다운 닫기
  const closeDetailedDate = () => {
    setIsDetailedDateOpen(false);
  };


  return (
    <>
      <DateCellContainer
        onClick={openDetailedDate}
        $isSameMonth={isSameMonth}
        ref={divRef}
      >
        <p>{date.getDate()}</p>

        {timetables
          ? timetables.slice(0, 2).map((timetable, index) => (
              <TimeTableContainer key={index} $color={"#" + timetable.color}>
                <div className="time">
                  {timetable.start.split("T")[1].split(":")[0]}:
                  {timetable.start.split("T")[1].split(":")[1]}
                </div>
                <div className="title">{timetable.title}</div>
              </TimeTableContainer>
            ))
          : null}

        {timetables && timetables.length > 2 && (
          <div>외 {timetables.length - 2}개 일정</div>
        )}
      </DateCellContainer>

      {isDetailedDateOpen && <Overlay onClick={closeDetailedDate} />}
      {isDetailedDateOpen && (
        <DropdownContainer $x={dropdownPosition.x} $y={dropdownPosition.y}>
          <DetailedDate
            dateObj={dateObj}
            getMonthTimeTables={getMonthTimeTables}
            onClose={() => setIsDetailedDateOpen(false)}
          />
        </DropdownContainer>
      )}
    </>
  );
};

export default DateCell;
