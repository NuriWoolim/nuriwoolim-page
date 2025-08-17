import React, { useState, useEffect, useCallback } from "react";
import styled, { css } from "styled-components";

import DraggableTable from "./DraggableTable";

const DetailedDateContainer = styled.div`
  background-color: orange;
  padding: 20px;
`;

const DetailedDate = ({ timeTables }) => {
  const times = [];
  const tempDate = new Date(2004, 5, 11, 9, 0, 0);

  for (let i = 0; i < 27; i++) {
    times.push(new Date(tempDate));
    tempDate.setMinutes(tempDate.getMinutes() + 30);
  }

  //   const [selectedTimeTable, setselectedTimeTable] = useState();
  return (
    <DetailedDateContainer>
      <h1>{timeTables.from.split("T")[0]}</h1>

      <DraggableTable
        times={times}
        timeTables={timeTables}
        enableChange={true}
      />
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
