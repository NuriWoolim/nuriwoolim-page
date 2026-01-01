import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fadeIn } from "../../style/fadeIn";
import MyPageDropdown from "./MyPageDropdown";
import { logout } from "../../apis/user";

const HeaderContainer = styled.header`
  /* position: relative; */
  width: 100%;
  height: 85px;
  overflow: hidden;
  animation: ${fadeIn} 2s ease-out forwards;
`;

const NavBar = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 85px;
  padding: 0 10px;
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
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    navigate("/");
  };

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
              <a href="boards">Boards</a>
              <a href="#Archive">Archive</a>
              <a href="#Equipment">Equipment</a>
              <a href="#Calendar">Calendar</a>

              <a href="#Wiki">Wiki</a>
            </NavLinks>

            {isLoggedIn ? (
              <>
                <button onClick={handleLogout} style={{ all: "unset" }}>
                  Log out
                </button>{" "}
                <MyPageDropdown />
                <LoginButton onClick={handleLogout}>Log out</LoginButton>
              </>
            ) : (
              <LoginButton onClick={() => navigate("/login")}>
                Log In
              </LoginButton>
            )}
          </RightGroup>
        </NavBar>
      </HeaderContainer>
    </>
  );
};

export default Header;
