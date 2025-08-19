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
        <MenuItem onClick={() => go("/mypage")}>내 정보 보기</MenuItem>
        <MenuItem onClick={() => go("/chnage-password")}>
          내 비밀번호 수정
        </MenuItem>
        <MenuItem onClick={() => go("/mybandschedule")}>내 합주 보기</MenuItem>
      </DropdownMenu>
    </DropdownContainer>
  );
};

export default MyPageDropdown;
