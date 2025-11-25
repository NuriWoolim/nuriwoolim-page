import React from "react";
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
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 별도 페이지 (레이아웃 제외) */}
        <Route path="/login" element={<Login />} />
        <Route path="/findMyPw" element={<FindMyPw />} />
        <Route path="findMyId" element={<FindMyId />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-terms" element={<SignupTerms />} />
        <Route path="notice/:id" element={<NoticeDetail />} />

        {/* 공통 레이아웃 안에 포함되는 Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
          <Route path="/boards" element={<Boards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
