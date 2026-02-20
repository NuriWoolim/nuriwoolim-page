import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../pages/header/Header";
import Footer from "../pages/Footer";
import styled from "styled-components";

const RootDiv = styled.div`
  width: 100%;
  min-width: 500px;
`;
const Layout = () => {
  return (
    <RootDiv>
      <Header />
      <Outlet /> {/* 각 페이지 컴포넌트가 이 자리에 렌더링됨 */}
      <Footer />
    </RootDiv>
  );
};

export default Layout;
