import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";

import DraggableTable from "./DraggableTable";
import TTDataDisplay from "./TTDataDisplay";

const DetailedDateContainer = styled.div`
  background-color: orange;
  padding: 20px;
  height: calc(100% - 40px);
`;

const DetailedDate = ({ timeTables }) => {
  const times = [];
  const tempDate = new Date(2004, 5, 11, 9, 0, 0);

  for (let i = 0; i < 26; i++) {
    times.push(new Date(tempDate));
    tempDate.setMinutes(tempDate.getMinutes() + 30);
  }
  const [cells, setCells] = useState(
    Array.from({ length: times.length }, () => null)
  );
  const [selectedTT, setSelectedTT] = useState(null);

  const [dataMode, setDataMode] = useState(READ);
  return (
    <DetailedDateContainer>
      <h1>{timeTables.from.split("T")[0]}</h1>
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
