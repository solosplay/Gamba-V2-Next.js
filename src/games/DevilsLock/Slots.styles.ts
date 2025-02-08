// src/games/DevilsLock/Slots.styles.ts
import styled from "styled-components";

export const ScreenWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 40px;
  background: url("/games/devilslock/background.png") no-repeat center;
`;

export const StyledSlots = styled.div`
  user-select: none;

  @keyframes pulse {
    0%,
    30% {
      transform: scale(1);
    }
    10% {
      transform: scale(1.3);
    }
  }

  @keyframes reveal-glow {
    0%,
    30% {
      border-color: #2d2d57;
      background: #ffffff00;
    }
    10% {
      border-color: white;
      background: #ffffff33;
    }
  }

  @keyframes shine {
    0%,
    30% {
      background: #ffffff00;
    }
    10% {
      background: #ffffff33;
    }
  }

  @keyframes result-flash {
    25%,
    75% {
      background-color: #ffec63;
      color: #333;
    }
    50% {
      background-color: #ffec6311;
      color: #ffec63;
    }
  }

  .result {
    border: none;
    padding: 10px;
    text-transform: uppercase;
    position: relative;
    width: 100%;
    border-radius: 10px;
    border-spacing: 10px;
    border: 1px solid #ffec63;
    background-color: #ffec6311;
    color: #ffec63;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }

  .result[data-good="true"] {
    animation: result-flash 5s infinite;
  }

  @keyframes reveal {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0%);
      opacity: 1;
    }
  }
`;

// Adjusted layout with floating images
export const BonusesLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: absolute;
  left: 60px;
  top: 60px;
  gap: 0px;
`;

export const BonusItemContainer = styled.div<{ scale: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #0033cc;
  border-radius: 12px;
  padding: ${(props) => `${props.scale * 10}px ${props.scale * 5}px`};
  margin-bottom: ${(props) => props.scale * 25}px;
  box-shadow: 0px ${(props) => props.scale * 4}px
    ${(props) => props.scale * 8}px rgba(0, 0, 0, 0.4);
  transform: scale(${(props) => props.scale});
  overflow: visible;
`;

export const BonusImage = styled.img<{ scale: number }>`
  position: absolute;
  top: -${(props) => props.scale * 20}px;
  left: -${(props) => props.scale * 10}px;
  width: ${(props) => props.scale * 60}px;
  height: auto;
  transform: rotate(-30deg);
`;

export const BonusAmount = styled.span<{ scale: number }>`
  color: #fff;
  font-weight: bold;
  font-size: ${(props) =>
    `${props.scale * 16}px`}; /* Adjust font size based on scale */
  margin-left: ${(props) =>
    props.scale * 70}px; /* Adjust margin to avoid image overlap */
`;

export const PigsTop = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  width: 100%;
  top: -20px;
  padding: 0 60px;
  gap: 25px;
`;

export const PigImage = styled.img`
  width: 80px;
  height: auto;
`;

export const LogoCenter = styled.div`
  width: 200px;
`;

export const SlotsGrid = styled.div`
  display: grid;
  background-color: #1409af;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 0px;
  margin-top: 100px;
  border-radius: 0px;
  outline: 4px solid #81e1ff;
`;
