import React from "react";
import Notice from "./Notice";
import Archive from "./Archive";
import Calendar from "./Calendar";
import styled from "styled-components";

const MainContainer = styled.div``;
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
