import styled from "styled-components";

export const ScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-image: url("/games/frog/background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 20px;
  gap: 20px;
`;

export const MultiplayerSection = styled.div`
  width: 90%;
  max-width: 50%;
  min-height: 60px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 10px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const MultiplierDisplay = styled.div`
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  color: white;
`;

export const GameSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const FrogImage = styled.img`
  max-width: 200px;
  height: auto;
  margin-top: 20px;
`;

export const TimeText = styled.div`
  font-size: 3rem;
  color: ${(props) => props.color || "#fff"};
  text-shadow: 0 0 20px #fff;
  font-family: monospace;
  text-align: center;
`;

export const ControlsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 90%;
  max-width: 50%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 10px;
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
    grid-template-columns: 1fr;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  font-family: monospace;

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

export const Label = styled.label`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;
