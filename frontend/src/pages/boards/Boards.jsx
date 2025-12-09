import styled from "styled-components";
import ArticlesList from "./ArticlesList";
const BoardsSection = styled.div`
  min-height: 28.8rem;

  background: linear-gradient(
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.8)
    ),
    linear-gradient(
      91deg,
      rgba(143, 203, 231, 0.33) 5.18%,
      rgba(255, 184, 4, 0.33) 84.71%
    );

  h1 {
    color: #033148;
    text-align: center;
    -webkit-text-stroke-width: 1px;
    -webkit-text-stroke-color: rgba(255, 184, 4, 0.6);
    font-family: Pretendard;
    font-size: 5.625rem;
    font-style: normal;
    font-weight: 900;
    line-height: 90%; /* 5.0625rem */
    letter-spacing: -0.16875rem;

    box-sizing: border-box;
    display: flex;
    height: 8.5625rem;
    flex-direction: column;
    justify-content: center;

    margin: 0 0 0 0;
    margin-top: 5.6rem;
  }

  h2 {
    color: #000;
    text-align: center;
    font-family: Pretendard;
    font-size: 2.8125rem;
    font-style: normal;
    font-weight: 900;
    line-height: 90%; /* 2.53125rem */
    letter-spacing: -0.08438rem;
  }

  h3 {
    color: rgba(0, 0, 0, 0.8);
    text-align: center;
    font-family: Pretendard;
    font-size: 1.5625rem;
    font-style: normal;
    font-weight: 800;
    line-height: 90%; /* 1.40625rem */
    letter-spacing: -0.04688rem;
    margin: 0;
  }
`;
const BoardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const BSBContainer = styled.div`
  display: flex;
  gap: 3.12rem;
  margin: auto;

  margin-top: 2.87rem;
`;
const BoardSelectButton = styled.button`
  width: 12.5rem;
  height: 3.4375rem;
  flex-shrink: 0;

  border: 1px solid #033148;
  background: rgba(246, 230, 176, 0.54);
`;

const StyledArticleList = styled(ArticlesList)`
  margin: 0 15.38rem;
  margin-top: 2.6rem;
`;
const Boards = () => {
  return (
    <BoardsSection>
      <BoardsWrapper>
        <h1>BOARD</h1>
        <BSBContainer>
          <BoardSelectButton>
            <h3>기본 공지</h3>
          </BoardSelectButton>

          <BoardSelectButton>
            <h3>자유 게시판</h3>
          </BoardSelectButton>

          <BoardSelectButton>
            <h3>구인구직 게시판</h3>
          </BoardSelectButton>
        </BSBContainer>
        <StyledArticleList />
      </BoardsWrapper>
    </BoardsSection>
  );
};

export default Boards;
