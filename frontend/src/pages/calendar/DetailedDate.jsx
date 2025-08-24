import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";

import DraggableTable from "./DraggableTable";
import { TimeTableAPI } from "../../apis/common";
import TTDataDisplay from "./TTDataDisplay";

const DetailedDateContainer = styled.div`
  background-color: orange;
  padding: 20px;
  height: calc(100% - 40px);
`;

const DetailedDate = ({ dateObj }) => {
  const times = [];
  const tempDate = new Date(2004, 5, 11, 9, 0, 0);
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
      // 한달간 기간 설정
      const result = await TimeTableAPI.getTimeTable();
      const resultdata = result.data;

      setTimeTables(resultdata);
    } catch (error) {
      console.log("getTimeTable error ", error);
    }
  };

  // 드래그테이블의 상태
  const [cells, setCells] = useState(
    Array.from({ length: times.length }, () => null)
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
      <h1>
        {dateObj.getMonth()} {dateObj.getDate()}
      </h1>
      <DraggableTable
        times={times}
        timeTables={timeTables}
        enableChange={dataMode !== READ}
        setSelectedTT={setSelectedTT}
        cells={cells}
        setCells={setCells}
      />

      <TTDataDisplay
        selectedTT={selectedTT}
        dataMode={dataMode}
        setDataMode={setDataMode}
        cells={cells}
        times={times}
      />
    </DetailedDateContainer>
  );
};

export default DetailedDate;

export const CREATE = 0;
export const READ = 1;
export const UPDATE = 2;
