import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownToggle = styled.button`
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: #033148;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const DropdownMenu = styled.ul`
  display: ${(props) => (props.visible ? "block" : "none")};

  position: absolute;
  top:120%;
  right: 0;
  background-color: white;
  width: 135px;
  padding: 10px 0;
  margin: 0;
  list-style: none;
  border: 1px solid #ddd;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2)
  z-index:999;
`;

const MenuItem = styled.li`
  padding: 10px 20px;
  font-family: Pretendard;
  font-size: 14px;
  color: #033148;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
`;

const MyPageDropdown = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const go = (path) => {
    navigate(path);
    setVisible(false);
  };

  return (
    <DropdownContainer
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <DropdownToggle>최영현 님 ⌄</DropdownToggle>
      <DropdownMenu visible={visible}>
        <MenuItem onClick={() => go("/mypage")}>내 정보 수정</MenuItem>
        <MenuItem onClick={() => go("/edit-parent")}>학부모 정보 수정</MenuItem>
        <MenuItem onClick={() => go("/change-password")}>
          비밀번호 수정
        </MenuItem>
        <MenuItem onClick={() => go("/set-representative")}>
          대표신문 설정
        </MenuItem>
        <MenuItem onClick={() => go("/push")}>PUSH함</MenuItem>
        <MenuItem onClick={() => go("/mailbox")}>메일함</MenuItem>
        <MenuItem onClick={() => go("/agreement")}>정보제공 동의</MenuItem>
        <MenuItem onClick={() => go("/subscription")}>정보수신 동의</MenuItem>
        <hr />
        <MenuItem onClick={() => go("/env")}>환경설정</MenuItem>
        <MenuItem onClick={() => go("/personalize")}>개인화 설정</MenuItem>
        <MenuItem onClick={() => go("/theme")}>테마 설정</MenuItem>
        <MenuItem onClick={() => go("/font")}>폰트 설정</MenuItem>
        <MenuItem onClick={() => go("/shortcut")}>바로가기 설정</MenuItem>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default MyPageDropdown;
