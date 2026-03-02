import { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import _ from "lodash";
import { getColorPair } from "../../data/CalendarData";

const SLOT_COUNT = 13; // 9..21 = 13 hourly rows
const HOUR_START = 9;
const LABEL_WIDTH = "2.75rem"; // hour label area width

const Grid = styled.div`
  display: grid;
  grid-template-rows: repeat(${SLOT_COUNT}, 1fr);
  flex: 1;
  position: relative;
  user-select: none;
  -webkit-user-select: none;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: ${(p) => p.$hideBorder ? "none" : "0.6px solid #d4d8e0"};
  padding: 0 0.55rem;
  min-height: 2.5rem;
  background-color: ${(p) => (p.$selected ? "#FFF7E2" : "#fff")};
`;

const HourLabel = styled.span`
  color: #486284;
  font-size: 0.82rem;
  font-weight: 700;
  width: 2.2rem;
  flex-shrink: 0;
`;

/* Timetable block — absolutely positioned */
const TTBlock = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  --tt-text-color: ${(p) => p.$color};
  background-color: ${(p) => p.$bgColor};
  cursor: pointer;
  pointer-events: auto;
  z-index: 1;
  overflow: visible;
  box-sizing: border-box;
  border-radius: 5px;
  border: ${(p) => (p.$isSelected ? "4px solid #FFD04E" : "none")};
  box-shadow: ${(p) =>
    p.$isSelected ? "4px 5px 8px 1px rgba(0, 0, 0, 0.3)" : "none"};

  span {
    color: var(--tt-text-color);
    font-size: 0.78rem;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 0.3rem;
  }
`;

const SelectionDot = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: #FFD04E;
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
`;

/* ── Assign columns so overlapping blocks render side-by-side ── */
function assignColumns(blocks) {
  // Sort by start time
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

  // Determine the number of columns needed at each block's time range
  for (const block of result) {
    const siblings = result.filter(
      (b) => b.startIdx < block.endIdx && b.endIdx > block.startIdx
    );
    block.maxCols = Math.max(...siblings.map((b) => b.col)) + 1;
  }

  return result;
}

const DraggableTable = ({ cells, setCells, timetableData, onSelectTT, selectedTTId }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(-1);

  /* ── Compute occupied slots ── */
  const occupied = new Set();
  if (Array.isArray(timetableData)) {
    timetableData.forEach((tt) => {
      const sHour = parseInt(tt.start.split("T")[1].split(":")[0]);
      const eHour = parseInt(tt.end.split("T")[1].split(":")[0]);
      for (let h = sHour; h < eHour; h++) {
        const idx = h - HOUR_START;
        if (idx >= 0 && idx < SLOT_COUNT) occupied.add(idx);
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
      setCells((prev) =>
        prev.map((c, i) => ({ ...c, isSelected: i === slotIdx }))
      );
    },
    [occupied]
  );

  const handlePointerMove = useCallback(
    _.throttle((e) => {
      if (!isDragging) return;
      const slotIdx = getSlotFromEvent(e);
      if (slotIdx === -1) return;

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

  /* ── Build timetable block layout ── */
  const rawBlocks = Array.isArray(timetableData)
    ? timetableData.map((tt) => {
        const sHour = parseInt(tt.start.split("T")[1].split(":")[0]);
        const eHour = parseInt(tt.end.split("T")[1].split(":")[0]);
        return {
          tt,
          startIdx: Math.max(sHour - HOUR_START, 0),
          endIdx: Math.min(eHour - HOUR_START, SLOT_COUNT),
        };
      })
    : [];

  const ttBlocks = assignColumns(rawBlocks);

  return (
    <Grid>
      {/* Time slot rows */}
      {Array.from({ length: SLOT_COUNT }, (_, i) => {
        const hour = HOUR_START + i;
        const isSelected = cells[i]?.isSelected;
        return (
          <Row
            key={i}
            data-slot={i}
            $selected={isSelected}
            onPointerDown={handlePointerDown}
          >
            <HourLabel>{hour}</HourLabel>
          </Row>
        );
      })}

      {/* Timetable blocks — side-by-side when overlapping, full-width when alone */}
      {ttBlocks.map(({ tt, startIdx, endIdx, col, maxCols }) => {
        const topPct = (startIdx / SLOT_COUNT) * 100;
        const heightPct = ((endIdx - startIdx) / SLOT_COUNT) * 100;

        // Available width = 100% - label area
        // Divide by maxCols, offset by col
        const left = `calc(${LABEL_WIDTH} + ${col / maxCols} * (100% - ${LABEL_WIDTH}))`;
        const width = `calc((100% - ${LABEL_WIDTH}) / ${maxCols})`;

        const isSelected = tt.id === selectedTTId;
        const [ttColor, ttBgColor] = getColorPair(tt.color);

        return (
          <TTBlock
            key={tt.id}
            $color={ttColor}
            $bgColor={ttBgColor}
            $isSelected={isSelected}
            style={{ top: `calc(${topPct}% + 7px)`, height: `calc(${heightPct}% - 15px)`, left, width: `calc(${width} - 8px)` }}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (onSelectTT) onSelectTT(tt);
            }}
          >
            <span>
              {tt.team} {tt.title}
            </span>
            {isSelected && (
              <>
                {/* top dot — left side, slightly inward */}
                <SelectionDot style={{ top: -9, left: 8 }} />
                {/* bottom dot — right side, slightly inward */}
                <SelectionDot style={{ bottom: -9, right: 8 }} />
              </>
            )}
          </TTBlock>
        );
      })}
    </Grid>
  );
};

export default DraggableTable;
