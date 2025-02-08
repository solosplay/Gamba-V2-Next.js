import {
  ControlsSection,
  FrogImage,
  GameSection,
  Input,
  InputWrapper,
  Label,
  MultiplayerSection,
  MultiplierDisplay,
  ScreenWrapper,
  TimeText,
} from "./styles";
import {
  GambaUi,
  TokenValue,
  useCurrentPool,
  useCurrentToken,
  useSound,
  useWagerInput,
} from "gamba-react-ui-v2";
import { useRef, useState } from "react";

import GambaPlayButton from "@/components/GambaPlayButton";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useGamba } from "gamba-react-v2";

const FrogGame = () => {
  const [wager, setWager] = useWagerInput();
  const [multiplierTarget, setMultiplierTarget] = useState(2);
  const [currentMultiplier, setCurrentMultiplier] = useState(0);
  const [gameState, setGameState] = useState<
    "idle" | "playing" | "win" | "loss"
  >("idle");
  const gamba = useGamba();
  const pool = useCurrentPool();
  const selectedToken = useCurrentToken();
  const game = GambaUi.useGame();
  const sound = useSound({
    play: "/games/frog/play.mp3",
    win: "/games/frog/win.mp3",
    loss: "/games/frog/loss.mp3",
    tick: "/games/crash/tick.mp3",
  });
  const frogImageRef = useRef<HTMLImageElement>(null);

  const calculateBetArray = (multiplier: number) => {
    const targetMultiplier = Math.ceil(multiplier);
    return new Array(targetMultiplier)
      .fill(0)
      .map((_, index) => (index === 0 ? multiplier : 0));
  };

  const calculateBiasedLowMultiplier = (targetMultiplier: number) => {
    const randomValue = Math.random();
    const maxPossibleMultiplier = Math.min(targetMultiplier, 12);
    const exponent = randomValue > 0.95 ? 2.8 : targetMultiplier > 10 ? 5 : 6;
    let result =
      1 + Math.pow(randomValue, exponent) * (maxPossibleMultiplier - 1);
    const minThreshold = targetMultiplier * 0.02;
    const randomMultiplier =
      minThreshold + Math.random() * (targetMultiplier * 0.03);
    result = Math.max(result, randomMultiplier);
    return parseFloat(result.toFixed(2));
  };

  const triggerConfetti = () => {
    if (frogImageRef.current) {
      const rect = frogImageRef.current.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 / window.innerWidth;
      const y = (rect.top + rect.bottom) / 2 / window.innerHeight;

      const scalar = 2;
      const frogEmoji = confetti.shapeFromText({ text: "🐸", scalar });

      const defaults = {
        spread: 45,
        startVelocity: 30,
        decay: 0.95,
        gravity: 1,
        drift: 0,
        ticks: 200,
        shapes: [frogEmoji],
        scalar,
        origin: { x, y },
      };

      const shoot = () => {
        confetti({
          ...defaults,
          particleCount: 2,
          angle: 60,
        });

        confetti({
          ...defaults,
          particleCount: 2,
          angle: 120,
        });
      };

      // Start the continuous confetti
      const intervalId = setInterval(shoot, 50);

      // Stop after 3 seconds
      setTimeout(() => {
        clearInterval(intervalId);
      }, 3000);
    }
  };

  const doTheIntervalThing = (
    currentMultiplier: number,
    targetMultiplier: number,
    win: boolean,
  ) => {
    const nextIncrement = 0.01 * (Math.floor(currentMultiplier) + 1);
    const nextValue = currentMultiplier + nextIncrement;

    setCurrentMultiplier(nextValue);

    if (nextValue >= targetMultiplier) {
      sound.play(win ? "win" : "loss");
      setGameState(win ? "win" : "loss");
      setCurrentMultiplier(targetMultiplier);
      if (win) {
        triggerConfetti();
      }
      return;
    }

    setTimeout(() => doTheIntervalThing(nextValue, targetMultiplier, win), 50);
  };

  const play = async () => {
    try {
      setGameState("playing");
      setCurrentMultiplier(0);

      const bet = calculateBetArray(multiplierTarget);
      await game.play({ wager, bet });

      const result = await game.result();
      const win = result.payout > 0;

      const multiplierResult = win
        ? multiplierTarget
        : calculateBiasedLowMultiplier(multiplierTarget);

      sound.play("play");

      doTheIntervalThing(0, multiplierResult, win);
    } catch (err: any) {
      toast.error(`An error occurred: ${err.message}`);
      setGameState("idle");
    }
  };

  const getImageSource = () => {
    switch (gameState) {
      case "playing":
        return "/games/frog/play.gif";
      case "win":
      case "loss":
        return "/games/frog/idle.png";
      default:
        return "/games/frog/idle.png";
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <ScreenWrapper>
          <MultiplayerSection>
            <MultiplierDisplay>
              <div className="flex gap-4 justify-between items-center mx-auto">
                <div className="flex flex-col justify-between items-center mx-auto">
                  <div style={{ fontSize: "1.5vh", fontWeight: "bold" }}>
                    {`${(multiplierTarget > 1
                      ? 1 / multiplierTarget
                      : 0
                    ).toFixed(3)}%`}
                  </div>
                  <div style={{ fontSize: "1.5vh" }}>Win Chance</div>
                </div>
                <div className="flex flex-col justify-between items-center mx-auto">
                  <div style={{ fontSize: "1.5vh", fontWeight: "bold" }}>
                    {multiplierTarget}x
                  </div>
                  <div style={{ fontSize: "1.5vh" }}>Multiplier</div>
                </div>
                <div className="flex flex-col justify-between items-center mx-auto">
                  <div style={{ fontSize: "1.5vh", fontWeight: "bold" }}>
                    <TokenValue
                      mint={pool.token}
                      suffix={selectedToken?.symbol}
                      amount={wager * multiplierTarget}
                    />
                  </div>
                  <div style={{ fontSize: "1.5vh" }}>Payout</div>
                </div>
              </div>
            </MultiplierDisplay>
          </MultiplayerSection>

          <GameSection>
            <div style={{ textAlign: "center" }}>
              <TimeText
                color={
                  gameState === "win"
                    ? "#00ff00"
                    : gameState === "loss"
                      ? "#ff0000"
                      : "#ffffff"
                }
              >
                {currentMultiplier.toFixed(2)}s
              </TimeText>
              <FrogImage ref={frogImageRef} src={getImageSource()} alt="Frog" />
            </div>
          </GameSection>

          <ControlsSection>
            <InputWrapper>
              <Label>Target Time (seconds)</Label>
              <Input
                type="number"
                step="0.05"
                min="1"
                max="60"
                value={multiplierTarget}
                onChange={(e) => {
                  setMultiplierTarget(Number(e.target.value));
                  sound.play("tick");
                }}
                disabled={gameState === "playing"}
              />
            </InputWrapper>
            <InputWrapper>
              <Label>Win Chance</Label>
              <Input
                type="text"
                value={((1 / multiplierTarget) * 100).toFixed(8) + "%"}
                readOnly
              />
            </InputWrapper>
          </ControlsSection>
        </ScreenWrapper>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaPlayButton
          disabled={!wager || gameState === "playing"}
          onClick={play}
          text="Play"
        />
      </GambaUi.Portal>
    </>
  );
};

export default FrogGame;
