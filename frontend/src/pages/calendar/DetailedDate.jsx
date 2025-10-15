import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";

import DraggableTable from "./DraggableTable";
import { TimeTableAPI } from "../../apis/common";
import TTDataDisplay from "./TTDataDisplay";

const DetailedDateContainer = styled.div`
  display: flex;
  width: 35.3rem;
  height: 43.4rem;
  * {
    box-sizing: border-box;
  }

  /* transform: scale(1.1); */
`;

const LeftBar = styled.div`
  background-color: #486284;

  height: 3.11688rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 0.9rem;
  h2 {
    color: #fff;
  }
`;

const RightBar = styled.div`
  background-color: #486284;
  height: 3.11688rem;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: 0.9rem;
  padding-right: 0.45rem;
  h2 {
    color: #fff;
  }
`;

const LeftContainer = styled.div`
  flex: 1;
`;
const RightContainer = styled.div`
  flex: 1;
  border-left: 1px solid black;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  background: url("/assets/close_button.svg") no-repeat center;
  background-size: 1.12rem;
  box-sizing: content-box;
  width: 1.12rem;
  height: 1.12rem;
  padding: 0.45rem;

  cursor: pointer;
  border: none;
  /* border-radius: 0.75rem; */

  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.8;
  }
`;

function toLocalISOString(date, type) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 0부터 시작하니까 +1
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  if (type == 0) return `${year}-${month}-${day}T00:00`;
  else return `${year}-${month}-${day}T23:59`;
}
const DetailedDate = ({ dateObj, getMonthTimeTables, onClose }) => {
  const times = [];
  const tempDate = new Date(dateObj);
  tempDate.setHours(9);
  tempDate.setMinutes(0);
  for (let i = 0; i < 26; i++) {
    times.push(new Date(tempDate));
    tempDate.setMinutes(tempDate.getMinutes() + 30);
  }

  const [timeTables, setTimeTables] = useState({
    from: "2023-12-25T16:00",
    to: "2023-12-25T16:00",
    data: [],
  });

  const callApi = async () => {
    try {
      // 하루치
      if (dateObj) {
        const from = toLocalISOString(dateObj, 0);
        const to = toLocalISOString(dateObj, 1);
        const result = await TimeTableAPI.getTimeTable(from, to);
        const resultdata = result.data;

        setTimeTables(resultdata);
        getMonthTimeTables();
      }
    } catch (error) {
      console.log("getTimeTable error ", error);
    }
  };

  // 드래그테이블의 상태
  const [cells, setCells] = useState(
    Array.from({ length: times.length }, () => ({
      isSelected: false,
      tt: null,
    }))
  );

  // 현재 선택된 타임테이블
  const [selectedTT, setSelectedTT] = useState(null);

  // 현재 상태(읽기, 수정, 생성)
  const [dataMode, setDataMode] = useState(READ);

  useEffect(() => {
    callApi();
  }, []);

  useEffect(() => {
    if (dataMode == UPDATE) {
      setCells((cells) => {
        const newCells = [...cells];
        cells.map((cell, i) => {
          if (cell.tt?.id == selectedTT.id)
            newCells[i] = { ...newCells[i], isSelected: true };
        });
        return newCells;
      });
    }
  }, [dataMode]);
  return (
    <DetailedDateContainer data-testid="DetailedDate">
      <LeftContainer>
        <LeftBar>
          <h2>
            {dateObj.getMonth() + 1}/{dateObj.getDate()}
          </h2>
        </LeftBar>
        <DraggableTable
          times={times}
          timeTables={timeTables}
          enableChange={dataMode !== READ}
          selectedTT={selectedTT}
          setSelectedTT={setSelectedTT}
          cells={cells}
          setCells={setCells}
          dataMode={dataMode}
        />
      </LeftContainer>
      <RightContainer>
        <RightBar>
          <h2>합주 생성 및 편집</h2>
          <CloseButton onClick={onClose} />
        </RightBar>
        <TTDataDisplay
          selectedTT={selectedTT}
          setSelectedTT={setSelectedTT}
          dataMode={dataMode}
          setDataMode={setDataMode}
          cells={cells}
          callApi={callApi}
          times={times}
        />
      </RightContainer>
    </DetailedDateContainer>
  );
};

export default DetailedDate;

export const CREATE = 0;
export const READ = 1;
export const UPDATE = 2;
export const TIMELIMIT = 4;
