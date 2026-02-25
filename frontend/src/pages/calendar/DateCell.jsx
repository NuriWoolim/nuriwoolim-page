import { useRef, useLayoutEffect, useState } from "react";
import styled from "styled-components";

const DateCellContainer = styled.div`
  padding: 0.4rem;
  border-right: 1px solid #033148;
  border-bottom: 1px solid #033148;
  background-color: ${({ $isSameMonth }) =>
    $isSameMonth ? "#fff" : "#EFE7D1"};
  color: rgba(0, 0, 0, ${({ $isSameMonth }) => ($isSameMonth ? "1" : "0.4")});
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  p {
    margin-bottom: 0.2rem;
  }
`;

/* 스케줄 아이템 (일정 텍스트) */
const ScheduleItem = styled.div`
  height: 0.85rem;
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 0.3rem;
  margin-top: 0;
  font-family: "Pretendard";
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.06em;
  text-align: left;
  color: #FF8585;
  border-radius: 2px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* 타임테이블 태그 (칸 형식) */
const TimeTableTag = styled.div`
  width: 130px;
  height: 20px;
  min-width: 0;
  display: flex;
  gap: 3px;
  box-sizing: border-box;
  margin-top: 2px;
  opacity: 1;

  .time {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    min-width: 38px;
    box-sizing: border-box;
    padding: 3px 4px;
    font-family: "Pretendard";
    font-size: 12px;
    font-weight: 600;
    line-height: 100%;
    letter-spacing: -0.06em;
    text-align: center;
    border-radius: 6px;
    background-color: ${(props) => props.$color || "#486284"};
    color: #fff;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    padding: 3px 4px;
    font-family: "Pretendard";
    font-size: 12px;
    font-weight: 600;
    line-height: 100%;
    letter-spacing: -0.06em;
    text-align: left;
    border-radius: 6px;
    background-color: ${(props) => props.$color || "#486284"};
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const TodayBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background-color: #F8C61E;
  font-weight: 700;
`;

const OverflowText = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  height: 20px;
  box-sizing: border-box;
  padding: 3px 4px;
  border-radius: 6px;
  background-color: #424242;
  font-family: "Pretendard";
  font-size: 12px;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: -0.06em;
  color: #F5F5F5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
/* 더보기를 title 영역에만 맞추기 위한 투명 spacer */
const TimeSpacer = styled.div`
  width: 38px;
  min-width: 38px;
  box-sizing: border-box;
  padding: 3px 4px;
  font-family: "Pretendard";
  font-size: 12px;
  font-weight: 600;
  visibility: hidden;
  flex-shrink: 0;
  white-space: nowrap;
`;
// 각 항목의 실제 픽셀 높이 (CSS 고정값 기준)
const SCHEDULE_H = 14;  // 0.85rem ≈ 14px
const BLOCK_H = 32;     // TimeTableTag 30px + margin-top 2px
const OVERFLOW_H = 32;  // OverflowText 30px + margin-top 2px

const DateCell = ({
  dateObj,
  timetables,
  schedules,
  isSameMonth,
  onOpenDetailedDate,
}) => {
  const containerRef = useRef(null);
  const dateLabelRef = useRef(null);
  const [availableHeight, setAvailableHeight] = useState(null);

  const date = new Date(dateObj);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const openDetailedDate = (event) => {
    event.stopPropagation();
    if (typeof onOpenDetailedDate === "function") onOpenDetailedDate(dateObj);
  };

  useLayoutEffect(() => {
    if (!containerRef.current || !dateLabelRef.current) return;
    const cH = containerRef.current.clientHeight;
    const style = getComputedStyle(containerRef.current);
    const pTop = parseFloat(style.paddingTop);
    const pBottom = parseFloat(style.paddingBottom);
    const dateH = dateLabelRef.current.offsetHeight;
    const dateMB =
      parseFloat(getComputedStyle(dateLabelRef.current).marginBottom) || 0;
    setAvailableHeight(cH - pTop - pBottom - dateH - dateMB);
  }, []);

  const allSchedules = schedules || [];
  const allTimetables = timetables || [];
  const allItems = [
    ...allSchedules.map((s) => ({ type: "s", item: s })),
    ...allTimetables.map((t) => ({ type: "t", item: t })),
  ];

  let visibleScheduleCount = 0;
  let visibleTimetableCount = 0;

  if (availableHeight !== null) {
    const totalH = allItems.reduce(
      (sum, i) => sum + (i.type === "s" ? SCHEDULE_H : BLOCK_H),
      0
    );

    if (totalH <= availableHeight) {
      // 모든 항목이 들어감
      visibleScheduleCount = allSchedules.length;
      visibleTimetableCount = allTimetables.length;
    } else {
      // 들어갈 수 있는 만큼만 표시, 나머지는 더보기로
      let used = 0;
      let count = 0;
      for (let i = 0; i < allItems.length; i++) {
        const itemH = allItems[i].type === "s" ? SCHEDULE_H : BLOCK_H;
        const remaining = allItems.length - i - 1;
        // 이 항목 이후에도 항목이 있으면 더보기 블록 공간 확보
        const overflowReserve = remaining > 0 ? OVERFLOW_H : 0;
        if (used + itemH + overflowReserve <= availableHeight) {
          used += itemH;
          count = i + 1;
        } else {
          break;
        }
      }
      visibleScheduleCount = Math.min(count, allSchedules.length);
      visibleTimetableCount = Math.max(0, count - allSchedules.length);
    }
  } else {
    // 측정 전 보수적 기본값
    visibleScheduleCount = Math.min(allSchedules.length, 2);
    visibleTimetableCount = Math.min(
      allTimetables.length,
      Math.max(0, 2 - visibleScheduleCount)
    );
  }

  const visibleSchedules = allSchedules.slice(0, visibleScheduleCount);
  const visibleTimetables = allTimetables.slice(0, visibleTimetableCount);
  const overflowCount =
    allSchedules.length -
    visibleScheduleCount +
    allTimetables.length -
    visibleTimetableCount;

  return (
    <DateCellContainer
      ref={containerRef}
      onClick={openDetailedDate}
      $isSameMonth={isSameMonth}
    >
      <p ref={dateLabelRef}>
        {isToday ? (
          <TodayBadge>{date.getDate()}</TodayBadge>
        ) : (
          date.getDate()
        )}
      </p>

      {/* 스케줄 (일정) 표시 */}
      {visibleSchedules.map((schedule) => (
        <ScheduleItem key={`s-${schedule.id}`}>
          {schedule.title}
        </ScheduleItem>
      ))}

      {/* schedule과 timetable 사이 spacer - timetable을 아래로 밀기 */}
      {visibleSchedules.length > 0 && visibleTimetables.length > 0 && (
        <div style={{ flex: 1 }} />
      )}

      {/* 타임테이블 (합주) 표시 - 칸 형식 태그 */}
      {visibleTimetables.map((timetable) => {
        const color = timetable.color ? `#${timetable.color}` : "#486284";
        const startHour = timetable.start?.split("T")[1]?.split(":")[0];
        const endHour = timetable.end?.split("T")[1]?.split(":")[0];
        const fmt = (h) => String(parseInt(h)).padStart(2, "0");
        const timeLabel =
          startHour && endHour
            ? `${fmt(startHour)}-${fmt(endHour)}`
            : startHour
            ? `${fmt(startHour)}`
            : null;
        return (
          <TimeTableTag key={`t-${timetable.id}`} $color={color}>
            {timeLabel && <div className="time">{timeLabel}</div>}
            <div className="title">{timetable.title}</div>
          </TimeTableTag>
        );
      })}

      {overflowCount > 0 && availableHeight !== null && availableHeight >= OVERFLOW_H && (
        <TimeTableTag $color="transparent" $overflow>
          <TimeSpacer>00-00</TimeSpacer>
          <OverflowText>더보기 +{overflowCount}</OverflowText>
        </TimeTableTag>
      )}
    </DateCellContainer>
  );
};

export default DateCell;
