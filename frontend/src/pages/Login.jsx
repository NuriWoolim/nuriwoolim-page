import styled from "styled-components";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { getMyPage, login } from "../apis/user";

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
  gap:20px;
`;

const Title = styled.h2`
  font-family: "SUITE";
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 20px;
  color: #0f2230;
`;

const TextWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 80%;
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
    height: 30px;
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

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  div {
    font-size: 14px;
    color: grey;
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

const SignupLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline; /* 필요하다면 hover 시만 밑줄 */
  }
`;

const Login = () => {
  const [username, onChangeUsername] = useForm();
  const [password, onChangePassword] = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    getMyPage(accessToken)
      .then(() => {
        navigate("/mypage");
      })
      .catch(() => {
        localStorage.clear();
      });
  }, [navigate]);

  const onClick = async () => {
    try {
      const result = await login(username, password);
      localStorage.setItem("access", result.accessToken);
      localStorage.setItem("refresh", result.refreshToken);
      navigate("/mypage");
    } catch (error) {
      alert("id나 pw를 확인하세요.");
    }
  };

  return (
    <>
      <Logo>
        <a href="#Home">
          <img src="/assets/mainlogo.png" alt="누리울림 로고" />
        </a>
      </Logo>
      <Wrapper>
        <Title>로그인</Title>
        <Form>
          <Inputs>
            <div>아이디</div>
            <input value={username} onChange={onChangeUsername}></input>
            <div>비밀번호</div>
            <input
              type="password"
              value={password}
              onChange={onChangePassword}
            ></input>
          </Inputs>
          <TextWrap>
            <div>비밀번호 찾기</div>
            <div>ㅣ</div>
            <div>아이디 찾기</div>
            <div>ㅣ</div>
            <SignupLink to="/signup">회원가입</SignupLink>
          </TextWrap>
        </Form>
        <BtnWrapper>
          <button onClick={onClick}>로그인</button>
        </BtnWrapper>
      </Wrapper>
    </>
  );
};

export default Login;
