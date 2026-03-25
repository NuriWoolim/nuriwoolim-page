import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useAtom } from "jotai";
import { userDataState } from "../../atoms";
import { BoardsAPI } from "../../apis/boards";
import { PostsAPI } from "../../apis/posts";
import Quill from "quill";
import "quill/dist/quill.snow.css";

/* ── 레이아웃 ── */
const Section = styled.div`
  min-height: calc(100vh - 85px - 440px);
  background: #f2f2ef;
`;

const Wrapper = styled.div`
  max-width: 1060px;
  margin: 0 auto;
  padding: 3rem 24px 80px;
`;

/* ── 상단 바 ── */
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ── 게시판 선택 ── */
const SelectorWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #637ea4;
  padding: 0.4rem 1rem;
  background: #f2f2ef;
`;

const SelectorLabel = styled.span`
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 600;
  color: #2f3f57;
`;

const ColorDot = styled.span`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  background: #f0da83;
  border: 1px solid #c5b05a;
`;

const HiddenSelect = styled.select`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

/* ── 제목 입력 ── */
const TitleInput = styled.input`
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  background: transparent;
  text-align: center;
  font-family: Pretendard;
  font-size: 2.2rem;
  font-weight: 800;
  color: #c5a33a;
  padding: 1.5rem 0;

  &::placeholder {
    color: #ccc;
    font-style: normal;
  }
`;

/* ── 구분선 ── */
const Divider = styled.hr`
  border: none;
  height: 2px;
  background: linear-gradient(90deg, #6b94c9, #e8c84a);
  margin: 0;
`;

/* ── 에디터 헤더 ── */
const EditorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
`;

const FormatBtns = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FormatBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.4rem;
  font-family: serif;
  cursor: pointer;
  color: #222;
  padding: 0.2rem 0.4rem;

  &:hover {
    color: #3b7bbf;
  }
`;

const Author = styled.span`
  font-family: Pretendard;
  font-size: 0.95rem;
  color: #555;
`;

/* ── Quill 에디터 영역 ── */
const EditorArea = styled.div`
  min-height: 350px;

  .ql-toolbar {
    display: none !important;
  }

  .ql-container {
    border: none !important;
    font-family: Pretendard;
    font-size: 1.1rem;
  }

  .ql-editor {
    min-height: 300px;
    padding: 1rem 0;
    text-align: center;
    line-height: 1.8;
  }

  .ql-editor.ql-blank::before {
    text-align: center;
    font-style: normal;
    color: #aaa;
  }
`;

/* ── + 버튼 ── */
const AddBtn = styled.button`
  display: flex;
  margin: 1rem auto;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: #f0da83;
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #efd67a;
  }
`;

/* ── 첨부파일 ── */
const AttachSection = styled.div`
  padding-top: 1.5rem;
`;

const AttachTitle = styled.h3`
  font-family: Pretendard;
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
  margin: 0 0 1rem;
`;

const AttachRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.6rem;
`;

const AttachNum = styled.span`
  font-family: Pretendard;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  min-width: 1.5rem;
`;

const AttachName = styled.div`
  flex: 1;
  border: 1px solid #b8c1cb;
  padding: 0.5rem 0.8rem;
  font-family: Pretendard;
  font-size: 0.9rem;
  color: #888;
  background: #fff;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveBtn = styled.button`
  width: 2rem;
  height: 2rem;
  border: 1px solid #999;
  background: #fff;
  font-family: Pretendard;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }
`;

/* ── 에러 ── */
const Error = styled.div`
  margin-bottom: 1rem;
  color: #c0392b;
  text-align: center;
  font-family: Pretendard;
`;

/* ── 상수 ── */
const MAX_FILES = 5;

/* ── 컴포넌트 ── */
const ArticleEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userData] = useAtom(userDataState);

  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState(searchParams.get("boardId") || "");
  const [postId] = useState(searchParams.get("postId"));
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState([]);

  const editorEl = useRef(null);
  const quill = useRef(null);
  const fileInputs = useRef([]);

  /* Quill 초기화 */
  useEffect(() => {
    if (!editorEl.current || quill.current) return;
    quill.current = new Quill(editorEl.current, {
      theme: "snow",
      placeholder: "내용을 입력해주세요.",
      modules: { toolbar: [["bold", "italic", "underline"]] },
    });
  }, []);

  /* 게시판 목록 */
  useEffect(() => {
    (async () => {
      try {
        const res = await BoardsAPI.list({ page: 0, size: 20 });
        const list = Array.isArray(res) ? res : (res?.data ?? res?.content ?? []);
        setBoards(list);
      } catch (e) {
        setError(e.response?.data?.message || "게시판 목록을 불러오지 못했습니다.");
      }
    })();
  }, []);

  /* 수정 모드: 기존 글 불러오기 */
  useEffect(() => {
    if (!postId) return;
    (async () => {
      try {
        const p = await PostsAPI.get(postId);
        setTitle(p.title ?? "");
        setBoardId(p.boardId ? String(p.boardId) : "");
        if (quill.current) {
          const delta = quill.current.clipboard.convert({ html: p.content ?? "" });
          quill.current.setContents(delta);
        }
      } catch (e) {
        setError(e.response?.data?.message || "게시글을 불러오지 못했습니다.");
      }
    })();
  }, [postId]);

  /* 포맷 토글 */
  const fmt = (f) => {
    if (!quill.current) return;
    const cur = quill.current.getFormat();
    quill.current.format(f, !cur[f]);
  };

  /* 이미지 삽입 */
  const insertImage = () => {
    if (!quill.current) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const range = quill.current.getSelection(true);
        quill.current.insertEmbed(range.index, "image", reader.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  /* 제출 */
  const submit = async () => {
    setError("");
    const html = quill.current?.root.innerHTML ?? "";
    const text = quill.current?.getText().trim() ?? "";

    if (!boardId || !title.trim() || !text) {
      setError("게시판, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      if (postId) {
        const p = await PostsAPI.update(postId, {
          title: title.trim(),
          content: html,
          type: "GENERAL",
        });
        navigate(`/boards/${p.boardId}/posts/${p.id}`);
      } else {
        await PostsAPI.create({
          boardId: Number(boardId),
          title: title.trim(),
          content: html,
          type: "GENERAL",
        });
        navigate(`/boards?boardId=${boardId}&page=0`);
      }
    } catch (e) {
      setError(e.response?.data?.message || "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  /* 첨부파일 */
  const pickFile = (i) => fileInputs.current[i]?.click();

  const onFileChange = (i, e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFiles((prev) => {
      const next = [...prev];
      next[i] = f;
      return next;
    });
  };

  const removeFile = (i) => {
    setFiles((prev) => {
      const next = [...prev];
      next[i] = null;
      return next;
    });
    if (fileInputs.current[i]) fileInputs.current[i].value = "";
  };

  const selected = boards.find((b) => String(b.id) === String(boardId));

  return (
    <Section>
      <Wrapper>
        {error && <Error>{error}</Error>}

        {/* 상단 바 */}
        <TopBar>
          <Btn onClick={() => navigate(boardId ? `/boards?boardId=${boardId}&page=0` : "/boards")}>
            뒤로가기
          </Btn>

          <SelectorWrap>
            <SelectorLabel>{selected?.title || "게시판을 선택해주세요."}</SelectorLabel>
            <ColorDot />
            <HiddenSelect value={boardId} onChange={(e) => setBoardId(e.target.value)}>
              <option value="">게시판을 선택해주세요.</option>
              {boards.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </HiddenSelect>
          </SelectorWrap>

          <Btn onClick={submit} disabled={submitting}>
            {submitting ? "올리는 중..." : "올리기"}
          </Btn>
        </TopBar>

        {/* 제목 */}
        <TitleInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해주세요."
        />

        <Divider />

        {/* 에디터 헤더 */}
        <EditorHeader>
          <FormatBtns>
            <FormatBtn onClick={() => fmt("bold")}><b>B</b></FormatBtn>
            <FormatBtn onClick={() => fmt("underline")}><u>U</u></FormatBtn>
            <FormatBtn onClick={() => fmt("italic")}><i>I</i></FormatBtn>
          </FormatBtns>
          <Author>작성자: {userData?.name || "유저 닉네임"}</Author>
        </EditorHeader>

        {/* Quill 에디터 */}
        <EditorArea>
          <div ref={editorEl} />
        </EditorArea>

        {/* 이미지 추가 버튼 */}
        <AddBtn type="button" onClick={insertImage}>+</AddBtn>

        <Divider />

        {/* 첨부파일 */}
        <AttachSection>
          <AttachTitle>첨부파일(최대 {MAX_FILES}개)</AttachTitle>
          {Array.from({ length: MAX_FILES }, (_, i) => (
            <AttachRow key={i}>
              <AttachNum>{i + 1}.</AttachNum>
              <AttachName onClick={() => pickFile(i)}>
                {files[i]?.name || "파일을 선택하세요."}
              </AttachName>
              <input
                type="file"
                hidden
                ref={(el) => { fileInputs.current[i] = el; }}
                onChange={(e) => onFileChange(i, e)}
              />
              <RemoveBtn type="button" onClick={() => removeFile(i)}>X</RemoveBtn>
            </AttachRow>
          ))}
        </AttachSection>
      </Wrapper>
    </Section>
  );
};

export default ArticleEditor;
