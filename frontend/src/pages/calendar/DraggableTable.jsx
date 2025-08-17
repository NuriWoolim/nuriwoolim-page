import { React, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$length}, 1fr);
  grid-template-rows: 100px;
  border: solid 1px black;
  /* overflow: hidden; */
`;

const TableCell = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #ccc;
  cursor: pointer;
  user-select: none;

  font-size: 0.8rem;

  background-color: ${(props) => props.$color};
`;

const DraggableTable = ({ times, timeTables, enableChange = false }) => {
  const [isTouched, setIsTouched] = useState(-1);
  const [cellDataArr, setcellDataArr] = useState(
    Array.from({ length: times.length }, () => null)
  );

  const initTable = useEffect(() => {
    for (let i = 0; i < timeTables.timetables.length; i++) {
      const parseTime = (str) => {
        const [datePart, timePart] = str.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);
        return (hour * 60 + minute - 9 * 60) / 30;
      };

      const startidx = parseTime(timeTables.timetables[i].start);
      const endidx = parseTime(timeTables.timetables[i].end);

      setcellDataArr((prevSelected) => {
        const newSelected = [...prevSelected];

        for (let j = startidx; j < endidx; j++) {
          newSelected[j] = timeTables.timetables[i];
        }
        return newSelected;
      });
    }
  }, []);

  // 이벤트 핸들러 함수들을 useCallback으로 메모이제이션
  const handleTouchStart = useCallback((e) => {
    // if (isTouched != -1) return;
    const target = e.target.closest("div[data-key]");
    if (!target) return;

    const col = parseInt(target.dataset.key, 10);

    setcellDataArr((prevSelected) => {
      const newSelected = [...prevSelected];

      if (newSelected[col] === 1 || newSelected[col] === null) {
        if (newSelected[col] === null) newSelected[col] = 1;
        else newSelected[col] = null;
      }
      return newSelected;
    });

    setIsTouched(col);
  }, []);

  const handleTouchEnd = useCallback(() => {
    // console.log("start");

    setIsTouched(-1);
  }, []);

  const handleTouchMove = useCallback(
    _.throttle((e) => {
      if (isTouched === -1) return;

      const clientX = e.type.startsWith("touch")
        ? e.touches[0].clientX
        : e.clientX;
      const clientY = e.type.startsWith("touch")
        ? e.touches[0].clientY
        : e.clientY;
      const target = document.elementFromPoint(clientX, clientY);

      const st_col = isTouched;

      let add_dates = true;
      if (cellDataArr[st_col] === null) add_dates = false;

      if (target.getAttribute("data-key") == null) return;
      const cur_col = +target.getAttribute("data-key");

      // console.log(cur_col, lastTouchedCol)
      //////////

      const newSelected = [...cellDataArr];

      const minCol = Math.min(st_col, cur_col);
      const maxCol = Math.max(st_col, cur_col);

      for (let c = minCol; c <= maxCol; c++) {
        if (c == st_col) continue;
        if (newSelected[c] !== 1 && newSelected[c] !== null) continue;
        if (add_dates) newSelected[c] = 1;
        else newSelected[c] = null;
      }
      //   console.log(st_col, cur_col);

      setcellDataArr(newSelected);
    }, 75),
    [isTouched]
  );
  useEffect(() => {
    const preventScroll = (event) => event.preventDefault();

    if (isTouched !== -1) {
      document.addEventListener("touchmove", preventScroll, { passive: false });
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mousemove", handleTouchMove);
    } else {
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("touchmove", handleTouchMove);
      document.addEventListener("mousemove", handleTouchMove);
    }

    return () => {
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousemove", handleTouchMove);
    };
  }, [isTouched]);
  return (
    <GridContainer
      onPointerDown={enableChange ? handleTouchStart : undefined}
      onPointerUp={enableChange ? handleTouchEnd : undefined}
      $length={times.length}
    >
      {times.map((time, index) => (
        <TableCell
          key={index}
          data-key={index}
          $color={
            cellDataArr[index] === null
              ? "white"
              : cellDataArr[index] === 1
              ? "green"
              : cellDataArr[index]?.color ?? "white"
          }
        >
          {String(time.getHours()).padStart(2, "0")}:
          {String(time.getMinutes()).padStart(2, "0")}
        </TableCell>
      ))}
    </GridContainer>
  );
};
export default DraggableTable;
