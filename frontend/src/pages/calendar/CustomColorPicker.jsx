import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { lighten } from "polished";
const Circle = styled.div`
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 50%;

  /* box-sizing: content-box; */
  border: ${({ $isSelected, $color = "#000" }) =>
    $isSelected ? "2.403px solid #FFF" : `0.8px solid ${lighten(0.5, $color)}`};

  box-shadow: ${({ $isSelected, $color = "#000" }) =>
    $isSelected ? " 0 0 6px 1px rgba(0, 0, 0, 0.14)" : ""};

  background-color: ${(props) => props.$color};
  flex-shrink: 0;

  transform: ${(props) => (props.$isSelected ? `scale(1.1)` : null)};
  /* padding: 0.2rem; */
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 11.5rem;
  margin: ${(props) => props.$margin};
  /* align-items: center; */
`;
const CCPContainer = styled.div`
  width: 13.106rem;
  margin: 0.4rem 0.5rem;
`;
const CustomColorPicker = ({ colors, color, onChange }) => {
  const cols = 5;
  const rows = colors.length / cols;

  const [selected, setSelected] = useState(0);

  return (
    <>
      <CCPContainer>
        {Array.from({ length: rows }, (_, i) => (
          <Row key={i} $margin={i % 2 == 0 ? "0 1rem 0 0" : "0 0 0 1rem"}>
            {Array.from({ length: 5 }, (_, j) => (
              <button
                key={i * 5 + j}
                type="button"
                onClick={() => {
                  setSelected(i * 5 + j);
                  onChange(colors[i * 5 + j]);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "0.3rem",
                }}
              >
                <Circle
                  $isSelected={selected == i * 5 + j}
                  $color={colors[i * 5 + j]}
                />
              </button>
            ))}
          </Row>
        ))}
      </CCPContainer>
    </>
  );
};
export default CustomColorPicker;
