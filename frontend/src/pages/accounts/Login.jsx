import styled from "styled-components";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { login } from "../../apis/user";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

const TextWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const RowWrapper = styled.div`
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: space-between;
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
    transition: transform 0.2s ease;

    &:hover {
      box-shadow: 0 0 3px 3px skyblue;
      color: black;
      background-color: white;
      transform: scale(1.1);
    }
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  letter-spacing: -1px;
  font-size: 14px;
  p {
    margin: 0;
    font-size: 15px;
    color: #031148;
  }
`;

const Inputs = styled.div`
  display: flex;
  align-items: start;
  flex-direction: column;
  gap: 8px;
  input {
    font-size: 14px;
    height: 12px;
    width: 324px;
    border: 1px solid #888;
    padding: 10px;

    &::placeholder {
      color: #8888;
      font-size: 13px;
      font-weight: 300;
      font-family: "Pretendard";
    }
  }
`;

const PasswordInput = styled.div`
  position: relative;
`;

const ShowPwBtn = styled.button`
  position: absolute;
  top: 57%;
  transform: translateY(-50%);
  right: 10px;
  background: transparent;
  border: none;
  color: #033148;
  font-size: 19px;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: rgb(195, 25, 13);
  font-weight: 500;
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
`;

const SignupLink = styled(Link)`
  text-decoration: none;
  color: #413100;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const [username, onChangeUsername] = useForm();
  const [password, onChangePassword] = useForm();
  const [showPassword, setShowPassoword] = useState(false);
  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();

  const onClick = async () => {
    try {
      const result = await login(username, password);
      // 아래 코드가 토큰을 undefined로 만들어버려서 일단 지움
    //   localStorage.setItem("accessToken", result.accessToken);
      navigate("/");
    } catch (error) {
      setHasError(true);
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
        <Title>LOG-IN</Title>
        <Form>
          <Inputs>
            <p>사용자명(아이디)</p>
            <input
              value={username}
              placeholder="아이디를 입력해주세요."
              onChange={onChangeUsername}
            ></input>
            <p>비밀번호</p>

            <PasswordInput>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={onChangePassword}
              />
              <ShowPwBtn
                type="button"
                class="fa fa-eye fa-lg"
                onClick={() => setShowPassoword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </ShowPwBtn>
            </PasswordInput>
          </Inputs>
          <RowWrapper>
            <ErrorMessage visible={hasError}>
              아이디 또는 비밀번호가 잘못되었습니다.
              <br />
              아이디와 비밀번호를 다시 확인해주세요.
            </ErrorMessage>
            <button onClick={onClick}>로그인</button>
          </RowWrapper>
          <TextWrap>
            <SignupLink to="/findMyPw">비밀번호 찾기</SignupLink>
            <SignupLink to="/findMyId">아이디 찾기</SignupLink>
            <SignupLink to="/signup-terms">회원가입</SignupLink>
          </TextWrap>
        </Form>
      </Wrapper>
    </Body>
  );
};

export default Login;
