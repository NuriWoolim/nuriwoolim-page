import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getMyPage } from "../../apis/user";

const Page = styled.div`
  min-height: calc(100vh - 85px);
  background: #fefaef;
  padding: 48px 24px;
`;

const Card = styled.div`
  max-width: 720px;
  margin: 0 auto;
  border: 2px solid #033148;
  background: white;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  margin: 0 0 20px 0;
  color: #033148;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #e3e7eb;
`;

const Label = styled.div`
  font-weight: 700;
  color: #486284;
`;

const Value = styled.div`
  color: #0f2230;
  word-break: break-word;
`;

const Message = styled.div`
  color: ${({ $error }) => ($error ? "#c0392b" : "#486284")};
`;

const MyPage = () => {
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getMyPage();
        setUserData(result);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "내 정보를 불러오지 못했습니다."
        );
      }
    };

    load();
  }, []);

  return (
    <Page>
      <Card>
        <Title>내 정보</Title>
        {errorMessage && <Message $error>{errorMessage}</Message>}
        {!errorMessage && !userData && <Message>불러오는 중...</Message>}
        {userData && (
          <>
            <Row>
              <Label>이름</Label>
              <Value>{userData.name || "-"}</Value>
            </Row>
            <Row>
              <Label>이메일</Label>
              <Value>{userData.email || "-"}</Value>
            </Row>
            <Row>
              <Label>권한</Label>
              <Value>{userData.type || "-"}</Value>
            </Row>
            <Row>
              <Label>기수</Label>
              <Value>{userData.year ?? "-"}</Value>
            </Row>
            <Row>
              <Label>가입일</Label>
              <Value>{userData.createdDate || "-"}</Value>
            </Row>
          </>
        )}
      </Card>
    </Page>
  );
};

export default MyPage;
