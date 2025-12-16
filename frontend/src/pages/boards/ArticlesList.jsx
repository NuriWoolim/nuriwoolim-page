import styled from "styled-components";
import { useState } from "react";
import Button from "../../components/ui";

const ArticlesListContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr 1fr;
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

  .body-p {
    display: flex;
    height: 2.5rem;
    flex-direction: column;
    justify-content: center;
    flex-shrink: 0;
    padding-top: 1rem;
    padding-bottom: 1rem;

    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 1.5625rem;
    font-style: normal;
    font-weight: 400;
    line-height: 90%; /* 1.40625rem */
    letter-spacing: -0.04688rem;
  }

  margin: 10px 0 10px 0;
`;
const ArticlesListWrapper = styled.div``;

const ListRow = styled.div`
  display: contents;
  &:hover > .body-p {
    background-color: #00000011;
  }
`;

const Pages = styled.div`
  margin-top: 5rem;
  margin-bottom: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  .page-number {
    color: #515151;
    font-family: Pretendard;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 500;
    line-height: 90%;
  }

  .selected-page-number {
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 1.25rem;
    font-style: normal;
    font-weight: 800;
    line-height: 90%; /* 1.125rem */
    letter-spacing: 0.35rem;
  }
`;

const PageMoveButton = styled(Button)`
  display: flex;
  width: 5rem;
  height: 2rem;
  padding: 0.125rem 0.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;

  border: 1px solid #1a202c;
  background: #fff7e2;
  color: #000;
  text-align: center;
  font-family: Pretendard;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 1.4625rem */
  letter-spacing: -0.03375rem;
`;

const ArticlesList = ({ pageNumber, className }) => {
  const articlesList = [
    {
      board: "공지사항",
      title: "하이",
      date: "2024-05-12",
      ownerName: "daehan",
    },
    {
      board: "공지사항",
      title: "하이",
      date: "2024-05-12",
      ownerName: "daehan",
    },
    {
      board: "공지사항",
      title: "하이",
      date: "2024-05-12",
      ownerName: "daehan",
    },
    {
      board: "공지사항",
      title: "하이",
      date: "2024-05-12",
      ownerName: "daehan",
    },
  ];

  return (
    <ArticlesListWrapper className={className}>
      <ArticlesListContainer>
        <ListRow className="grid-header">
          <div className="header-p">게시판</div>
          <div className="header-p">제목</div>
          <div className="header-p">등록일</div>
          <div className="header-p">작성자</div>
        </ListRow>

        {articlesList.map((article, index) => (
          <ListRow key={index}>
            <div className="body-p">{article.board}</div>
            <div className="body-p">{article.title}</div>
            <div className="body-p">{article.date}</div>
            <div className="body-p">{article.ownerName}</div>
          </ListRow>
        ))}
      </ArticlesListContainer>
      <Pages>
        <PageMoveButton>이전</PageMoveButton>
        {Array.from({ length: 5 }, (_, i) => (
          <div
            className={
              pageNumber * Math.floor(pageNumber / 5) + i === pageNumber
                ? "selected-page-number"
                : "page-number"
            }
            key={i}
          >
            {pageNumber * Math.floor(pageNumber / 5) + i + 1}
          </div>
        ))}
        <PageMoveButton>다음</PageMoveButton>
      </Pages>
    </ArticlesListWrapper>
  );
};

export default ArticlesList;
