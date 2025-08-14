import React from "react";
import styled from "styled-components";

const DateCellContainer = styled.div`
  h2 {
    font-size: 1rem;
    margin: 0px;
    margin-bottom: 5px;
  }
  border: solid 2px red;
  padding: 5px;
  color: ${({ $color }) => $color};
`;

const Plan = styled.div`
  height: 20px;
  border: 1px orange solid;
`;

const DateCell = ({ dateObj }) => {
  const date = new Date(dateObj);
  const today = new Date();

  let color;
  if (date.getDay() === 0) {
    color = date.getMonth() === today.getMonth() ? "red" : "rgba(255,0,0,0.7)";
  } else if (date.getDay() === 6) {
    color =
      date.getMonth() === today.getMonth() ? "cyan" : "rgba(0,255,255,0.7)";
  } else {
    color = date.getMonth() === today.getMonth() ? "black" : "gray";
  }

  return (
    <DateCellContainer $color={color}>
      <h2>{date.getDate()}</h2>

      <Plan></Plan>
      <Plan></Plan>
      <Plan></Plan>
    </DateCellContainer>
  );
};

export default DateCell;
