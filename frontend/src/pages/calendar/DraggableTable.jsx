import { React, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import { TTColors } from "../../data/CalendarData";
import { lighten } from "polished";
import { UPDATE } from "./DetailedDate";

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(${(props) => props.$length}, 2rem);
  grid-template-columns: 20rem;
  border: solid 1px black;
  /* overflow: hidden; */
`;

const TableCell = styled.div`
  /* box-sizing: border-box; */
  cursor: pointer;

  color: #486284;
  font-family: Pretendard;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  letter-spacing: -1.25px;

  overflow: hidden;
  text-overflow: clip;
  border-bottom: ${(props) => props.$border};
  padding: 0.32rem;

  background-color: ${(props) => props.$color};

  user-select: none;
`;

const TTTitleContainer = styled.div`
  position: absolute;
  top: 0;
  display: grid;
  grid-template-columns: 20rem;
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

const TTTInnerBlock = styled.div`
  /* padding: 10px; */
  margin-left: 1.5rem;
  width: 70%;
  height: 80%;
  /* height: 100%; */
  /* box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4); */

  pointer-events: ${(props) => (props.$isTouched === -1 ? "auto" : "none")};

  display: flex;
  flex-direction: column;
  justify-content: center;

  border-radius: 2px;
  background-color: ${(props) => props.$color};
  color: ${(props) => lighten(0.5, props.$color)};
  border: ${(props) => (props.$hasBorder ? `0.25rem solid #FFF7E2` : "none")};
  box-shadow: ${(props) =>
    props.$hasBorder ? `0.2rem 0.3rem 0.8rem 0 rgba(0, 0, 0, 0.25)` : "none"};
  opacity: ${(props) =>
    props.$isTransperent && props.$hasBorder ? "0.5" : "none"};

  font-family: Pretendard;
  font-size: 1rem;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  letter-spacing: -0.9px;
`;
const Wrapper = styled.div`
  position: relative;
`;

const Blocker = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;
const DraggableTable = ({
  times, // 시간들
  cells,
  setCells,
  timeTables, // 해당 일(날짜)의 타임테이블 데이터들
  selectedTT,
  setSelectedTT, // 현재 선택된 타임테이블
  enableChange = false, // 변경 가능 여부
  dataMode,
}) => {
  const [isTouched, setIsTouched] = useState(-1);

  const [TTTCells, setTTTCells] = useState([]);
  const [TTTStyle, setTTTStyle] = useState("");

  const clearCells = () => {
    const newCells = [...cells];
    for (let i = 0; i < times.length; i++) {
      newCells[i] = {
        ...newCells[i],
        isSelected: false,
      };
    }
    setCells(newCells);
  };
  useEffect(clearCells, [enableChange]);

  // cells를 채워주는 useEffect
  const initTable = useEffect(() => {
    const newSelected = [...cells].map((cell) => ({
      ...cell,
      tt: null,
    }));

    for (let i = 0; i < timeTables.data.length; i++) {
      const parseTime = (str) => {
        const [datePart, timePart] = str.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);
        return (hour * 60 + minute - 9 * 60) / 30;
      };

      const startidx = parseTime(timeTables.data[i].start);
      const endidx = parseTime(timeTables.data[i].end);

      for (let j = startidx; j < endidx; j++) {
        newSelected[j] = {
          ...newSelected[j],
          tt: timeTables.data[i],
        };
      }
    }
    setCells(newSelected);
  }, [timeTables]);

  // 테이블 위에 표시되는 팀 이름을 표시해주는 useEffect
  useEffect(() => {
    let prev = null;
    let cnt = 0;
    let cssstr = "";
    let cellData = [];

    for (let i = 0; i < times.length; i++) {
      if (i === 0 || cells[i].tt === prev) cnt++;
      else {
        cssstr += String(cnt * 2) + "rem ";

        if (prev === null) cellData.push(null);
        else cellData.push({ ...prev });
        cnt = 1;
      }
      prev = cells[i].tt;
    }
    if (prev === null) cellData.push(null);
    else cellData.push({ ...prev });
    cssstr += String(cnt * 2) + "rem ";
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

      // 처음 눌렀을 때 초기화 하는 동작을 없애려면 아래 블록 주석처리.
      for (let i = 0; i < times.length; i++) {
        newSelected[i] = {
          ...newSelected[i],
          isSelected: false,
        };
      }
      //
      newSelected[col] = {
        ...newSelected[col],
        isSelected: !newSelected[col].isSelected,
      };
      return newSelected;
    });
    setIsTouched(col);
    // console.log("start");
  }, []);

  const handleTouchEnd = useCallback(() => {
    // console.log("end");

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
      if (cells[st_col].isSelected === false) add_dates = false;

      if (target.getAttribute("data-key") == null) return;
      const cur_col = +target.getAttribute("data-key");

      // console.log(cur_col, lastTouchedCol)
      //////////

      //   console.log(cells);
      let newSelected = [...cells];

      const minCol = Math.min(st_col, cur_col);
      const maxCol = Math.max(st_col, cur_col);

      let changed = false;

      for (let c = minCol; c <= maxCol; c++) {
        if (c === st_col) continue;

        const newValue = { ...newSelected[c], isSelected: add_dates };
        if (newSelected[c].isSelected !== newValue.isSelected) {
          newSelected[c] = newValue;
          changed = true;
        }
      }

      if (changed) {
        setCells(newSelected);
        // console.log("bb");
      }

      //   console.log(newSelected);
    }, 75),
    [isTouched]
  );
  useEffect(() => {
    const preventScroll = (event) => event.preventDefault();

    if (isTouched !== -1) {
      document.addEventListener("touchmove", preventScroll, { passive: false });
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mousemove", handleTouchMove);
      //   document.addEventListener("pointerup", handleTouchEnd);
    } else {
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousemove", handleTouchMove);
      //   document.removeEventListener("pointerup", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousemove", handleTouchMove);
      //   document.removeEventListener("pointerup", handleTouchEnd);
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
            $border={index % 2 === 1 ? "solid 0.5px #acbeff" : "none"}
            $color={cells[index]?.isSelected === false ? "white" : "#FFF7E2;"}
          >
            {index % 2 === 0 && String(time.getHours()).padStart(2, "0")}
          </TableCell>
        ))}
      </GridContainer>

      {enableChange === false && (
        <Blocker onClick={() => setSelectedTT(null)} />
      )}
      <TTTitleContainer
        id="TTTitleContainer"
        style={{
          gridTemplateRows: TTTStyle,
        }}
      >
        {TTTCells.map((cell, index) => (
          <TTTCell key={index}>
            {TTTCells[index] !== null && (
              <TTTInnerBlock
                onClick={
                  dataMode != UPDATE
                    ? () => setSelectedTT(TTTCells[index])
                    : null
                }
                $color={"#" + TTTCells[index].color ?? "#000000"}
                $isTouched={isTouched}
                $hasBorder={selectedTT?.id == TTTCells[index]?.id}
                $isTransperent={dataMode == UPDATE}
              >
                <div>
                  {TTTCells[index] === null ? null : TTTCells[index].title}{" "}
                  {TTTCells[index] === null ? null : TTTCells[index].team}
                </div>
              </TTTInnerBlock>
            )}
          </TTTCell>
        ))}
      </TTTitleContainer>
    </Wrapper>
  );
};
export default DraggableTable;
