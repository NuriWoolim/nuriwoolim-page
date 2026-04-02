import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import NoticeDetail from "./pages/NoticeDetail";
import Login from "./pages/accounts/Login";
import Signup from "./pages/accounts/Signup";
import Main from "./pages/Main";
import FindMyId from "./pages/accounts/FindMyId";
import FindMyPw from "./pages/accounts/FindMyPw";
import SignupTerms from "./pages/accounts/SignupTerms";
import Boards from "./pages/boards/Boards";
import ArticleEditor from "./pages/boards/ArticleEditor";
import MyPage from "./pages/accounts/MyPage";
import ChangePassword from "./pages/accounts/ChangePassword";
import PostDetail from "./pages/boards/PostDetail";
import { getAccessToken, clearAccessToken } from "./apis/client";
import { store, userDataState } from "./atoms";
import { RESET } from "jotai/utils";
import { getMyPage } from "./apis/user";

const App = () => {
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      // accessToken이 없으면 저장된 사용자 데이터도 초기화
      store.set(userDataState, RESET);
      return;
    }
    // accessToken이 있으면 서버에서 유효성 검증
    getMyPage().catch(() => {
      clearAccessToken();
      store.set(userDataState, RESET);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 별도 페이지 (레이아웃 제외) */}
        <Route path="/login" element={<Login />} />
        <Route path="/findMyPw" element={<FindMyPw />} />
        <Route path="/findMyId" element={<FindMyId />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-terms" element={<SignupTerms />} />
        <Route path="/notice/:id" element={<NoticeDetail />} />

        {/* 공통 레이아웃 안에 포함되는 Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/boards/editor" element={<ArticleEditor />} />
          <Route path="/boards/:boardId/posts/:postId" element={<PostDetail />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
