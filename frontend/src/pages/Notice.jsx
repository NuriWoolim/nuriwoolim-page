import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CATEGORY_COLORS, Notices } from "../data/NoticeData";

/* Notice 섹션의 전체 배경 */
const NoticeSection = styled.section`
  background-color: #fefaef;
  padding: 45px 0;
`;

/* Notice 섹션의 컨테이너 박스 */

const NoticeWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  padding: 0px 40px 40px;
  background-color: #ffffff;
  border: 4px solid #033148;

  h2 {
    font-family: Plus Jakarta Sans;
    font-weight: 800;
    font-size: 40px;
    line-height: 127%;
    letter-spacing: -6%;
    text-transform: uppercase;
    margin-top: 40px;
    margin-bottom: 50px;
  }

  ul {
    list-style: none;
    padding: 0;
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
