import styled from "styled-components";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ArticlesList from "./ArticlesList";
import { BoardsAPI } from "../../apis/boards";
import { PostsAPI } from "../../apis/posts";

/* ── 전체 배경 ── */
const Section = styled.div`
  min-height: calc(100vh - 85px - 440px);
  background: #f2f2ef;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 80px;
`;

/* ── BOARD 타이틀 ── */
const Title = styled.h1`
  text-align: center;
  font-family: Pretendard;
  font-size: 8rem;
  font-weight: 900;
  color: #3b5377;
  letter-spacing: -0.14rem;
  line-height: 1;
  margin: 0;
  padding-top: 4.6rem;
`;

/* ── 게시판 선택 버튼 그룹 ── */
const TabGroup = styled.div`
  display: flex;
  gap: 2rem;
  margin: 2.6rem auto 0;
  flex-wrap: wrap;
  justify-content: center;
`;

const Tab = styled.button`
  min-width: 9.8rem;
  height: 3.2rem;
  padding: 0 1.2rem;
  border: 1px solid #637ea4;
  background: ${({ $active }) => ($active ? "#354b6d" : "#f0da83")};
  cursor: pointer;
  font-family: Pretendard;
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ $active }) => ($active ? "#f7f8fa" : "#2e405f")};

  &:hover {
    background: ${({ $active }) => ($active ? "#3e5a82" : "#efd67a")};
  }
`;

/* ── 글쓰기 버튼 ── */
const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.9rem;
  margin-bottom: 0.9rem;
`;

const WriteBtn = styled.button`
  min-width: 7rem;
  height: 2.1rem;
  padding: 0.2rem 1.2rem;
  border: 1px solid #637ea4;
  background: #f2f2ef;
  color: #2f3f57;
  font-family: Pretendard;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #e9ecef;
  }
`;

const Error = styled.div`
  margin-top: 1rem;
  color: #c0392b;
  text-align: center;
  font-family: Pretendard;
`;

/* ── 컴포넌트 ── */
const Boards = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const qBoardId = Number(searchParams.get("boardId") || 0);
  const qPage = Number(searchParams.get("page") || 0);

  /* 게시판 목록 */
  useEffect(() => {
    (async () => {
      try {
        const res = await BoardsAPI.list({ page: 0, size: 20 });
        const list = res?.data ?? [];
        setBoards(list);

        const match = list.find((b) => b.id === qBoardId) ?? list[0];
        if (match) {
          setSelectedBoard(match);
          if (!qBoardId) {
            setSearchParams({ boardId: String(match.id), page: "0" });
          }
        }
      } catch (e) {
        setError(e.response?.data?.message || "게시판 목록을 불러오지 못했습니다.");
      }
    })();
  }, []);

  /* boardId 변경 시 선택 동기화 */
  useEffect(() => {
    if (!boards.length) return;
    const match = boards.find((b) => b.id === qBoardId) ?? boards[0];
    setSelectedBoard(match ?? null);
  }, [boards, qBoardId]);

  /* 게시글 목록 */
  useEffect(() => {
    if (!selectedBoard?.id) return;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await PostsAPI.list({
          boardId: selectedBoard.id,
          page: qPage,
          size: 10,
        });
        setPosts(res?.data ?? []);
        setCurrentPage(res?.currentPage ?? qPage);
        setTotalPages(res?.totalPages ?? 1);
      } catch (e) {
        setError(e.response?.data?.message || "게시글 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedBoard?.id, qPage]);

  const selectBoard = (board) => {
    setSearchParams({ boardId: String(board.id), page: "0" });
  };

  const changePage = (page) => {
    if (!selectedBoard) return;
    setSearchParams({ boardId: String(selectedBoard.id), page: String(page) });
  };

  return (
    <Section>
      <Wrapper>
        <Title>BOARD</Title>

        <TabGroup>
          {boards.map((b) => (
            <Tab
              key={b.id}
              $active={selectedBoard?.id === b.id}
              onClick={() => selectBoard(b)}
            >
              {b.title}
            </Tab>
          ))}
        </TabGroup>

        <Toolbar>
          {selectedBoard && (
            <WriteBtn
              onClick={() =>
                navigate(`/boards/editor?boardId=${selectedBoard.id}`)
              }
            >
              글쓰기
            </WriteBtn>
          )}
        </Toolbar>

        {error && <Error>{error}</Error>}

        <ArticlesList
          articles={posts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={changePage}
          onSelectArticle={(article) =>
            navigate(`/boards/${selectedBoard?.id}/posts/${article.id}`)
          }
          loading={loading}
        />
      </Wrapper>
    </Section>
  );
};

export default Boards;
