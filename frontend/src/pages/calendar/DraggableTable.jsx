import { React, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import { TTColors } from "../../data/CalendarData";
import { lighten } from "polished";
import { CREATE, UPDATE } from "./DetailedDate";

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(${(props) => props.$length}, 1.55rem);
  /* grid-template-columns: 20rem; */
  /* border: solid 1px black; */
  /* overflow: hidden; */
`;

const TableCell = styled.div`
  /* box-sizing: border-box; */
  cursor: pointer;

  overflow: hidden;
  text-overflow: clip;
  border-bottom: ${(props) => props.$border};
  padding: 0.2rem 0.4rem;

  background-color: ${(props) => props.$color};

  user-select: none;

  h3 {
    color: #486284;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const TTTitleContainer = styled.div`
  position: absolute;
  top: 0;
  display: grid;
  width: 100%;
  height: 100%;
  /* grid-template-columns: 100%; */
  /* border: solid 1px black; */

  background: transparent;
  pointer-events: none;
`;

const TTTCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

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
  margin-left: 2.5rem;
  width: 75%;
  height: 80%;
  /* height: 100%; */
  /* box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.4); */

  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  border-radius: 2px;
  background-color: ${(props) => props.$color};

  border: ${(props) => (props.$hasBorder ? `3px solid #FFF7E2` : "none")};
  box-shadow: ${(props) =>
    props.$hasBorder ? `2px 2px 7.781px 1.5px rgba(0, 0, 0, 0.25);` : "none"};
  opacity: ${(props) =>
    props.$isTransperent && props.$hasBorder ? "0.5" : "none"};
  pointer-events: ${(props) =>
    (props.$isTransperent && props.$hasBorder) || props.$isTouched !== -1
      ? "none"
      : "auto"};

  h3 {
    color: ${(props) => lighten(0.5, props.$color)};
    white-space: pre;
  }

  .noselect {
    user-select: none;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+ */
  }
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
    if (isTouched !== -1) return;
    let prev = null;
    let cnt = 0;
    let cssstr = "";
    let cellData = [];

    for (let i = 0; i < times.length; i++) {
      if (i === 0 || cells[i].tt === prev) cnt++;
      else {
        cssstr += String(cnt * 1.55) + "rem ";

        if (prev === null) cellData.push(null);
        else cellData.push({ ...prev });
        cnt = 1;
      }
      prev = cells[i].tt;
    }
    if (prev === null) cellData.push(null);
    else cellData.push({ ...prev });
    cssstr += String(cnt * 1.55) + "rem ";
    setTTTStyle(cssstr);
    setTTTCells(cellData);
  }, [cells, isTouched]);

  const handleTouchStart = useCallback((e) => {
    // if (isTouched != -1) return;

    const { clientX, clientY } = e;
    const target =
      document
        .elementsFromPoint(clientX, clientY)
        .find((el) => el.matches("[datakey], [data-key]")) || null;

    if (target?.getAttribute("data-key") == null) return;
    const col = +target.getAttribute("data-key");

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

      const { clientX, clientY } = e;
      const target =
        document
          .elementsFromPoint(clientX, clientY)
          .find((el) => el.matches("[datakey], [data-key]")) || null;

      if (target.getAttribute("data-key") == null) return;
      const cur_col = +target.getAttribute("data-key");

      const st_col = isTouched;

      let add_dates = true;
      if (cells[st_col].isSelected === false) add_dates = false;

      //   console.log(st_col, cur_col);
      //////////

      const minCol = Math.min(st_col, cur_col);
      const maxCol = Math.max(st_col, cur_col);

      const newSelected = cells.map((cell, idx) => {
        const inRange = idx >= minCol && idx <= maxCol;

        if (cell.isSelected == add_dates || idx == st_col) return cell;
        if (!inRange) return cell;
        return { ...cell, isSelected: add_dates };
      });

      // console.log(cells, newSelected);
      let changed = false;
      cells.forEach((cell, idx) => {
        if (newSelected[idx].isSelected !== cell.isSelected) {
          changed = true;
          //   console.log("diff at", idx);
        }
      });
      //   if (st_col == cur_col) console.log(changed);
      if (changed || st_col == cur_col) {
        setCells(newSelected);
      }

      //   console.log(newSelected);
    }, 50),
    [isTouched]
  );
  useEffect(() => {
    const preventScroll = (event) => event.preventDefault();

    if (isTouched !== -1) {
      document.addEventListener("touchmove", preventScroll, { passive: false });
      document.addEventListener("pointermove", handleTouchMove);
      //   document.addEventListener("mousemove", handleTouchMove);
      //   document.addEventListener("pointerup", handleTouchEnd);
    } else {
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("pointermove", handleTouchMove);
      //   document.removeEventListener("mousemove", handleTouchMove);
      //   document.removeEventListener("pointerup", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("pointermove", handleTouchMove);
      //   document.removeEventListener("mousemove", handleTouchMove);
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
            $border={index % 2 === 1 ? "solid 0.6px #acbeff" : "none"}
            $color={cells[index]?.isSelected === false ? "white" : "#FFF7E2;"}
          >
            <h3>
              {index % 2 === 0 && String(time.getHours()).padStart(2, "0")}
            </h3>
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
                  dataMode != UPDATE && dataMode != CREATE
                    ? () => setSelectedTT(TTTCells[index])
                    : null
                }
                $color={"#" + TTTCells[index].color ?? "#000000"}
                $isTouched={isTouched}
                $hasBorder={selectedTT?.id == TTTCells[index]?.id}
                $isTransperent={dataMode == UPDATE}
              >
                <div>
                  <h3>
                    {TTTCells[index] === null ? null : TTTCells[index].title}
                    {"  -  "}
                    {TTTCells[index] === null ? null : TTTCells[index].team}
                  </h3>
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
