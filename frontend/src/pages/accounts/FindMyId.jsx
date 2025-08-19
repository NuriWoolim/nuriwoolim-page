import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signup } from "../../apis/user";
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
  input {
    font-size: 20px;
    height: 12px;
    width: 324px;
    border: 1px solid #888;
    padding: 10px;

    &::placeholder {
      color: #033148;
      font-size: 20px;
      font-weight: 500;
      font-family: "Pretendard";
    }
  }
`;

const FindMyId = () => {
  const [username, onChangeUsername] = useForm("");
  const [email, onChangeEmail] = useForm("");
  const [password, onChangePassword] = useForm("");
  const [nickname, onChangeNickname] = useForm("");
  const [passwordConfirm, onChangePasswordConfirm] = useForm("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onClick = async () => {
    if (password !== passwordConfirm) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await signup(username, email, password, nickname);
      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
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
            <div>사용자명(아이디)</div>
            <input value={username} onChange={onChangeUsername}></input>
            <div>이메일</div>
            <input value={email} onChange={onChangeEmail}></input>
            <div>닉네임</div>
            <input value={nickname} onChange={onChangeNickname}></input>
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
              onClick={onClick}
              disabled={!username || !password || password !== passwordConfirm}
            >
              Join
            </button>
          </BtnWrapper>
        </Form>
      </Wrapper>
    </Body>
  );
};

export default FindMyId;
