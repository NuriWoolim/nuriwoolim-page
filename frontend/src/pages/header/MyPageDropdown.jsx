import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAtom } from "jotai";
import { userDataState } from "../../atoms";
import { logout } from "../../apis/user";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #023349;
  border: none;
  border-radius: 10px;
  padding: 8px 10px 8px 16px;
  cursor: pointer;
  white-space: nowrap;
`;

const NameText = styled.span`
  color: #fefaef;
  font-family: Pretendard;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.3px;
`;

const ArrowBox = styled.span`
  background: #ffd04e;
  border-radius: 5px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #023349;
  flex-shrink: 0;
`;

const DropdownMenu = styled.div`
  display: ${(p) => (p.$visible ? "block" : "none")};
  position: absolute;
  top: 100%;
  right: 0;
  background: #fefaef;
  border: none;
  border-radius: 0 0 10px 10px;
  min-width: 100%;
  z-index: 9999;
  overflow: hidden;
`;

const TopItem = styled.div`
  padding: 10px 14px;
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 600;
  color: #023349;
  text-align: right;
  background: #ffffff;
  border-bottom: 1px solid #d4d8e0;
  cursor: pointer;
  &:hover {
    background: #dceeff;
  }
`;

const MenuItem = styled.div`
  padding: 10px 14px;
  font-family: Pretendard;
  font-size: 13px;
  font-weight: 600;
  color: #023349;
  text-align: right;
  border-bottom: 1px solid #d4d8e0;
  cursor: pointer;
  &:hover {
    background: #dceeff;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const LogoutItem = styled(MenuItem)`
  color: #c0392b;
  border-bottom: none;
`;

const MyPageDropdown = () => {
  const [visible, setVisible] = useState(false);
  const [userData] = useAtom(userDataState);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const go = (path) => {
    navigate(path);
    setVisible(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    navigate("/");
    setVisible(false);
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContainer ref={containerRef}>
      <ToggleButton $open={visible} onClick={() => setVisible((v) => !v)}>
        <NameText>{userData?.name ? `${userData.name} 님` : "마이페이지"}</NameText>
        <ArrowBox>{visible ? "▲" : "▼"}</ArrowBox>
      </ToggleButton>

      <DropdownMenu $visible={visible}>
        <TopItem onClick={() => go("/mypage")}>내 정보 보기</TopItem>
        <MenuItem onClick={() => go("/change-password")}>내 비밀번호 수정</MenuItem>
        <MenuItem onClick={() => go("/mybandschedule")}>내 합주 보기</MenuItem>
        <MenuItem onClick={() => go("/myteamschedule")}>내 팀 합주 보기</MenuItem>
        <MenuItem onClick={() => go("/settings")}>사용자 설정</MenuItem>
        <LogoutItem onClick={handleLogout}>로그아웃</LogoutItem>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default MyPageDropdown;
