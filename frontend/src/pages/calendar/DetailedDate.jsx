import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";
import _ from "lodash";

const DetailedDateContainer = styled.div`
  background-color: orange;
  padding: 20px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(16, 1fr);
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

  background-color: ${(props) => (props.$selected ? "green" : "red")};
`;

const DetailedDate = ({ timeTables }) => {
  const times = [];
  const tempDate = new Date(2004, 5, 11, 9, 0, 0);

  for (let i = 0; i < 16; i++) {
    times.push(new Date(tempDate));
    tempDate.setMinutes(tempDate.getMinutes() + 30);
  }

  const [isTouched, setIsTouched] = useState(-1);
  const [selectedCells, setSelectedCells] = useState(new Set());

  // 이벤트 핸들러 함수들을 useCallback으로 메모이제이션
  const handleTouchStart = useCallback((e) => {
    // if (isTouched != -1) return;
    const target = e.target.closest("div[data-key]");
    if (!target) return;

    const col = parseInt(target.dataset.key, 10);

    setSelectedCells((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(col)) {
        newSelected.delete(col);
      } else {
        newSelected.add(col);
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
      if (!selectedCells.has(st_col)) add_dates = false;

      if (target.getAttribute("data-key") == null) return;
      const cur_col = +target.getAttribute("data-key");

      // console.log(cur_col, lastTouchedCol)
      //////////

      const newSelected = new Set(selectedCells);

      const minCol = Math.min(st_col, cur_col);
      const maxCol = Math.max(st_col, cur_col);

      for (let c = minCol; c <= maxCol; c++) {
        if (c == st_col) continue;
        if (add_dates) newSelected.add(c);
        else newSelected.delete(c);
      }
      console.log(st_col, cur_col);

      setSelectedCells(newSelected);
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
    <DetailedDateContainer>
      <h1>{timeTables.from.split("T")[0]}</h1>
      <GridContainer
        className="grid-container"
        onPointerDown={handleTouchStart}
        onPointerUp={handleTouchEnd}
      >
        {times.map((time, index) => (
          <TableCell
            key={index}
            data-key={index}
            $selected={selectedCells.has(index)}
          >
            {String(time.getHours()).padStart(2, "0")}:
            {String(time.getMinutes()).padStart(2, "0")}
          </TableCell>
        ))}
      </GridContainer>

      {timeTables.timetables.map((timetable, index) => (
        <div key={index}>
          <div>{timetable.title}</div>
          <div>{timetable.team}</div>
          <div>{timetable.description}</div>
          <div>{timetable.start}</div>
          <div>{timetable.end}</div>
        </div>
      ))}
    </DetailedDateContainer>
  );
};

export default DetailedDate;
