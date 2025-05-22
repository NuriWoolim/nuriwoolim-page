import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Memo : 먼가 동연회 공지, 누리울림 자체 공지, 학교 공지 등등을 구별하는 색깔이 왼쪽에 뜨면 좋을 것 같음.

const Notices = [
  { id: 1, title: "누리울림 봄철 합주회 뱃지", category: "누리울림" },
  {
    id: 2,
    title: "본무대 시 동아리방 이용 관련 공지",
    category: "동아리연합회",
  },
  {
    id: 3,
    title: "LUCAUS 축제 본무대로 인한 107관 출입 통제 안내",
    category: "중앙대학교",
  },
  { id: 4, title: "공용 기타 이펙터 프리셋 시트 공지", category: "누리울림" },
  { id: 5, title: "악기 & 장비 사용 리마인드 공지", category: "누리울림" },
  { id: 6, title: "드럼 킥드럼 피 공지", category: "누리울림" },
];

const NoticeSection = styled.section`
  background-color: #fefaef;
  padding: 45px 0;
`;

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
  }

  p {
    font-family: Pretendard;
    font-weight: 500;
    font-size: 30px;
    line-height: 127%;
    letter-spacing: -3%;
    text-transform: uppercase;
  }

  ul {
    list-style: none;
    padding: 0;
  }
`;

const Notice = () => {
  return (
    <NoticeSection>
      <NoticeWrapper>
        <h2>NOTICE</h2>
        <ul>
          {Notices.map((notice) => (
            <li key={notice.id}>
              <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
            </li>
          ))}
        </ul>
      </NoticeWrapper>
    </NoticeSection>
  );
};

export default Notice;
