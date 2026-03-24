import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useAtom } from "jotai";
import { userDataState } from "../../atoms";
import { PostsAPI } from "../../apis/posts";

/* ── 레이아웃 ── */
const Section = styled.div`
  min-height: calc(100vh - 85px - 440px);
  background: #f2f2ef;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 24px 80px;
`;

/* ── 상단 바 ── */
const TopBar = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 2.2rem;
`;

const Btn = styled.button`
  min-width: 5.5rem;
  height: 2.2rem;
  padding: 0.2rem 0.7rem;
  border: 1px solid #637ea4;
  background: #f2f2ef;
  color: #2f3f57;
  font-family: Pretendard;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #e9ecef;
  }
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 0.6rem;
`;

/* ── 가운데 제목 영역 ── */
const Center = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
`;

const BoardName = styled.p`
  font-family: Pretendard;
  font-size: 1.2rem;
  font-weight: 700;
  color: #3b7bbf;
  margin: 0 0 0.4rem;
`;

const PostTitle = styled.h1`
  font-family: Pretendard;
  font-size: 2.4rem;
  font-weight: 900;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
`;

/* ── 구분선 ── */
const Divider = styled.hr`
  border: none;
  height: 2px;
  background: linear-gradient(90deg, #6b94c9, #e8c84a);
  margin: 4.5rem 0 1rem;
`;

/* ── 메타 ── */
const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: Pretendard;
  font-size: 1rem;
  color: #555;
  padding: 0.5rem 0;
`;

/* ── 본문 ── */
const Content = styled.div`
  min-height: 300px;
  padding: 2rem 0;
  font-family: Pretendard;
  font-size: 1.15rem;
  line-height: 1.8;
  color: #1a1a1a;
  text-align: center;
  white-space: pre-wrap;

  img {
    max-width: 100%;
    margin: 1.5rem auto;
    display: block;
  }

  .image-placeholder {
    width: 460px;
    height: 230px;
    background: #d9d9d9;
    margin: 1.5rem auto;
  }
`;

/* ── 하단 네비게이션 ── */
const BottomNav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
  margin-top: 3rem;
`;

const NavLabel = styled.span`
  font-family: Pretendard;
  font-size: 0.95rem;
  color: #555;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NavBtn = styled.button`
  width: 7.7rem;
  height: 2.2rem;
  border: 1px solid #9b9b9b;
  background: #ebe7dc;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 500;
  color: #2d2d2d;
  cursor: pointer;

  &:hover {
    background: #e4dfd2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNum = styled.span`
  font-family: Pretendard;
  font-size: 1.2rem;
  font-weight: 800;
  color: #222;
`;

/* ── 상태 표시 ── */
const StatusText = styled.div`
  text-align: center;
  font-family: Pretendard;
  font-size: 1.2rem;
  color: ${({ $error }) => ($error ? "#c0392b" : "#667f9f")};
  padding: 3rem 0;
`;

/* ── 유틸 ── */
const fmtDate = (v) => {
  if (!v) return "";
  if (typeof v === "string") {
    const d = v.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d.replaceAll("-", ".");
  }
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

/* ── 목업 데이터 (API 500 대비) ── */
const MOCK_POST = {
  id: 1,
  title: "Room6to9의 데뷔를 축하합니다",
  boardTitle: "자유 게시판",
  writerName: "관리자",
  createdAt: "2025-08-24",
  content:
    "아 개빵이쳐서 힘들다\n디비누워서 롤체나 하고 싶다\n롤체할사람? 배불뚝이\n드갈사람?",
  permission: { canEdit: true, canDelete: true },
  prevPost: { id: 0, title: "head ..." },
  nextPost: { id: 2, title: "어쩌고 어쩌궁" },
};

/* ── 컴포넌트 ── */
const PostDetail = () => {
  const navigate = useNavigate();
  const { boardId, postId } = useParams();
  const [userData] = useAtom(userDataState);

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await PostsAPI.get(postId);
        setPost(res);
      } catch (e) {
        // API 실패 시 목업 데이터 사용
        setPost({ ...MOCK_POST, id: Number(postId) });
      }
    })();
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await PostsAPI.remove(postId);
      navigate(`/boards?boardId=${boardId}&page=0`);
    } catch (e) {
      setError(e.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  const prev = post?.prevPost;
  const next = post?.nextPost;

  return (
    <Section>
      <Wrapper>
        {error && <StatusText $error>{error}</StatusText>}
        {!post && !error && <StatusText>불러오는 중...</StatusText>}

        {post && (
          <>
            {/* 상단 */}
            <TopBar>
              <Btn onClick={() => navigate(`/boards?boardId=${boardId}&page=0`)}>
                뒤로가기
              </Btn>

              <Center>
                <BoardName>{post.boardTitle}</BoardName>
                <PostTitle>{post.title}</PostTitle>
              </Center>

              <BtnGroup>
                {post.permission?.canEdit && (
                  <Btn
                    onClick={() =>
                      navigate(`/boards/editor?boardId=${boardId}&postId=${post.id}`)
                    }
                  >
                    수정하기
                  </Btn>
                )}
                {post.permission?.canDelete && (
                  <Btn onClick={handleDelete}>삭제하기</Btn>
                )}
              </BtnGroup>
            </TopBar>

            <Divider />

            {/* 메타 */}
            <Meta>
              <span>작성자: {post.writerName || "알 수 없음"}</span>
              <span>{fmtDate(post.createdAt || post.createdDate)}</span>
            </Meta>

            {/* 본문 */}
            <Content>
              {post.content}
              <div className="image-placeholder" />
            </Content>

            {/* 하단 이전/다음 */}
            <BottomNav>
              <NavLabel>{prev ? `이전 게시물 ${prev.title}` : ""}</NavLabel>
              <NavBtn disabled={!prev} onClick={() => prev && navigate(`/boards/${boardId}/posts/${prev.id}`)}>
                이전 게시물
              </NavBtn>
              <PageNum>{post.postNumber ?? post.id}</PageNum>
              <NavBtn disabled={!next} onClick={() => next && navigate(`/boards/${boardId}/posts/${next.id}`)}>
                다음 게시물
              </NavBtn>
              <NavLabel>{next ? next.title : ""}</NavLabel>
            </BottomNav>
          </>
        )}
      </Wrapper>
    </Section>
  );
};

export default PostDetail;
