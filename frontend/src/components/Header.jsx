import React from "react";
import styled from "styled-components";

const HeaderContainer = styled.header`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const NavBar = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 85px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 10;

  background-image: url("/assets/backgroundcolor.png");
  background-color: white;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  img {
    margin-top: 15px;
    width: 120px;
    height: 120px;
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  transform: translateX(-50px);
`;
const NavLinks = styled.div`
  display: flex;
  gap: 45px;

  a {
    text-decoration: none;
    color: #023349;
    line-height: 150%;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: -0.5px;
  }
`;

const LoginButton = styled.button`
  background-color: #023349;
  color: #fefaef;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-family: Pretendard;
  font-weight: 900;
  letter-spacing: -0.5px;
  font-size: 16px;
  text-align: center;
`;

const OverlayText = styled.div`
  position: absolute;
  bottom: 100px;
  width: 100%;
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

const Header = () => {
  return (
    <>
      <HeaderContainer>
        <NavBar>
          <Logo>
            <a href="#Home">
              <img src="/assets/mainlogo.png" alt="누리울림 로고" />
            </a>
          </Logo>

          <RightGroup>
            <NavLinks>
              <a href="#Home">Home</a>
              <a href="#Notice">Notice</a>
              <a href="#Archive">Archive</a>
              <a href="#Calendar">Calendar</a>
              <a href="#Register">Register</a>
              <a href="#Wiki">Wiki</a>
            </NavLinks>
            <LoginButton>Log In</LoginButton>
          </RightGroup>
        </NavBar>

        <OverlayText>
          <h1>NURIWOOLIM</h1>
          <p>중앙대학교 민중가요 동아리</p>
        </OverlayText>

        <ImgBackground src="/assets/backgroundimage.png" alt="누리울림 로고" />
      </HeaderContainer>
    </>
  );
};

export default Header;
