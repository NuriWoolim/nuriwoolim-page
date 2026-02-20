import styled from "styled-components";

const Button = styled.button`
  flex-shrink: 0;

  border: 1px solid #033148;
  background: hsla(46.29, 79.55%, 82.75%, 0.54);

  &:hover {
    cursor: pointer;
    background: hsla(46.29, 79.55%, 90%, 0.54);
  }

  &:active {
    background: hsla(46.29, 79.55%, 77.75%, 0.54);
  }

  &.selected {
    border: 1px solid #033148;
    background: hsl(214, 29.41176470588236%, 40%);
    h3 {
      color: #fff;
    }
  }
  &.selected:hover {
    background: hsl(214, 29.41176470588236%, 45%);
  }
  &.selected:active {
    background: hsl(214, 29.41176470588236%, 35%);
  }
`;

export default Button;
