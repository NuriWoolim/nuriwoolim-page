import React from "react";
import styled from "styled-components";

const SSibalContainer = styled.div`
  background: linear-gradient(
    to left,
    rgb(33, 129, 173, 0.53) 0%,
    rgba(109, 148, 115, 0.53) 50%,
    rgba(255, 184, 4, 0.53) 70%
  );

  width: 100%;
  height: 100%;
  padding: 84px;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;

  font-family: "Pretendard", sans-serif;
  font-weight: 200;
  font-size: 16px;
  h2 {
    font-weight: 600;
    margin-bottom: 5px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 40px 24px;
    gap: 32px;
  }
`;

const FooterContainer = styled.footer`
  background: #c3b794;
  width: 100%;

  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 173px;
    height: 76px;
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    img {
      width: 130px;
      height: auto;
    }
  }
`;

const LeftPart = styled.div`
  height: 100%;
  width: 500px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  p {
    margin: 0;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Portal = styled.div`
  margin-top: 40px;
  width: 82px;
  height: 82px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 13px 18px rgba(17, 19, 35, 0.08);

  display: flex;
  justify-content: center;
  align-items: center;

  .yt {
    position: relative;
    top: 2px;
    width: 50px;
  }

  .inst {
    position: relative;
    top: 2px;
    width: 35px;
  }
  .linktree {
    width: 27px;
  }

  @media (max-width: 768px) {
    margin-top: 20px;
    width: 60px;
    height: 60px;

    .yt { width: 36px; }
    .inst { width: 26px; }
    .linktree { width: 20px; }
  }
`;

const PortalContainer = styled.div`
  width: calc(100% - 200px);
  display: flex;
  justify-content: space-between;
  padding-right: 200px;

  @media (max-width: 768px) {
    width: 100%;
    padding-right: 0;
    gap: 16px;
    justify-content: flex-start;
  }
`;

const RightPart = styled.div`
  color: var(--primary-white);
  display: flex;
  flex-direction: column;
  h2 {
    font-weight: 800;
  }
  p {
    font-weight: 400;
  }

  @media (max-width: 768px) {
    h2 { font-size: 18px; }
    p { font-size: 14px; }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <SSibalContainer>
        <LeftPart>
          <Logo>
            <img src="/assets/logo_crop.png" />
          </Logo>
          <h2>누리울림 공식 홈페이지입니다.</h2>
          <p>&copy;2025 Nuriwoolimhompageteam. All rights reserved</p>

          <PortalContainer>
            <Portal>
              <a href="https://www.youtube.com/@%EC%A4%91%EC%95%99%EB%8C%80%ED%95%99%EA%B5%90%EC%A4%91%EC%95%99%EB%8F%99%EC%95%84%EB%A6%AC">
                <img className="yt" src="/assets/youtube_logo.png" />
              </a>
            </Portal>

            <Portal>
              <a href="https://www.instagram.com/cau_nuriwoolim">
                <img className="inst" src="/assets/instagram_logo.png" />
              </a>
            </Portal>

            <Portal>
              <a>
                <img className="linktree" src="/assets/linktree_logo.svg" />
              </a>
            </Portal>
          </PortalContainer>
        </LeftPart>

        <RightPart>
          <h2>About</h2>
          <p>서울시 동작구 흑석로 84 107관 609호 누리울림</p>
          <p>TEL. 회장 현진우</p>
          <p>TEL. 부회장 윤성빈</p>
          <p>EMAIL. caunuriwoolim@gmail.com</p>
        </RightPart>
      </SSibalContainer>
    </FooterContainer>
  );
};

export default Footer;
