import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Notices } from "../data/NoticeData";

/* Notice 섹션의 전체 배경 */
const NoticeSection = styled.section`
  background-color: #fefaef;
  padding: 45px 0;
`;

/* Notice 섹션의 컨테이너 박스 */

const NoticeWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 0px 40px 40px;
  background-color: #ffffff;
  border: 4px solid #033148;

  h2 {
    font-family: Plus Jakarta Sans;
    font-weight: 800;
    font-size: 40px;
    line-height: 127%;
    letter-spacing: -6%;
    text-transform: uppercase;
  }

  p {
    font-family: Pretendard;
    font-weight: 500;
    font-size: 30px;
    line-height: 127%;
    letter-spacing: -3%;
    text-transform: uppercase;
  }

  ul {
    list-style: none;
    padding: 0;
  }
`;

const Calendar = () => {
  return (
    <NoticeSection>
      <NoticeWrapper>
        <h2>CALENDAR</h2>
      </NoticeWrapper>
    </NoticeSection>
  );
};

export default Calendar;
