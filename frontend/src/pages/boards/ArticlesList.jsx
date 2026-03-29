import styled from "styled-components";

/* ── 테이블 그리드 ── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr 100px 100px;
`;

const HeaderCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 3.8rem;
  border-top: 1px solid #9caeca;
  border-bottom: 1px solid #9caeca;
  font-family: Pretendard;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2f2f2f;
`;

const BodyRow = styled.button`
  display: contents;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  &:hover > div {
    background: #00000008;
  }
`;

const BodyCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.95rem;
  padding: 0.25rem 1rem;
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 500;
  color: #2f2f2f;
`;

const Empty = styled.div`
  grid-column: 1 / -1;
  padding: 3rem 1rem;
  text-align: center;
  color: #667f9f;
  font-family: Pretendard;
  font-size: 1rem;
`;

/* ── 페이지네이션 ── */
const Pages = styled.div`
  margin-top: 8.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
`;

const PageNum = styled.span`
  min-width: 1.2rem;
  text-align: center;
  font-family: Pretendard;
  font-size: 1rem;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  font-weight: ${({ $active }) => ($active ? "800" : "500")};
  color: ${({ $active }) => ($active ? "#222" : "#707070")};
  opacity: ${({ $disabled }) => ($disabled ? "0.45" : "1")};
`;

const MoveBtn = styled.button`
  display: flex;
  width: 7.7rem;
  height: 2.2rem;
  justify-content: center;
  align-items: center;
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

/* ── 유틸 ── */
const PAGE_WINDOW = 5;

const formatDate = (val) => {
  if (!val) return "-";
  if (typeof val === "string") {
    const d = val.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d.replaceAll("-", ".");
  }
  const date = new Date(val);
  if (Number.isNaN(date.getTime())) return "-";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

/* ── 컴포넌트 ── */
const ArticlesList = ({
  articles = [],
  currentPage = 0,
  totalPages = 1,
  onSelectArticle,
  onPageChange,
  loading = false,
}) => {
  const pageCount = Math.max(totalPages, 1);
  const startNum = currentPage * 10;

  // 5개 단위 페이지 윈도우
  const groupStart = Math.floor(currentPage / PAGE_WINDOW) * PAGE_WINDOW;
  const pages = [];
  for (let i = 0; i < PAGE_WINDOW; i++) {
    pages.push(groupStart + i);
  }

  return (
    <div>
      {/* 테이블 */}
      <Grid>
        <HeaderCell>번호</HeaderCell>
        <HeaderCell>제목</HeaderCell>
        <HeaderCell>작성자</HeaderCell>
        <HeaderCell>등록일</HeaderCell>

        {loading && <Empty>게시글을 불러오는 중입니다.</Empty>}

        {!loading && articles.length === 0 && <Empty>게시글이 없습니다.</Empty>}

        {!loading &&
          articles.map((a, i) => (
            <BodyRow key={a.id} type="button" onClick={() => onSelectArticle?.(a)}>
              <BodyCell>{startNum + i + 1}</BodyCell>
              <BodyCell>{a.title}</BodyCell>
              <BodyCell>{a.writerName || "-"}</BodyCell>
              <BodyCell>
                {formatDate(a.createdAt || a.createdDate || a.date)}
              </BodyCell>
            </BodyRow>
          ))}
      </Grid>

      {/* 페이지네이션 */}
      <Pages>
        <MoveBtn
          disabled={currentPage === 0}
          onClick={() => onPageChange?.(Math.max(currentPage - 1, 0))}
        >
          이전
        </MoveBtn>

        {pages.map((p) => {
          const avail = p < pageCount;
          return (
            <PageNum
              key={p}
              $active={p === currentPage}
              $disabled={!avail}
              onClick={() => avail && onPageChange?.(p)}
            >
              {p + 1}
            </PageNum>
          );
        })}

        <MoveBtn
          disabled={currentPage >= pageCount - 1}
          onClick={() => onPageChange?.(Math.min(currentPage + 1, pageCount - 1))}
        >
          다음
        </MoveBtn>
      </Pages>
    </div>
  );
};

export default ArticlesList;
