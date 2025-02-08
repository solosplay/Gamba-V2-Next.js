import React, { useMemo } from "react";
// src/games/DevilsLock/Slot.tsx
import { SLOT_ITEMS, SlotItem } from "./utils";
import styled, { css, keyframes } from "styled-components";

interface SlotProps {
  revealed: boolean;
  good: boolean;
  index: number;
  isCentered: boolean;
  item?: SlotItem;
}

const reveal = keyframes`
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    translateY: 0%;
    opacity: 1;
  }
`;

const StyledSlot = styled.div<{ $good: boolean; $isCentered: boolean }>`
  width: 100px;
  aspect-ratio: 1/1;
  position: relative;
  background: #4444ff11;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #2d2d57;
  transition:
    background 0.2s,
    border 0.2s,
    box-shadow 0.2s,
    transform 0.2s;

  ${(props) =>
    props.$good &&
    css`
      animation: reveal-glow 1s;
    `}

  /* Center Slot Specific Styles */
  ${(props) =>
    props.$isCentered &&
    css`
      z-index: 1;
      transform: scale(1.1);
      border: 5px solid #81e1ff;
      background: #000;
    `}
`;

const Revealed = styled.div<{ $revealed: boolean; $good: boolean }>`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 10px;
  transition:
    opacity 0.2s,
    transform 0.3s ease;
  transform: translateY(-100%);
  opacity: 0;

  ${(props) =>
    props.$revealed &&
    css`
      opacity: 1;
      transform: translateY(0%);
      animation: ${reveal} cubic-bezier(0.18, 0.89, 0.32, 1.28) 0.25s;
    `}

  ${(props) =>
    props.$good &&
    css`
      & > img {
        animation: ${reveal} 2s 0.25s cubic-bezier(0.04, 1.14, 0.48, 1.63)
          infinite;
      }
    `}
`;

const StyledSpinner = styled.div`
  @keyframes spinning {
    0% {
      top: 0;
    }
    100% {
      top: calc(var(--num-items) * -100%);
    }
  }

  --num-items: 5;
  --spin-speed: 0.6s;

  position: absolute;
  width: 100%;
  height: 100%;
  transition: opacity 0.1s 0.1s ease;
  animation: spinning var(--spin-speed) 0.1s linear infinite;
  opacity: 0;

  &[data-spinning="true"] {
    opacity: 1;
  }

  & > div {
    color: white;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 15px;
  }
`;

export function Slot({ revealed, good, item, index, isCentered }: SlotProps) {
  const items = useMemo(
    () => [...SLOT_ITEMS].sort(() => Math.random() - 0.5),
    [],
  );

  return (
    <StyledSlot $good={good} $isCentered={isCentered}>
      <StyledSpinner data-spinning={!revealed}>
        {items.map((item, i) => (
          <div key={i}>
            <img className="slotImage" src={item.image} />
          </div>
        ))}
      </StyledSpinner>
      {item && (
        <Revealed
          className="revealedSlot"
          $revealed={revealed}
          $good={revealed && good}
        >
          <img
            className="slotImage"
            src={item.image}
            style={{ animationDelay: index * 0.25 + "s" }}
          />
        </Revealed>
      )}
    </StyledSlot>
  );
}
