import { React, useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import _ from "lodash";
import { TTColors } from "../../data/CalendarData";

const GridContainer = styled.div`
  display: grid;
  grid-template-rows: repeat(${(props) => props.$length}, 2rem);
  grid-template-columns: 200px;
  border: solid 1px black;
  /* overflow: hidden; */
`;

const TableCell = styled.div`
  /* box-sizing: border-box; */
  cursor: pointer;

  color: #486284;
  font-family: Pretendard;
  font-size: 0.9rem;
  font-style: normal;
  font-weight: 800;
  line-height: normal;
  letter-spacing: -1.25px;

  overflow: hidden;
  text-overflow: clip;
  border-bottom: solid 0.5px #acbeff;

  background-color: ${(props) => props.$color};

  user-select: none;
`;

const TTTitleContainer = styled.div`
  position: absolute;
  top: 0;
  display: grid;
  grid-template-columns: 200px;
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
  padding: 10px;
  margin-left: 1.5rem;
  width: 60%;
  height: 60%;

  pointer-events: ${(props) => (props.$isTouched === -1 ? "auto" : "none")};

  display: flex;
  flex-direction: column;
  justify-content: center;

  border-radius: 2px;
  background-color: ${(props) => props.$color1};
  color: ${(props) => props.$color2};
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

  const clearCells = () => {
    let newCells = [...cells];
    for (let i = 0; i < times.length; i++) {
      newCells[i] = {
        ...newCells[i],
        isSelected: false,
      };
    }
    setCells(newCells);
  };
  useEffect(clearCells, []);

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
          newSelected[j] = {
            ...newSelected[j],
            tt: timeTables.data[i],
          };
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

    // 표시하는 일정 없애버리기
    setSelectedTT(null);
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
    console.log("start");
  }, []);

  const handleTouchEnd = useCallback(() => {
    console.log("end");

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

      for (let c = minCol; c <= maxCol; c++) {
        if (c === st_col) continue;
        newSelected[c] = { ...newSelected[c], isSelected: add_dates };
      }

      setCells(newSelected);

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
            $color={
              cells[index]?.isSelected === false ? "white" : "#FFF7E2;"
              // : cells[index] === 1
              // ? "green"
              // : cells[index]?.color ?? "white"
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
          gridTemplateRows: TTTStyle,
        }}
      >
        {TTTCells.map((cell, index) => (
          <TTTCell key={index}>
            {TTTCells[index] !== null && (
              <TTTInnerBlock
                onClick={() => {
                  if (enableChange) clearCells();
                  return setSelectedTT(TTTCells[index]);
                }}
                $color1={
                  TTColors[parseInt(TTTCells[index].color)]?.[0] ??
                  TTColors[0][0]
                }
                $color2={
                  TTColors[parseInt(TTTCells[index].color)]?.[1] ??
                  TTColors[0][1]
                }
                $isTouched={isTouched}
              >
                <div>
                  {TTTCells[index] === null ? null : TTTCells[index].title}
                </div>
                <div>
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
