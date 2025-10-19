import { React, useState, useRef } from "react";
import styled from "styled-components";

const TimeLineContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: 12.2rem;
  /* border: red solid 2px; */
  padding-left: 6.5rem;
  padding-bottom: 1.1rem;
`;
const TimeLineWrapper = styled.div`
  height: 51rem;
  width: 11.9rem;
  /* border: black solid 2px; */

  /* padding-top: 2.31rem; */
  overflow-y: scroll;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #bdbcbc #f0f0f0;
`;

const Line = styled.div`
  position: relative;
  top: 2.31rem;
  min-height: 48.68rem;
  height: ${(props) => props.$height}rem;
  border-right: 0.25rem solid #486284;
  width: 9.21rem;

  display: flex;
  flex-direction: column;
  gap: 4.56rem;
`;

const ClubEventContainer = styled.div`
  /* border: green solid 2px; */
  margin-right: 3rem;
  /* align-self: end; */
  place-items: end;
  position: relative;
  bottom: 2rem;

  h2 {
    color: #486284;
  }
`;
const Circle = styled.div`
  width: 0.93rem;
  height: 0.93rem;
  border-radius: 1rem;
  background-color: #486284;

  position: relative;
  left: 3.6rem;
  bottom: 2.5rem;
`;
const TimeLine = () => {
  const n = 7;
  const height = 9.56 * n;
  const clubEvents = Array.from({ length: n }, () => ({
    id: 0,
    title: "개강일",
    description: "설명",
    color: "string",
    start: "2025-10-19T17:37:01.057Z",
    end: "2025-10-19T17:37:01.057Z",
  }));
  return (
    <TimeLineContainer>
      <TimeLineWrapper>
        <Line $height={height}>
          {clubEvents.map((clubEvent) => (
            <ClubEventContainer>
              <h2>08.02</h2>
              <h4>개강일</h4>
              <Circle></Circle>
            </ClubEventContainer>
          ))}
        </Line>
      </TimeLineWrapper>
    </TimeLineContainer>
  );
};

export default TimeLine;
