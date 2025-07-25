import styled from "styled-components";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  height: 480px;
  border: 2px solid #033148;
  padding: 40px 25px;
  background: radial-gradient(circle at top left, #fff2ce 17%, #daf0f6 70%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  margin: -25px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Pretendard";
  letter-spacing: -1px;
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

const RowWrapper = styled.div`
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
  height: 100%;
  letter-spacing: -1px;
  font-size: 14px;
  p {
    margin: 0;
    font-size: 15px;
    color: #031148;
  }
  gap: 10px;
`;

const Subtitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #033148;
`;

const TermBox = styled.div`
  width: 370px;
  height: 152px;
  background-color: white;
  border: 1px solid;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const TermBoxText = styled.p`
  margin-bottom: 50px;
  font-size: 14px;
  font-weight: 300;
  color: black;
  letter-spacing: -1.5px;
`;

const Checkbox = styled.div`
  display: flex;
  gap: 4px;
  font-size: 12px;
  white-space: nowrap;
  input {
    width: 14px;
    height: 14px;
    accent-color: #275e81;
    cursor: pointer;
    margin: 0;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  justify-content: space-between;
  align-items: center;
`;

const ErrorMessage = styled.div`
  color: rgb(195, 25, 13);
  font-weight: 500;
  transition: opacity 0.3s ease;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};
`;

const SignupTerms = () => {
  const [checked, setChecked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  const handleCheck = () => {
    setChecked(!checked);
  };

  const handleAgree = () => {
    if (checked) {
      setHasError(false);
      navigate("/signup");
    } else {
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
        <Title>SIGN-UP</Title>
        <Form>
          <Subtitle>이용약관</Subtitle>
          <TermBox>
            <TermBoxText>[개인정보의 수집 및 이용에 대한 동의]</TermBoxText>
            <TermBoxText>
              가. 수집 및 이용 목적
              <br /> 본 페이지에서 회원가입 시에 필요한 사항에 대하여 필요한
              최소한의 범위 내에서 개인정보를 수집하고 있습니다.
            </TermBoxText>
            <TermBoxText>
              나. 수집 및 이용 항목
              <br />
              1) 필수항목: 성명, 생년월일, 연락처, 전자우편
            </TermBoxText>
          </TermBox>
          <p>
            누리울림이 위와 같이 개인정보 필수 항목을 수집 및 이용하는 것에
            동의합니다.
          </p>
          <CheckboxContainer>
            <ErrorMessage visible={hasError}>
              약관에 동의해야 다음으로 진행할 수 있습니다.
            </ErrorMessage>
            <Checkbox>
              <input
                type="checkbox"
                id="agree"
                checked={checked}
                onChange={handleCheck}
              />
              동의합니다.
            </Checkbox>
          </CheckboxContainer>
          <RowWrapper>
            <button onClick={handleAgree}>다음</button>
          </RowWrapper>
        </Form>
      </Wrapper>
    </Body>
  );
};

export default SignupTerms;
