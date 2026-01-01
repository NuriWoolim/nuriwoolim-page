import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { sendVerification, signup, verifyEmail } from "../../apis/user";
import { useForm } from "../../hooks/useForm";

const Body = styled.div`
  background: linear-gradient(to right, #daf0f6, #fff2ce);
  min-height: 100vh;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  img {
    width: 242px;
    height: 242px;
  }
`;

const Wrapper = styled.div`
  width: 452px;
  height: 458px;
  border: 2px solid #033148;
  padding: 40px 25px;
  background: radial-gradient(circle at top left, #fff2ce 17%, #daf0f6 70%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  margin: -25px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-family: "Adobe-Caslon-Pro";
  font-size: 80px;
  font-weight: 700;
  margin-top: 0px;
  margin-bottom: 0px;
  letter-spacing: -4px;
  color: #0f2230;
`;

const BtnWrapper = styled.div`
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  button {
    justify-content: flex-end;
    font-weight: 500;
    font-size: 14px;
    background-color: rgb(39, 94, 129);
    color: white;
    letter-spacing: -1px;
    padding: 0px;
    border: none;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 3px 3px skyblue;
      color: black;
      background-color: white;
    }
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  div {
    font-size: 14px;
    color: #031148;
    letter-spacing: -1px;
  }
`;

const Inputs = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
  input {
    font-size: 20px;
    height: 12px;
    width: 324px;
    border: 1px solid #888;
    padding: 10px;

    &::placeholder {
      color: #8888;
      font-size: 12px;
      font-weight: 400;
      font-family: "Pretendard";
    }
  }
`;

// 1) 공용 래퍼
const InputWithButton = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
`;

// 2) 인풋: 버튼이 겹치므로 오른쪽 패딩을 늘린다(버튼 너비 + 여백)
const RightPaddedInput = styled.input`
  width: 100%;
  height: 40px;
  border: 1px solid #033148;
  padding: 0 100px 0 12px; /* ← 버튼 88px + 여백 12px 가정 */
  font-size: 16px;
  box-sizing: border-box;
`;

// 3) 버튼: 래퍼 기준 우측·수직 중앙 고정
const InlineBtn = styled.button`
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  height: 32px;
  min-width: 88px;
  padding: 0 10px;
  border: 1px solid #275e81;
  background: #275e81;
  color: #fff;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #fff;
    color: #000;
    box-shadow: 0 0 3px 3px skyblue;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  button {
    position: absolute;
    top: 55%;
    right: 3rem;
    transform: translateY(-50%);
    height: 32px;
    min-width: 88px;
    padding: 0 10px;
    border: 1px solid #275e81;
    background: #275e81;
    color: #fff;
    font-size: 13px;
    cursor: pointer;

    &:hover {
      background: #fff;
      color: #000;
      box-shadow: 0 0 3px 3px skyblue;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const HelperText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  min-height: 16px;
`;

const Signup = () => {
  const [name, onChangeName] = useForm("");
  const [email, onChangeEmail] = useForm("");
  const [verifyCode, onChangeVerifyCode] = useForm("");
  const [password, onChangePassword] = useForm("");
  const [passwordConfirm, onChangePasswordConfirm] = useForm("");
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const isEmailValid = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // 아주 기초 검증

  const onSendVerification = async () => {
    setErrorMessage("");
    setInfoMessage("");
    if (!isEmailValid) {
      setErrorMessage("올바른 이메일 형식이 아닙니다.");
      return;
    }
    try {
      setSending(true);
      await sendVerification(email);
      setSending(false);
      setSent(true);
      setInfoMessage("인증 메일을 보냈습니다. 메일함을 확인해주세요.");
    } catch (error) {
      setSending(false);
      setErrorMessage(
        error?.response?.data?.message || "인증 메일 발송에 실패했습니다."
      );
    }
  };

  const onVerifyCode = async () => {
    setErrorMessage("");
    setInfoMessage("");
    if (!verifyCode) {
      setErrorMessage("인증 코드를 입력해주세요.");
      return;
    }
    try {
      setVerifying(true);
      const res = await verifyEmail(email, verifyCode);
      setVerifying(false);
      setVerified(true);
      setInfoMessage("이메일 인증이 완료되었습니다.");
    } catch (error) {
      setVerifying(false);
      setVerified(false);
      setErrorMessage(
        err?.response?.data?.message || "인증 코드가 올바르지 않습니다."
      );
    }
  };

  const onClickSignup = async () => {
    setErrorMessage("");
    setInfoMessage("");
    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!verified) {
      setErrorMessage("이메일 인증을 완료해주세요.");
      return;
    }

    try {
      await signup(name, email, password, code);
      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      setErrorMessage(backendMessage);
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
        <Title>SIGN-UP</Title>
        <Form>
          <Inputs>
            <div>이름</div>
            <input value={name} onChange={onChangeName}></input>

            <div>이메일</div>
            <InputWithButton>
              <RightPaddedInput
                placeholder="example@cau.ac.kr"
                value={email}
                onChange={onChangeEmail}
                aria-label="이메일"
              />
              <InlineBtn
                type="button"
                onClick={onSendVerification}
                disabled={!isEmailValid || sending}
              >
                {sending ? "발송중..." : "인증코드 전송"}
              </InlineBtn>
              <HelperText>
                {infoMessage && (
                  <div
                    style={{
                      color: "blue",
                      fontSize: "14px",
                      marginTop: "10px",
                    }}
                  >
                    {infoMessage}
                  </div>
                )}
              </HelperText>
            </InputWithButton>

            <div>이메일 인증 코드 입력</div>
            <InlineRow>
              <input
                placeholder="인증 코드를 입력하세요"
                value={verifyCode}
                onChange={onChangeVerifyCode}
              ></input>
              <button
                onClick={onVerifyCode}
                disabled={!verifyCode || verifying}
              >
                {verifying ? "확인중..." : verified ? "재검증" : "인증"}
              </button>
            </InlineRow>
            <div>비밀번호</div>
            <input
              type="password"
              value={password}
              onChange={onChangePassword}
            ></input>
            <div>비밀번호 확인</div>
            <input
              type="password"
              value={passwordConfirm}
              onChange={onChangePasswordConfirm}
            ></input>
          </Inputs>
          {errorMessage && (
            <div
              style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}
            >
              {errorMessage}
            </div>
          )}
          <BtnWrapper>
            <button
              onClick={onClickSignup}
              disabled={!email || !password || password !== passwordConfirm}
            >
              Join
            </button>
          </BtnWrapper>
        </Form>
      </Wrapper>
    </Body>
  );
};

export default Signup;
