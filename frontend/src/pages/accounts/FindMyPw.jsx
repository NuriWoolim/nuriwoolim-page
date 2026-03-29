import React, { useState } from "react";
import styled from "styled-components";
import {
  resetPassword,
  sendPasswordResetVerification,
} from "../../apis/user";

const Body = styled.div`
  background: linear-gradient(to right, #daf0f6, #fff2ce);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 80px;
    height: auto;
  }
`;

const Wrapper = styled.div`
  width: 380px;
  border: 2px solid #033148;
  padding: 32px 28px 28px;
  background: radial-gradient(circle at top left, #fff2ce 17%, #daf0f6 70%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  font-family: "Adobe-Caslon-Pro", "Times New Roman", serif;
  font-size: 52px;
  font-weight: 700;
  margin: 0 0 16px 0;
  letter-spacing: -2px;
  color: #0f2230;
  text-align: center;
`;

const Description = styled.p`
  margin: 0 0 20px 0;
  color: #033148;
  font-size: 13px;
  line-height: 1.5;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #033148;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #aaa;
  padding: 7px 9px;
  font-size: 14px;
  background: transparent;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #033148;
  }
`;

const InlineRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: stretch;
`;

const SmallButton = styled.button`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  background-color: rgb(39, 94, 129);
  color: white;
  border: none;
  padding: 0 10px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  font-size: 13px;
  font-weight: 600;
  background-color: rgb(39, 94, 129);
  color: white;
  border: none;
  padding: 10px 18px;
  cursor: pointer;
  margin-top: 8px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  font-size: 12px;
  color: #c0392b;
  letter-spacing: -0.5px;
  margin-top: 8px;
  text-align: center;
`;

const SuccessBox = styled.div`
  margin-top: 16px;
  padding: 14px;
  border: 1px solid #2e7d60;
  background: rgba(46, 125, 96, 0.08);
  color: #1e5b45;
  font-size: 13px;
  line-height: 1.6;
`;

const FindMyPw = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");

  const handleSendVerification = async () => {
    if (!email) return;

    setSendLoading(true);
    setErrorMessage("");
    setTemporaryPassword("");

    try {
      await sendPasswordResetVerification(email);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "인증 메일 전송에 실패했습니다."
      );
    } finally {
      setSendLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email || !code) return;

    setResetLoading(true);
    setErrorMessage("");
    setTemporaryPassword("");

    try {
      const result = await resetPassword(email, code);
      setTemporaryPassword(result?.temporaryPassword ?? "");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "비밀번호 초기화에 실패했습니다."
      );
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Body>
      <Logo>
        <a href="/">
          <img src="/assets/mainlogo.png" alt="누리울림 로고" />
        </a>
      </Logo>
      <Wrapper>
        <Title>RESET PW</Title>
        <Description>
          가입한 이메일로 인증 코드를 받은 뒤, 코드를 입력하면 임시 비밀번호를
          발급합니다.
        </Description>

        <FieldGroup>
          <Label>이메일</Label>
          <InlineRow>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="이메일을 입력해주세요."
            />
            <SmallButton
              onClick={handleSendVerification}
              disabled={!email || sendLoading}
            >
              {sendLoading ? "전송 중..." : "인증 메일 전송"}
            </SmallButton>
          </InlineRow>
        </FieldGroup>

        <FieldGroup>
          <Label>인증 코드</Label>
          <Input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="메일로 받은 코드를 입력해주세요."
          />
        </FieldGroup>

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        <SubmitButton
          onClick={handleResetPassword}
          disabled={!email || !code || resetLoading}
        >
          {resetLoading ? "초기화 중..." : "임시 비밀번호 발급"}
        </SubmitButton>

        {temporaryPassword && (
          <SuccessBox>
            임시 비밀번호: <strong>{temporaryPassword}</strong>
            <br />
            로그인 후 즉시 비밀번호를 변경해주세요.
          </SuccessBox>
        )}
      </Wrapper>
    </Body>
  );
};

export default FindMyPw;
