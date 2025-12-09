import styled from "styled-components";
import { useState } from "react";

const ArticlesListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-auto-rows: auto;

  .header-p {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 5rem;

    border: 1px solid #033148;
    border-left: 0;
    border-right: 0;

    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 1.5625rem;
    font-style: normal;
    font-weight: 600;
    line-height: 90%; /* 1.40625rem */
    letter-spacing: -0.04688rem;
  }

  margin: 10px 0 10px 0;
`;
const ArticlesListWrapper = styled.div``;

const ListRow = styled.div`
  display: contents;
`;

const ArticlesList = ({ page, className }) => {
  const ArticlesGrid = [1, 2, 3, 4];

  return (
    <ArticlesListWrapper className={className}>
      <ArticlesListContainer>
        <ListRow className="grid-header">
          <div class="header-p">번호</div>
          <div class="header-p">제목</div>
          <div class="header-p">등록일</div>
        </ListRow>
      </ArticlesListContainer>
    </ArticlesListWrapper>
  );
};

export default ArticlesList;
