import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAtom } from "jotai";
import { userDataState } from "../../atoms";
import { fadeIn } from "../../style/fadeIn";
import MyPageDropdown from "./MyPageDropdown";

const HeaderContainer = styled.header`
  position: relative;
  width: 100%;
  height: 85px;
  z-index: 1000;
  animation: ${fadeIn} 2s ease-out forwards;

  @media (max-width: 768px) {
    height: 60px;
  }
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
  overflow: visible;

  background-image: url("/assets/navigator.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;

  @media (max-width: 768px) {
    height: 60px;
    padding: 0 8px;
    background-size: cover;
  }
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

  @media (max-width: 768px) {
    img {
      width: 80px;
      height: 80px;
    }
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  transform: translateX(-50px);

  @media (max-width: 1024px) {
    gap: 20px;
    transform: translateX(-20px);
  }

  @media (max-width: 768px) {
    display: none;
  }
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

  @media (max-width: 1024px) {
    gap: 20px;
    a {
      font-size: 14px;
    }
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

/* ── 모바일 햄버거 ── */
const Hamburger = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1100;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-right: 12px;
  }
`;

const HamburgerLine = styled.span`
  display: block;
  width: 24px;
  height: 3px;
  background: #023349;
  border-radius: 2px;
  transition: all 0.3s ease;

  &:nth-child(1) {
    transform: ${({ $open }) => ($open ? "rotate(45deg) translate(5px, 6px)" : "none")};
  }
  &:nth-child(2) {
    opacity: ${({ $open }) => ($open ? 0 : 1)};
  }
  &:nth-child(3) {
    transform: ${({ $open }) => ($open ? "rotate(-45deg) translate(5px, -6px)" : "none")};
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(254, 250, 239, 0.97);
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
    gap: 28px;
    z-index: 999;

    a {
      text-decoration: none;
      color: #023349;
      font-size: 20px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const [userData] = useAtom(userDataState);
  const isLoggedIn = !!localStorage.getItem("accessToken") && !!userData?.id;
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <HeaderContainer>
        <NavBar>
          <Logo>
            <a href="/">
              <img src="/assets/mainlogo.png" alt="누리울림 로고" />
            </a>
          </Logo>

          <RightGroup>
            <NavLinks>
              <a href="/">Home</a>
              <a href="/boards">Boards</a>
              <a href="#Archive">Archive</a>
              <a href="#Equipment">Equipment</a>
              <a href="#Calendar">Calendar</a>
              <a href="#Wiki">Wiki</a>
            </NavLinks>

            {isLoggedIn ? (
              <MyPageDropdown />
            ) : (
              <LoginButton onClick={() => navigate("/login")}>
                Log In
              </LoginButton>
            )}
          </RightGroup>

          <Hamburger onClick={() => setMenuOpen(!menuOpen)}>
            <HamburgerLine $open={menuOpen} />
            <HamburgerLine $open={menuOpen} />
            <HamburgerLine $open={menuOpen} />
          </Hamburger>
        </NavBar>
      </HeaderContainer>

      <MobileMenu $open={menuOpen}>
        <a href="/" onClick={closeMenu}>Home</a>
        <a href="/boards" onClick={closeMenu}>Boards</a>
        <a href="#Archive" onClick={closeMenu}>Archive</a>
        <a href="#Equipment" onClick={closeMenu}>Equipment</a>
        <a href="#Calendar" onClick={closeMenu}>Calendar</a>
        <a href="#Wiki" onClick={closeMenu}>Wiki</a>
        {isLoggedIn ? (
          <MyPageDropdown />
        ) : (
          <LoginButton onClick={() => { closeMenu(); navigate("/login"); }}>
            Log In
          </LoginButton>
        )}
      </MobileMenu>
    </>
  );
};

export default Header;
