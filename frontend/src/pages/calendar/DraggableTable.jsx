import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";
import { lighten } from "polished";

const SLOT_COUNT = 13; // 9..21 = 13 hourly rows
const HOUR_START = 9;

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(${SLOT_COUNT}, 1fr);
  flex: 1;
  user-select: none;
  -webkit-user-select: none;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 0.6px solid #d4d8e0;
  padding: 0 0.55rem;
  min-height: 2.5rem;
  position: relative;

  background-color: ${(p) => (p.$selected ? "#FFF7E2" : "#fff")};
`;

const HourLabel = styled.span`
  color: #486284;
  font-size: 0.82rem;
  font-weight: 700;
  width: 2.2rem;
  flex-shrink: 0;
`;

/* Timetable block overlay */
const TTBlock = styled.div`
  position: absolute;
  left: 2.8rem;
  right: 0.4rem;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(p) => p.$color};
  border-radius: 3px;
  pointer-events: none;
  z-index: 1;

  span {
    color: ${(p) => {
      try {
        return lighten(0.45, p.$color);
      } catch {
        return "#fff";
      }
    }};
    font-size: 0.78rem;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
  }
`;

/* Resize handle */
const ResizeHandle = styled.div`
  position: absolute;
  bottom: -4px;
  right: 50%;
  transform: translateX(50%);
  width: 10px;
  height: 10px;
  background: #888;
  border-radius: 50%;
  cursor: ns-resize;
  z-index: 2;
`;

const DraggableTable = ({ cells, setCells, timetableData }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(-1);
  const [dragEnd, setDragEnd] = useState(-1);

  /* ── Compute occupied slots from existing timetables ── */
  const occupied = new Set();
  const ttBlockMap = {}; // startIndex -> tt data
  if (Array.isArray(timetableData)) {
    timetableData.forEach((tt) => {
      const sHour = parseInt(tt.start.split("T")[1].split(":")[0]);
      const eHour = parseInt(tt.end.split("T")[1].split(":")[0]);
      for (let h = sHour; h < eHour; h++) {
        const idx = h - HOUR_START;
        if (idx >= 0 && idx < SLOT_COUNT) occupied.add(idx);
      }
      const startIdx = sHour - HOUR_START;
      if (startIdx >= 0 && startIdx < SLOT_COUNT) {
        ttBlockMap[startIdx] = {
          ...tt,
          span: eHour - sHour,
        };
      }
    });
  }

  /* ── Pointer events for drag select ── */
  const getSlotFromEvent = (e) => {
    const { clientX, clientY } = e;
    const els = document.elementsFromPoint(clientX, clientY);
    const slot = els.find((el) => el.dataset.slot != null);
    return slot ? parseInt(slot.dataset.slot) : -1;
  };

  const handlePointerDown = useCallback(
    (e) => {
      const slotIdx = parseInt(e.currentTarget.dataset.slot);
      if (occupied.has(slotIdx)) return;
      setIsDragging(true);
      setDragStart(slotIdx);
      setDragEnd(slotIdx);

      // clear previous and select this one
      setCells((prev) =>
        prev.map((c, i) => ({
          ...c,
          isSelected: i === slotIdx,
        }))
      );
    },
    [occupied]
  );

  const handlePointerMove = useCallback(
    _.throttle((e) => {
      if (!isDragging) return;
      const slotIdx = getSlotFromEvent(e);
      if (slotIdx === -1) return;
      setDragEnd(slotIdx);

      const minI = Math.min(dragStart, slotIdx);
      const maxI = Math.max(dragStart, slotIdx);

      setCells((prev) =>
        prev.map((c, i) => ({
          ...c,
          isSelected: i >= minI && i <= maxI && !occupied.has(i),
        }))
      );
    }, 50),
    [isDragging, dragStart, occupied]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      const moveFn = (e) => handlePointerMove(e);
      const upFn = () => handlePointerUp();
      document.addEventListener("pointermove", moveFn);
      document.addEventListener("pointerup", upFn);
      return () => {
        document.removeEventListener("pointermove", moveFn);
        document.removeEventListener("pointerup", upFn);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  /* ── Build TT block rendering info ── */
  // Instead of absolute positioned multi-row, render per-row
  const getTTForSlot = (idx) => {
    // Find any timetable that covers this slot
    if (!Array.isArray(timetableData)) return null;
    for (const tt of timetableData) {
      const sHour = parseInt(tt.start.split("T")[1].split(":")[0]);
      const eHour = parseInt(tt.end.split("T")[1].split(":")[0]);
      const startIdx = sHour - HOUR_START;
      const endIdx = eHour - HOUR_START;
      if (idx >= startIdx && idx < endIdx) {
        return { tt, isFirst: idx === startIdx, isLast: idx === endIdx - 1 };
      }
    }
    return null;
  };

  return (
    <Grid>
      {Array.from({ length: SLOT_COUNT }, (_, i) => {
        const hour = HOUR_START + i;
        const ttInfo = getTTForSlot(i);

        return (
          <Row
            key={i}
            data-slot={i}
            $selected={cells[i]?.isSelected}
            onPointerDown={handlePointerDown}
          >
            <HourLabel>{hour}</HourLabel>
            {ttInfo && (
              <TTBlock $color={`#${ttInfo.tt.color || "486284"}`}>
                {ttInfo.isFirst && (
                  <span>
                    {ttInfo.tt.team} {ttInfo.tt.title}
                  </span>
                )}
              </TTBlock>
            )}
            {ttInfo?.isLast && (
              <ResizeHandle style={{ pointerEvents: "none" }} />
            )}
          </Row>
        );
      })}
    </Grid>
  );
};

export default DraggableTable;
