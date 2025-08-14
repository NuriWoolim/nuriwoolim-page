import { React, useState, useEffect } from "react";
import styled from "styled-components";
import { TimeTableAPI } from "../../apis/common";

const DetailedDateContainer = styled.div`
  position: absolute;
  background-color: orange;
`;

const DetailedDate = ({ timeTables }) => {
  return (
    <DetailedDateContainer>
      {timeTables.timetables.map((timetable) => (
        <>
          <div>{timetable.title}</div>
          <div>{timetable.team}</div>
          <div>{timetable.description}</div>
          <div>{timetable.start}</div>
          <div>{timetable.end}</div>
        </>
      ))}
    </DetailedDateContainer>
  );
};

export default DetailedDate;
