import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { signup } from "../apis/user";
import { useForm } from "../hooks/useForm";

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  img {
    margin-top: 50px;
    width: 150px;
    height: 150px;
  }
`;

const Wrapper = styled.div`
  width: 400px;
  padding: 40px 25px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h2`
  font-family: "SUITE";
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 20px;
  color: #0f2230;
`;

const BtnWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  button {
    font-weight: 800;
    background-color: rgb(39, 94, 129);
    color: white;
    padding: 19px;
    border-radius: 10px;
    border: none;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 315px;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 3px 3px skyblue;
      color: black;
      background-color: white;
    }
  }
`;

const Inputs = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 8px;
  input {
    font-size: 20px;
    height: 20px;
    width: 290px;
    border-radius: 10px;
    border: 1px solid #888;
    padding: 10px;
    margin-bottom: 1rem;
    &::placeholder {
      color: darkgray;
      font-size: 20px;
      font-weight: 500;
      font-family: "OTWelcomeRA";
    }
  }
`;

const Signup = () => {
  const [username, onChangeUsername] = useForm("");
  const [email, onChangeEmail] = useForm("");
  const [password, onChangePassword] = useForm("");
  const [nickname, onChangeNickname] = useForm("");
  const navigate = useNavigate();

  const onClick = async () => {
    await signup(username, email, password, nickname);
    alert("회원가입이 완료되었습니다!");
    navigate("/");
  };

  return (
    <>
      <Logo>
        <a href="#Home">
          <img src="/assets/mainlogo.png" alt="누리울림 로고" />
        </a>
      </Logo>
      <Wrapper>
        <Title>회원가입</Title>
        <Inputs>
          <div>사용자명</div>
          <input value={username} onChange={onChangeUsername} />
          <div>이메일</div>
          <input value={email} onChange={onChangeEmail} />
          <div>비밀번호</div>
          <input type="password" value={password} onChange={onChangePassword} />
          <div>이름</div>
          <input value={nickname} onChange={onChangeNickname} />
        </Inputs>
        <BtnWrapper>
          <button onClick={onClick}>가입하기</button>
        </BtnWrapper>
      </Wrapper>
    </>
  );
};

export default Signup;
