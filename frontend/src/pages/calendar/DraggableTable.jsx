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
  /* box-sizing: border-box; */
  cursor: pointer;

  font-size: 0.8rem;
  overflow: hidden;
  text-overflow: clip;
  /* border-right: solid 1px #ccc; */

  background-color: ${(props) => props.$color};

  user-select: none;
`;

const TTTitleContainer = styled.div`
  position: absolute;
  top: 0;
  display: grid;
  grid-template-rows: 100px;
  border: solid 1px black;

  background: transparent;
  pointer-events: none;
`;

const TTTCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-overflow: clip;

  background: transparent;
  pointer-events: none;

  /* 마지막 요소는 오른쪽 보더 제거 */
  &:last-child {
    border-right: none;
  }
`;

const Wrapper = styled.div`
  position: relative;
`;
const DraggableTable = ({
  times, // 시간들
  cells,
  setCells,
  timeTables, // 해당 일(날짜)의 타임테이블 데이터들
  setSelectedTT, // 현재 선택된 타임테이블
  enableChange = false, // 변경 가능 여부
}) => {
  const [isTouched, setIsTouched] = useState(-1);

  const [TTTCells, setTTTCells] = useState([]);
  const [TTTStyle, setTTTStyle] = useState("");

  useEffect(() => {
    let newCells = [...cells];
    for (let i = 0; i < times.length; i++) {
      if (newCells[i] === 1) newCells[i] = null;
    }
    setCells(newCells);
  }, [enableChange]);

  // cells를 채워주는 useEffect
  const initTable = useEffect(() => {
    for (let i = 0; i < timeTables.data.length; i++) {
      const parseTime = (str) => {
        const [datePart, timePart] = str.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);
        return (hour * 60 + minute - 9 * 60) / 30;
      };

      const startidx = parseTime(timeTables.data[i].start);
      const endidx = parseTime(timeTables.data[i].end);

      setCells((prevSelected) => {
        const newSelected = [...prevSelected];

        for (let j = startidx; j < endidx; j++) {
          newSelected[j] = timeTables.data[i];
        }
        return newSelected;
      });
    }
  }, [timeTables]);

  // 테이블 위에 표시되는 팀 이름을 표시해주는 useEffect
  useEffect(() => {
    let prev = null;
    let cnt = 0;
    let cssstr = "";
    let cellData = [];

    for (let i = 0; i < times.length; i++) {
      if (i === 0 || cells[i] === prev) cnt++;
      else {
        cssstr += String(cnt) + "." + String(cnt) + "fr ";

        if (prev === null) cellData.push(null);
        else cellData.push({ title: prev.title, team: prev.team });
        cnt = 1;
      }
      prev = cells[i];
    }
    if (prev === null) cellData.push(null);
    else cellData.push({ title: prev.title, team: prev.team });
    cssstr += String(cnt) + "." + String(cnt) + "fr ";

    setTTTStyle(cssstr);
    setTTTCells(cellData);
  }, [cells]);

  const handleTouchStart = useCallback((e) => {
    // if (isTouched != -1) return;
    const target = e.target.closest("div[data-key]");
    if (!target) return;

    const col = parseInt(target.dataset.key, 10);

    setCells((prevSelected) => {
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
      if (cells[st_col] === null) add_dates = false;

      if (target.getAttribute("data-key") == null) return;
      const cur_col = +target.getAttribute("data-key");

      // console.log(cur_col, lastTouchedCol)
      //////////

      const newSelected = [...cells];

      const minCol = Math.min(st_col, cur_col);
      const maxCol = Math.max(st_col, cur_col);

      for (let c = minCol; c <= maxCol; c++) {
        if (c == st_col) continue;
        if (newSelected[c] !== 1 && newSelected[c] !== null) continue;
        if (add_dates) newSelected[c] = 1;
        else newSelected[c] = null;
      }
      //   console.log(st_col, cur_col);

      setCells(newSelected);
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
    <Wrapper>
      <GridContainer
        onPointerDown={enableChange ? handleTouchStart : undefined}
        onPointerUp={enableChange ? handleTouchEnd : undefined}
        $length={times.length}
      >
        {times.map((time, index) => (
          <TableCell
            key={index}
            data-key={index}
            onClick={
              enableChange
                ? undefined
                : () => {
                    if (cells[index] !== null && cells[index] !== 1)
                      return setSelectedTT(cells[index]);
                  }
            }
            $color={
              cells[index] === null
                ? "white"
                : cells[index] === 1
                ? "green"
                : cells[index]?.color ?? "white"
            }
          >
            {String(time.getHours()).padStart(2, "0")}:
            {String(time.getMinutes()).padStart(2, "0")}
          </TableCell>
        ))}
      </GridContainer>
      <TTTitleContainer
        id="TTTitleContainer"
        style={{
          gridTemplateColumns: TTTStyle,
        }}
      >
        {TTTCells.map((cell, index) => (
          <TTTCell key={index}>
            <div>{TTTCells[index] === null ? null : TTTCells[index].title}</div>
            <div>{TTTCells[index] === null ? null : TTTCells[index].team}</div>
          </TTTCell>
        ))}
      </TTTitleContainer>
    </Wrapper>
  );
};
export default DraggableTable;
