import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../pages/header/Header";
import Footer from "../pages/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet /> {/* 각 페이지 컴포넌트가 이 자리에 렌더링됨 */}
      <Footer />
    </>
  );
};

export default Layout;
