import React from "react";
import Notice from "./Notice";
import Archive from "./Archive";
import Calendar from "./Calendar";
import styled from "styled-components";

const MainContainer = styled.div``;

const OverlayText = styled.div`
  position: absolute;
  bottom: 100px;
  /* width: 100%; */
  color: #fefaef;
  z-index: 2;
  margin-left: 73px;
  line-height: 0%;

  h1 {
    font-family: Plus Jakarta Sans;
    font-weight: 800;
    font-size: 200px;
    letter-spacing: -15px;
    vertical-align: middle;
    text-transform: uppercase;
  }

  p {
    font-family: Plus Jakarta Sans;
    font-weight: 500;
    font-size: 30px;
    letter-spacing: 69.5px;
    text-transform: uppercase;
    margin-left: 12px;
  }
`;

const ImgBackground = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 0;
`;

const ImgContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 90vh;
`;

const Main = () => {
  return (
    <MainContainer>
      <ImgContainer>
        <OverlayText>
          <h1>NURIWOOLIM</h1>
          <p>중앙대학교 민중가요 동아리</p>
        </OverlayText>
        <ImgBackground src="/assets/backgroundimage.png" alt="누리울림 로고" />
      </ImgContainer>

      <Notice />
      <Archive />
      <Calendar />
    </MainContainer>
  );
};

export default Main;
