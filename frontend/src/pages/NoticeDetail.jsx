import React from "react";
import { useParams } from "react-router-dom";

const NoticeDetail = () => {
  const { id } = useParams();

  return (
    <div style={{ padding: "50px" }}>
      <h2>공지 상세 페이지</h2>
      <p>이곳은 공지 번호 {id}번의 상세 내용입니다.</p>
    </div>
  );
};

export default NoticeDetail;
