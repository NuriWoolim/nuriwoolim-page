import { useRef, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { getColorPair } from "../../data/CalendarData";

const DateCellContainer = styled.div`
  padding: 0.4rem;
  border-right: 1px solid #033148;
  border-bottom: 1px solid #033148;
  background-color: ${({ $isSelected, $isSameMonth }) =>
    $isSelected ? "rgba(255, 208, 78, 0.08)" : $isSameMonth ? "#fff" : "#EFE7D1"};
  outline: ${({ $isSelected }) => $isSelected ? "2px solid #FFD04E" : "none"};
  outline-offset: -2px;
  color: rgba(0, 0, 0, ${({ $isSameMonth }) => ($isSameMonth ? "1" : "0.4")});
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  p {
    margin-bottom: 0.2rem;
  }

  @media (max-width: 768px) {
    padding: 0.15rem;

    p {
      font-size: 0.7rem;
      margin-bottom: 0;
    }
  }
`;

/* 스케줄 아이템 (일정 텍스트) */
const ScheduleItem = styled.div`
  height: 1rem;
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 0.3rem;
  margin-top: 0;
  font-family: "Pretendard";
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.06em;
  text-align: left;
  color: #FF8585;
  border-radius: 2px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* 타임테이블 태그 (칸 형식) */
const TimeTableTag = styled.div`
  width: 100%;
  height: 24px;
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
    width: 44px;
    min-width: 44px;
    box-sizing: border-box;
    padding: 3px 4px;
    font-family: "Pretendard";
    font-size: 14px;
    font-weight: 600;
    line-height: 100%;
    letter-spacing: -0.06em;
    text-align: center;
    border-radius: 6px;
    background-color: ${(props) => props.$bgColor || "#E8EEF1"};
    color: ${(props) => props.$color || "#3D5286"};
    white-space: nowrap;
    flex-shrink: 0;
  }

  .title {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    padding: 3px 4px;
    font-family: "Pretendard";
    font-size: 14px;
    font-weight: 600;
    line-height: 100%;
    letter-spacing: -0.06em;
    border-radius: 6px;
    background-color: ${(props) => props.$bgColor || "#E8EEF1"};
    color: ${(props) => props.$color || "#3D5286"};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 768px) {
    display: none;
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

  @media (max-width: 768px) {
    width: 1.1rem;
    height: 1.1rem;
    font-size: 0.65rem;
  }
`;

const OverflowText = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  height: 24px;
  box-sizing: border-box;
  padding: 3px 4px;
  border-radius: 6px;
  background-color: #EEEEEE;
  font-family: "Pretendard";
  font-size: 14px;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: -0.06em;
  color: #424242;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
/* 더보기를 title 영역에만 맞추기 위한 투명 spacer */
const TimeSpacer = styled.div`
  width: 44px;
  min-width: 44px;
  box-sizing: border-box;
  padding: 3px 4px;
  font-family: "Pretendard";
  font-size: 14px;
  font-weight: 600;
  visibility: hidden;
  flex-shrink: 0;
  white-space: nowrap;
`;
const ScheduleMoreText = styled.div`
  font-family: "Pretendard";
  font-size: 11px;
  font-weight: 700;
  color: #222;
  letter-spacing: -0.05em;
  padding: 0 0.3rem;
  line-height: 1.4;

  @media (max-width: 768px) {
    display: none;
  }
`;

// 각 항목의 실제 픽셀 높이 (CSS 고정값 기준)
const SCHEDULE_H = 16;      // 1rem ≈ 16px
const SCHEDULE_MORE_H = 16; // ScheduleMoreText 높이
const BLOCK_H = 26;         // TimeTableTag height:24px + margin-top:2px
const OVERFLOW_H = 26;      // 동일 (TimeTableTag 안에 렌더)
const MAX_SCHEDULES = 2;

const DateCell = ({
  dateObj,
  timetables,
  schedules,
  isSameMonth,
  isSelected,
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

  // 일정(schedule): 최대 2개 고정
  const visibleSchedules = allSchedules.slice(0, MAX_SCHEDULES);
  const scheduleOverflow = allSchedules.length - visibleSchedules.length;

  // 일정이 차지하는 높이
  const scheduleUsedH =
    visibleSchedules.length * SCHEDULE_H +
    (scheduleOverflow > 0 ? SCHEDULE_MORE_H : 0);

  // 합주(timetable): 남은 높이 기반으로 계산
  const remainingForTT =
    availableHeight !== null ? availableHeight - scheduleUsedH : null;

  let visibleTimetableCount = 0;
  if (remainingForTT !== null) {
    let used = 0;
    for (let i = 0; i < allTimetables.length; i++) {
      const remaining = allTimetables.length - i - 1;
      const overflowReserve = remaining > 0 ? OVERFLOW_H : 0;
      if (used + BLOCK_H + overflowReserve <= remainingForTT) {
        used += BLOCK_H;
        visibleTimetableCount = i + 1;
      } else {
        break;
      }
    }
  } else {
    visibleTimetableCount = Math.min(allTimetables.length, 1);
  }

  const visibleTimetables = allTimetables.slice(0, visibleTimetableCount);
  const ttOverflowCount = allTimetables.length - visibleTimetableCount;

  return (
    <DateCellContainer
      ref={containerRef}
      onClick={openDetailedDate}
      $isSameMonth={isSameMonth}
      $isSelected={isSelected}
    >
      <p ref={dateLabelRef}>
        {isToday ? (
          <TodayBadge>{date.getDate()}</TodayBadge>
        ) : (
          date.getDate()
        )}
      </p>

      {/* 스케줄 (일정) 표시 — 최대 2개 */}
      {visibleSchedules.map((schedule) => (
        <ScheduleItem key={`s-${schedule.id}`}>
          {schedule.title}
        </ScheduleItem>
      ))}
      {scheduleOverflow > 0 && (
        <ScheduleMoreText>더보기 +{scheduleOverflow}</ScheduleMoreText>
      )}

      {/* schedule과 timetable 사이 spacer */}
      {visibleTimetables.length > 0 && (
        <div style={{ flex: 1 }} />
      )}

      {/* 타임테이블 (합주) 표시 - 칸 형식 태그 */}
      {visibleTimetables.map((timetable) => {
        const [color, bgColor] = getColorPair(timetable.color);
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
          <TimeTableTag key={`t-${timetable.id}`} $color={color} $bgColor={bgColor}>
            {timeLabel && <div className="time">{timeLabel}</div>}
            <div className="title">{timetable.title}</div>
          </TimeTableTag>
        );
      })}

      {/* 합주 더보기 — 기존 다크박스 스타일 유지 */}
      {ttOverflowCount > 0 && availableHeight !== null && remainingForTT >= OVERFLOW_H && (
        <TimeTableTag $color="transparent" $overflow>
          <TimeSpacer>00-00</TimeSpacer>
          <OverflowText>더보기 +{ttOverflowCount}</OverflowText>
        </TimeTableTag>
      )}
    </DateCellContainer>
  );
};

export default DateCell;
