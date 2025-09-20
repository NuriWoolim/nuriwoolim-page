import React from "react";
import Notice from "./Notice";
import Archive from "./Archive";
import Calendar from "./Calendar";
import styled from "styled-components";

const MainContainer = styled.div`
  h1 {
    font-weight: 800;
    color: #033148;
    font-size: 3rem;
    text-align: center;
    letter-spacing: -1.8px;
    margin: 2.1rem 0 2.1rem 0;
  }
`;
const Main = () => {
  return (
    <MainContainer>
      <Notice />
      <Archive />
      <Calendar />
    </MainContainer>
  );
};

export default Main;
