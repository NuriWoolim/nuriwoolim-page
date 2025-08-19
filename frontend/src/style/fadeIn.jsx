import { keyframes } from "styled-components";

export const fadeIn = keyframes`
  0% {
    opacity: 0;
    filter: blur(5px);
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    filter: blur(0);
    transform: scale(1);
  }
`;
