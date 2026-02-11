import React, { useState } from "react";
import styled from "styled-components";
import { archiveData } from "../data/ArchiveData";

const ArchiveSection = styled.section`
  background-color: #fefaef;
`;

const ArchiveWrapper = styled.div`
  width: 100%;
  position: relative;
  border-top: 4px solid #033148;
  border-bottom: 4px solid #033148;

  h2 {
    font-family: Plus Jakarta Sans;
    font-weight: 800;
    color: #fefaef;
    font-size: 40px;
    line-height: 127%;
    letter-spacing: -6%;
    text-transform: uppercase;
  }
`;

const OverlayText = styled.div`
  position: absolute;
  margin-top: 15px;
  margin-left: 50px;
  letter-spacing: -2px;

  display: flex;
  flex-direction: column;
  gap: 0px;

  h2 {
    margin: 0;
    font-family: Pretendard;
    font-weight: 700;
    font-size: 40px;
    text-shadow: -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black,
      2px 2px 0 black;
  }

  p {
    margin-bottom: 10px;
    font-family: Pretendard;
    font-weight: 700;
    font-size: 40px;
    color: #fefaef;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
`;

const Arrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => (props.right ? "right: 30px" : "left: 30px")};

  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  img {
    width: 60px;
    height: auto;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const Archive = () => {
  const [index, setIndex] = useState(0);
  const total = archiveData.length;

  const prev = () => setIndex((index - 1 + total) % total);
  const next = () => setIndex((index + 1) % total);

  return (
    <ArchiveSection>
      <ArchiveWrapper>
        <ImageContainer>
          <OverlayText>
            <p>ARCHIVE</p>
            <h2>{archiveData[index].date}</h2>
            <h2>{archiveData[index].title}</h2>
          </OverlayText>
          <Image src={archiveData[index].image} />
          <Arrow onClick={prev}>
            <img src="/assets/leftarrow.png" alt="왼쪽화살표" />
          </Arrow>
          <Arrow right onClick={next}>
            <img src="/assets/rightarrow.png" alt="오른쪽화살표" />
          </Arrow>
        </ImageContainer>
      </ArchiveWrapper>
    </ArchiveSection>
  );
};

export default Archive;
