import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import NoticeDetail from "./pages/NoticeDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Main from "./pages/Main";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 별도 페이지 (레이아웃 제외) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="notice/:id" element={<NoticeDetail />} />

        {/* 공통 레이아웃 안에 포함되는 Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
