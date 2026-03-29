import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signup, sendVerification, verifyEmail } from "../../apis/user";

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
  margin: 0 0 24px 0;
  letter-spacing: -2px;
  color: #0f2230;
  text-align: center;
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
  letter-spacing: -0.5px;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #aaa;
  padding: 7px 9px;
  font-size: 14px;
  font-family: "Pretendard", sans-serif;
  background: transparent;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #033148;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const InlineRow = styled.div`
  display: flex;
  gap: 6px;
  align-items: stretch;
`;

const InlineInput = styled(Input)`
  flex: 1;
  width: auto;
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
  letter-spacing: -0.5px;
  font-family: "Pretendard", sans-serif;

  &:hover:not(:disabled) {
    background-color: #1e5f88;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HintText = styled.div`
  font-size: 11px;
  color: ${({ $color }) => $color || "#e05a00"};
  letter-spacing: -0.5px;
  margin-top: 2px;
`;

const BtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const SubmitButton = styled.button`
  font-size: 13px;
  font-weight: 600;
  background-color: rgb(39, 94, 129);
  color: white;
  border: none;
  padding: 8px 18px;
  cursor: pointer;
  letter-spacing: -0.5px;
  font-family: "Pretendard", sans-serif;

  &:hover:not(:disabled) {
    background-color: #1e5f88;
  }

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

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [isVerified, setIsVerified] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
  const passwordMismatch = passwordConfirm && password !== passwordConfirm;

  const handleSendVerification = async () => {
    if (!email) return;
    setSendLoading(true);
    setErrorMessage("");
    try {
      await sendVerification(email);
    } catch (error) {
      const msg = error.response?.data?.message || "인증 메일 전송에 실패했습니다.";
      setErrorMessage(msg);
    } finally {
      setSendLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!email || !code) return;
    setVerifyLoading(true);
    setErrorMessage("");
    try {
      await verifyEmail(email, code);
      setIsVerified(true);
    } catch (error) {
      const msg = error.response?.data?.message || "인증 코드가 올바르지 않습니다.";
      setErrorMessage(msg);
      setIsVerified(false);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSignup = async () => {
    setErrorMessage("");
    if (!isVerified) {
      setErrorMessage("이메일 인증을 완료해주세요.");
      return;
    }
    if (!passwordValid) {
      setErrorMessage("비밀번호는 대소문자를 포함한 8자 이상이어야 합니다.");
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await signup(username, email, password, code);
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
      setErrorMessage(msg);
    }
  };

  const canSubmit =
    username &&
    email &&
    isVerified &&
    password &&
    passwordConfirm &&
    passwordValid &&
    password === passwordConfirm;

  return (
    <Body>
      <Logo>
        <a href="/">
          <img src="/assets/mainlogo.png" alt="누리울림 로고" />
        </a>
      </Logo>
      <Wrapper>
        <Title>SIGN-UP</Title>

        <FieldGroup>
          <Label>이름</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FieldGroup>

        <FieldGroup>
          <Label>이메일</Label>
          <InlineRow>
            <InlineInput
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsVerified(false);
              }}
            />
            <SmallButton
              onClick={handleSendVerification}
              disabled={!email || sendLoading}
            >
              {sendLoading ? "전송 중..." : "인증코드 전송"}
            </SmallButton>
          </InlineRow>
        </FieldGroup>

        <FieldGroup>
          <Label>이메일 인증 코드 입력</Label>
          <InlineRow>
            <InlineInput
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setIsVerified(false);
              }}
              disabled={isVerified}
            />
            <SmallButton
              onClick={handleVerifyCode}
              disabled={!code || verifyLoading || isVerified}
            >
              {verifyLoading ? "확인 중..." : "확인"}
            </SmallButton>
          </InlineRow>
          {isVerified && <HintText $color="#2e7d60">인증되었습니다.</HintText>}
        </FieldGroup>

        <FieldGroup>
          <Label>비밀번호</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password && !passwordValid && (
            <HintText>대소문자 8자 이상 필요합니다.</HintText>
          )}
        </FieldGroup>

        <FieldGroup>
          <Label>비밀번호 재확인</Label>
          <Input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
          {passwordMismatch && (
            <HintText>비밀번호가 일치하지 않습니다.</HintText>
          )}
        </FieldGroup>

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        <BtnWrapper>
          <SubmitButton onClick={handleSignup} disabled={!canSubmit}>
            회원가입
          </SubmitButton>
        </BtnWrapper>
      </Wrapper>
    </Body>
  );
};

export default Signup;
