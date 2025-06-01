import React from "react";
import Header from "./components/Header";
import Notice from "./components/Notice";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NoticeDetail from "./components/NoticeDetail";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Notice />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
};

export default App;
