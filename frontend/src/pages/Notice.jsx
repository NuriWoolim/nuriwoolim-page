import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { BoardsAPI } from "../apis/boards";
import { PostsAPI } from "../apis/posts";

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

  @media (max-width: 768px) {
    padding: 0 20px 40px;

    h2 {
      font-size: 36px;
      margin-top: 24px;
      margin-bottom: 12px;
    }
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

  @media (max-width: 768px) {
    display: none;
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
      color: #1a6fa0;
      margin-right: 10px;
      font-weight: 700;
    }
  }

  @media (max-width: 768px) {
    font-size: 16px;
    margin-left: 0;
    margin-bottom: 16px;

    a span.category {
      display: block;
      margin-bottom: 2px;
      font-size: 13px;
    }
  }
`;

const Notice = () => {
  const [posts, setPosts] = useState([]);
  const [noticeBoard, setNoticeBoard] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const boardsRes = await BoardsAPI.list({ page: 0, size: 20 });
        const boardList = Array.isArray(boardsRes)
          ? boardsRes
          : (boardsRes?.data ?? boardsRes?.content ?? []);

        // "공지" 게시판 찾기 (첫 번째 게시판을 fallback)
        const board =
          boardList.find((b) => b.title?.includes("공지")) ?? boardList[0];
        if (!board) return;

        setNoticeBoard(board);

        const postsRes = await PostsAPI.list({
          boardId: board.id,
          page: 0,
          size: 6,
        });
        const postList = Array.isArray(postsRes)
          ? postsRes
          : (postsRes?.data ?? postsRes?.content ?? []);
        setPosts([...postList].sort((a, b) => b.id - a.id));
      } catch {
        // API 실패 시 빈 목록 유지
      }
    })();
  }, []);

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
          {posts.map((post) => (
            <Item key={post.id}>
              <Link to={`/boards/${noticeBoard?.id}/posts/${post.id}`}>
                <span className="category">
                  [{noticeBoard?.title ?? "공지"}]
                </span>
                {post.title}
              </Link>
            </Item>
          ))}
        </ul>
      </NoticeWrapper>
    </NoticeSection>
  );
};

export default Notice;
