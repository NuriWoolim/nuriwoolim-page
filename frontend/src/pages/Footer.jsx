import React from "react";
import styled from "styled-components";

const SSibalContainer = styled.div`
  /* position: relative; */
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
`;
const FooterContainer = styled.footer`
  background: #c3b794;
  width: 100%;
  height: 440px;

  display: flex;
  flex-direction: row;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 173px;
    height: 76px;
  }
`;

const LeftPart = styled.div`
  height: 100%;
  width: 500px;

  /* border: 1px solid black; */

  display: flex;
  flex-direction: column;
  align-items: flex-start;

  p {
    margin: 0;
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
`;

const PortalContainer = styled.div`
  width: calc(100% - 200px);
  display: flex;
  justify-content: space-between;
  padding-right: 200px;
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
`;

const Footer = () => {
  return (
    <FooterContainer>
      <SSibalContainer>
        <LeftPart>
          <Logo>
            <img src="public/assets/logo_crop.png" />
          </Logo>
          <h2>누리울림 공식 홈페이지입니다.</h2>
          <p>©2025 Nuriwoolimhompageteam. All rights reserved</p>

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
          <p>TEL. 회장 정지섭</p>
          <p>TEL. 부회장 박지은</p>
          <p>EMAIL. caunuriwoolim@gmail.com</p>
        </RightPart>
      </SSibalContainer>
    </FooterContainer>
  );
};

export default Footer;
