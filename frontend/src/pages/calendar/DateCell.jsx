import styled from "styled-components";
import { lighten } from "polished";

const DateCellContainer = styled.div`
  padding: 0.4rem;
  border-right: 1px solid #033148;
  border-bottom: 1px solid #033148;
  background-color: ${({ $isSameMonth }) =>
    $isSameMonth ? "#fff" : "#EFE7D1"};
  color: rgba(0, 0, 0, ${({ $isSameMonth }) => ($isSameMonth ? "1" : "0.4")});
  cursor: pointer;
  overflow: hidden;

  p {
    margin-bottom: 0.2rem;
  }
`;

/* 스케줄 아이템 (일정 텍스트) */
const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 1px 2px;
  font-family: "Pretendard";
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.4;
  color: ${(props) => props.$color || "#486284"};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .dot {
    width: 0.45rem;
    height: 0.45rem;
    min-width: 0.45rem;
    border-radius: 50%;
    background-color: ${(props) => props.$color || "#F8C61E"};
  }

  .schedule-title {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

/* 타임테이블 태그 (칸 형식) */
const TimeTableTag = styled.div`
  height: 1.4rem;
  width: 100%;
  display: flex;
  gap: 0.25rem;
  box-sizing: border-box;
  margin-top: 1px;
  font-family: "Pretendard";
  font-size: 0.7rem;

  .time {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1.2 0 0;
    padding: 0 0.15rem;
    font-weight: 900;
    border-radius: 2px;
    background-color: ${(props) => props.$color};
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 2 0 0;
    padding: 0 0.15rem;
    font-weight: 700;
    border-radius: 2px;
    background-color: ${(props) => {
      try {
        return lighten(0.35, props.$color);
      } catch {
        return "#eee";
      }
    }};
    color: ${(props) => props.$color};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const OverflowText = styled.div`
  font-family: "Pretendard";
  font-size: 0.65rem;
  font-weight: 600;
  color: #888;
  padding: 1px 2px;
  margin-top: 1px;
`;

const DateCell = ({
  dateObj,
  timetables,
  schedules,
  isSameMonth,
  onOpenDetailedDate,
}) => {
  const date = new Date(dateObj);

  const openDetailedDate = (event) => {
    event.stopPropagation();
    if (typeof onOpenDetailedDate === "function") onOpenDetailedDate(dateObj);
  };

  // 셀 내 총 표시 가능한 아이템 수 (공간 제약)
  const maxItems = 3;
  const scheduleItems = schedules || [];
  const timetableItems = timetables || [];
  const totalItems = scheduleItems.length + timetableItems.length;

  // 스케줄 먼저, 남은 슬롯에 타임테이블
  const visibleSchedules = scheduleItems.slice(0, maxItems);
  const remainingSlots = Math.max(0, maxItems - visibleSchedules.length);
  const visibleTimetables = timetableItems.slice(0, remainingSlots);
  const overflowCount = totalItems - visibleSchedules.length - visibleTimetables.length;

  return (
    <DateCellContainer onClick={openDetailedDate} $isSameMonth={isSameMonth}>
      <p>{date.getDate()}</p>

      {/* 스케줄 (일정) 표시 */}
      {visibleSchedules.map((schedule) => (
        <ScheduleItem
          key={`s-${schedule.id}`}
          $color={schedule.color ? `#${schedule.color}` : "#486284"}
        >
          <span className="dot" />
          <span className="schedule-title">{schedule.title}</span>
        </ScheduleItem>
      ))}

      {/* 타임테이블 (합주) 표시 - 칸 형식 태그 */}
      {visibleTimetables.map((timetable) => {
        const color = timetable.color ? `#${timetable.color}` : "#486284";
        const startTime = timetable.start?.split("T")[1] || "";
        const startHour = startTime.split(":")[0] || "";
        const startMin = startTime.split(":")[1] || "";
        return (
          <TimeTableTag key={`t-${timetable.id}`} $color={color}>
            <div className="time">
              {startHour}:{startMin}
            </div>
            <div className="title">{timetable.title}</div>
          </TimeTableTag>
        );
      })}

      {overflowCount > 0 && (
        <OverflowText>외 {overflowCount}개 일정</OverflowText>
      )}
    </DateCellContainer>
  );
};

export default DateCell;
