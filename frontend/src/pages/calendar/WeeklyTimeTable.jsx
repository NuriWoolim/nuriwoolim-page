import React from "react";
import styled from "styled-components";
import { getColorPair } from "../../data/CalendarData";

const SLOT_COUNT = 13;
const HOUR_START = 9;

/* ── 전체 래퍼 ── */
const Wrapper = styled.div`
  width: 105rem;
  margin-bottom: 2.3rem;
`;

const Title = styled.h2`
  font-family: Pretendard;
  color: #486284;
  font-size: 2.1rem;
  font-weight: 900;
  margin: 0 0 0.9rem 0;
`;

/* ── 테이블 컨테이너 ── */
const Table = styled.div`
  display: grid;
  grid-template-columns: 2.75rem repeat(7, 1fr);
  border: 1px solid #333;
`;

/* ── 헤더 ── */
const HeaderSpacer = styled.div`
  background: #486284;
  border-right: 0.6px solid #d4d8e0;
`;

const DayHeader = styled.button`
  background: #486284;
  border: none;
  border-right: 0.6px solid #d4d8e0;
  color: #fff7e2;
  font-family: Pretendard;
  font-size: 1.05rem;
  font-weight: 800;
  min-height: 2.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:last-child {
    border-right: none;
  }

  &:hover {
    filter: brightness(0.96);
  }
`;

/* ── 바디 ── */
const Body = styled.div`
  display: contents;
`;

const BodyRow = styled.div`
  display: contents;
`;

/* 시간 라벨 셀 — DraggableTable의 HourLabel과 동일 */
const HourCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.5rem;
  border-bottom: none;
  border-right: 0.6px solid #d4d8e0;
  background: #fff;
  color: #486284;
  font-family: Pretendard;
  font-size: 0.82rem;
  font-weight: 700;
`;

/* 요일 칸 — DraggableTable과 동일한 배경/보더 */
const DayCell = styled.button`
  position: relative;
  border: none;
  border-right: 0.6px solid #d4d8e0;
  border-bottom: ${(p) => (p.$isLast ? "none" : "0.6px solid #d4d8e0")};
  padding: 0;
  background: #fff;
  cursor: pointer;
  min-height: 2.5rem;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background: #fffdf8;
  }
`;

/* 시간표 블록 — DraggableTable의 TTBlock과 동일 */
const TTBlock = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => p.$bgColor};
  border-radius: 5px;
  overflow: hidden;
  z-index: 2;
  pointer-events: auto;
  box-sizing: border-box;

  span {
    color: ${(p) => p.$color};
    font-size: 0.78rem;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 0.3rem;
  }
`;

/* ── 유틸 ── */
function isSameDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function assignColumns(blocks) {
  const sorted = [...blocks].sort((a, b) => a.startIdx - b.startIdx);
  const result = [];

  for (const block of sorted) {
    const overlapping = result.filter(
      (b) => b.startIdx < block.endIdx && b.endIdx > block.startIdx
    );
    const usedCols = new Set(overlapping.map((b) => b.col));
    let col = 0;
    while (usedCols.has(col)) col++;
    result.push({ ...block, col });
  }

  for (const block of result) {
    const siblings = result.filter(
      (b) => b.startIdx < block.endIdx && b.endIdx > block.startIdx
    );
    block.maxCols = Math.max(...siblings.map((b) => b.col)) + 1;
  }

  return result;
}

/* ── 컴포넌트 ── */
const DAY_NAMES_KR = ["월", "화", "수", "목", "금", "토", "일"];

const WeeklyTimeTable = ({ weekDates, weekTT, onOpenDetailedDate }) => {
  const weekdayDates = weekDates;
  const weekdayTT = weekTT;

  return (
    <Wrapper>
      <Title>주간 동방 사용 일정 (09:00~22:00)</Title>

      <Table>
        {/* ── 헤더 행 ── */}
        <HeaderSpacer />
        {weekdayDates.map((dateObj, i) => (
          <DayHeader
            key={`hdr-${i}`}
            onClick={() => onOpenDetailedDate(dateObj)}
          >
            {DAY_NAMES_KR[i]}
          </DayHeader>
        ))}

        {/* ── 시간 행들 ── */}
        {Array.from({ length: SLOT_COUNT }, (_, slotIdx) => {
          const hour = HOUR_START + slotIdx;
          const isLast = slotIdx === SLOT_COUNT - 1;

          return (
            <BodyRow key={`row-${slotIdx}`}>
              <HourCell $isLast={isLast}>{hour}</HourCell>

              {weekdayDates.map((dateObj, dayIdx) => {
                // 이 행의 이 요일 칸 (블록은 첫 번째 행의 칸에만 절대위치로 렌더)
                if (slotIdx === 0) {
                  // 첫 번째 행에서만 블록 렌더링 (전체 높이를 기준으로 절대위치)
                  const timetables = Array.isArray(weekdayTT[dayIdx])
                    ? weekdayTT[dayIdx]
                    : [];
                  const rawBlocks = timetables
                    .map((tt) => {
                      const sHour = parseInt(
                        tt.start.split("T")[1].split(":")[0],
                        10
                      );
                      const eHour = parseInt(
                        tt.end.split("T")[1].split(":")[0],
                        10
                      );
                      return {
                        tt,
                        startIdx: Math.max(sHour - HOUR_START, 0),
                        endIdx: Math.min(eHour - HOUR_START, SLOT_COUNT),
                      };
                    })
                    .filter((b) => b.endIdx > b.startIdx);

                  const blocks = assignColumns(rawBlocks);

                  return (
                    <DayCell
                      key={`cell-${dayIdx}-${slotIdx}`}
                      $isLast={isLast}
                      style={{
                        gridRow: `span ${SLOT_COUNT}`,
                        minHeight: `calc(2.5rem * ${SLOT_COUNT})`,
                      }}
                      onClick={() => onOpenDetailedDate(dateObj)}
                    >
                      {/* 시간 구분 가이드라인 */}
                      {Array.from({ length: SLOT_COUNT }, (_, i) => (
                        <div
                          key={`guide-${i}`}
                          style={{
                            height: "2.5rem",
                            borderBottom:
                              i < SLOT_COUNT - 1
                                ? "0.6px solid #d4d8e0"
                                : "none",
                          }}
                        />
                      ))}

                      {/* 시간표 블록 — DraggableTable과 동일한 위치 계산 */}
                      {blocks.map(({ tt, startIdx, endIdx, col, maxCols }) => {
                        const topPct = (startIdx / SLOT_COUNT) * 100;
                        const heightPct =
                          ((endIdx - startIdx) / SLOT_COUNT) * 100;
                        const leftPct = (col / maxCols) * 100;
                        const widthPct = 100 / maxCols;
                        const [ttColor, ttBgColor] = getColorPair(tt.color);

                        return (
                          <TTBlock
                            key={tt.id}
                            $color={ttColor}
                            $bgColor={ttBgColor}
                            style={{
                              top: `calc(${topPct}% + 7px)`,
                              height: `calc(${heightPct}% - 15px)`,
                              left: `calc(${leftPct}% + 4px)`,
                              width: `calc(${widthPct}% - 8px)`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDetailedDate(dateObj);
                            }}
                          >
                            <span>
                              {tt.team} {tt.title}
                            </span>
                          </TTBlock>
                        );
                      })}
                    </DayCell>
                  );
                }

                // slotIdx > 0: 이미 span으로 처리됨 → 렌더링 안 함
                return null;
              })}
            </BodyRow>
          );
        })}
      </Table>
    </Wrapper>
  );
};

export default WeeklyTimeTable;
