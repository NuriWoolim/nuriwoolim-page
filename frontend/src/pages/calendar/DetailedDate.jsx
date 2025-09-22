import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";

import DraggableTable from "./DraggableTable";
import { TimeTableAPI } from "../../apis/common";
import TTDataDisplay from "./TTDataDisplay";

const DetailedDateContainer = styled.div`
  /* display: flex; */
  height: calc(100% - 40px);
`;

const Bar = styled.div`
  background-color: #486284;
  padding: 0.6rem 0.7rem 0.6rem 0.7rem;
  && h1 {
    font-family: Pretendard;
    font-weight: 900;
    color: #fff;
    text-align: right;
    font-size: 1.8rem;
    margin-top: 0;
    margin-bottom: 0;
  }
`;

const ElementsContainer = styled.div`
  display: flex;
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
const DetailedDate = ({ dateObj, getMonthTimeTables }) => {
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
  return (
    <DetailedDateContainer>
      <Bar>
        <h1>
          {dateObj.getMonth() + 1}/{dateObj.getDate()}
        </h1>
      </Bar>
      <ElementsContainer>
        <DraggableTable
          times={times}
          timeTables={timeTables}
          enableChange={dataMode === READ}
          setSelectedTT={setSelectedTT}
          cells={cells}
          setCells={setCells}
        />

        <TTDataDisplay
          selectedTT={selectedTT}
          dataMode={dataMode}
          setDataMode={setDataMode}
          cells={cells}
          callApi={callApi}
          times={times}
        />
      </ElementsContainer>
    </DetailedDateContainer>
  );
};

export default DetailedDate;

export const CREATE = 0;
export const READ = 1;
export const UPDATE = 2;
export const TIMELIMIT = 4;
