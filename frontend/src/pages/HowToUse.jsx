import React from "react";
import styled from "styled-components";

const HowToUseContainer = styled.div`
  background-color: #fefaef;
  padding: 0px 73px 100px 73px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const IconWrapper = styled.div`
  position: absolute;
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* 왼쪽 아이콘 */
  &.icon-left {
    width: 40%;
    height: 40%;
    bottom: -50px;
    left: 55%;
  }

  /* 가운데 아이콘 */
  &.icon-center {
    width: 60%;
    height: 60%;
    bottom: 150px;
    left: 15%;
    transform: translateX(-50%);
  }

  /* 오른쪽 아이콘 */
  &.icon-right {
    width: 40%;
    height: 40%;
    bottom: 650px;
    right: -5%;
  }
`;

const Title = styled.h2`
  font-family: Pretendard;
  font-weight: 800;
  font-size: 56px;
  line-height: 219%;
  letter-spacing: -0.05em;
  text-align: center;
  text-transform: uppercase;
  color: #033148;
  margin-top: 40px;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 30px;
  position: relative;
  z-index: 1;
`;

const ImageCard = styled.div`
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BottomGridContainer = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
`;

const MockupCard = styled.div`
  background-color: #d9d9d9;
  aspect-ratio: 16 / 13;
  width: calc((1200px - 40px) / 3);
  flex-shrink: 0;
`;

const HowToUse = () => {
  const usageItems = [
    {
      id: 1,
      image: "/assets/howtouse/micandmixer.png",
      title: "마이크&\n믹서\n사용법",
    },
    {
      id: 2,
      image: "/assets/howtouse/bassamp.png",
      title: "베이스\n앰프\n사용법",
    },
    {
      id: 3,
      image: "/assets/howtouse/drum.png",
      title: "드럼\n사용법",
    },
  ];

  return (
    <HowToUseContainer>
      <IconWrapper className="icon-left">
        <img src="/assets/howtouse/guitaricon.png" alt="guitar icon" />
      </IconWrapper>
      <IconWrapper className="icon-center">
        <img src="/assets/howtouse/saxophoneicon.png" alt="saxophone icon" />
      </IconWrapper>
      <IconWrapper className="icon-right">
        <img src="/assets/howtouse/drumicon.png" alt="drum icon" />
      </IconWrapper>
      <Title>HOW TO USE</Title>

      <GridContainer>
        {usageItems.map((item) => (
          <ImageCard key={item.id}>
            <img src={item.image} alt={item.title} />
          </ImageCard>
        ))}
      </GridContainer>

      <BottomGridContainer>
        <MockupCard />
        <MockupCard />
      </BottomGridContainer>
    </HowToUseContainer>
  );
};

export default HowToUse;
