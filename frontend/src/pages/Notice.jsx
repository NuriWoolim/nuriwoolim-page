import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CATEGORY_COLORS, Notices } from "../data/NoticeData";

/* Notice 섹션의 전체 배경 */
const NoticeSection = styled.section`
  background-color: #fefaef;
  padding: 0;
`;

/* Notice 섹션의 컨테이너 박스 */

const NoticeWrapper = styled.div`
  width: 100%;
  padding: 0px 80px 60px;
  background-color: #fefaef;
  border-top: 4px solid #033148;
  border-bottom: 4px solid #033148;
  box-sizing: border-box;
  position: relative;

  h2 {
    font-family: Pretendard;
    font-weight: 800;
    font-size: 56px;
    line-height: 219%;
    letter-spacing: -0.05em;
    text-align: center;
    text-transform: uppercase;
    color: #033148;
    margin-top: 40px;
    margin-bottom: 20px;
    position: relative;
    z-index: 1;
  }

  ul {
    list-style: none;
    padding: 0;
    position: relative;
    z-index: 1;
  }
`;

const LogoOpacity = styled.div`
  position: absolute;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* 왼쪽 상단 로고 */
  &.logo-top-left {
    width: 60%;
    height: 60%;
    top: -93px;
    left: -13%;
    
  }

 

  /* 왼쪽 하단 로고 */
  &.logo-bottom-left {
    width: 130%;
    height: 130%;
    bottom: -230px;
    left: 10%;
  }
`;

const Item = styled.li`
  margin-bottom: 25px;
  font-family: "Pretendard", sans-serif;
  font-weight: 520;
  font-size: 25px;
  letter-spacing: -1px;
  margin-left: 30px;

  a {
    text-decoration: none;
    color: #033148;

    &:hover {
      text-decoration: underline;
    }

    span.category {
      color: ${({ $category }) => CATEGORY_COLORS[$category] || "#555"};
      margin-right: 10px;
      font-weight: 700;
    }
  }
`;

const Notice = () => {
  return (
    <NoticeSection>
      <NoticeWrapper>
        <LogoOpacity className="logo-top-left">
          <img src="/assets/logoopacity2.png" alt="누리울림 로고" />
        </LogoOpacity>
  
        <LogoOpacity className="logo-bottom-left">
          <img src="/assets/logoopacity.png" alt="누리울림 로고" />
        </LogoOpacity>
        <h2>NOTICE</h2>
        <ul>
          {Notices.map((notice) => (
            <Item key={notice.id} $category={notice.category}>
              <Link to={`/notice/${notice.id}`}>
                <span className="category">[{notice.category}]</span>
                {notice.title}
              </Link>
            </Item>
          ))}
        </ul>
      </NoticeWrapper>
    </NoticeSection>
  );
};

export default Notice;
