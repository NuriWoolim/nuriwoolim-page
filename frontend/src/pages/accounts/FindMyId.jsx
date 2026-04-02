import React from "react";
import styled from "styled-components";

const Body = styled.div`
  background: linear-gradient(to right, #daf0f6, #fff2ce);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  width: 380px;
  max-width: calc(100% - 40px);
  border: 2px solid #033148;
  padding: 32px 28px 28px;
  background: radial-gradient(circle at top left, #fff2ce 17%, #daf0f6 70%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
`;

const Title = styled.h2`
  font-family: "Adobe-Caslon-Pro", "Times New Roman", serif;
  font-size: 44px;
  font-weight: 700;
  margin: 0 0 16px 0;
  letter-spacing: -2px;
  color: #0f2230;
  text-align: center;
`;

const Text = styled.p`
  color: #033148;
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
`;

const FindMyId = () => {
  return (
    <Body>
      <Card>
        <Title>FIND ID</Title>
        <Text>
          현재 Swagger 기준 백엔드에는 아이디 찾기 전용 API가 제공되지 않습니다.
          이 페이지에서 회원가입 요청을 보내던 잘못된 동작은 제거했습니다.
          계정 확인이 필요하면 운영진에게 문의하거나 비밀번호 초기화 후 기존
          이메일로 로그인해주세요.
        </Text>
      </Card>
    </Body>
  );
};

export default FindMyId;
