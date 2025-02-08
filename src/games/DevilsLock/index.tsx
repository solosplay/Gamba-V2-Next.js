import {
  BonusAmount,
  BonusImage,
  BonusItemContainer,
  BonusesLeft,
  LogoCenter,
  PigImage,
  PigsTop,
  ScreenWrapper,
  SlotsGrid,
  StyledSlots,
} from "./Slots.styles";
import {
  FINAL_DELAY,
  NUM_SLOTS,
  REVEAL_SLOT_DELAY,
  SLOT_ITEMS,
  SOUND_DEVILLAUGH1,
  SOUND_DEVILLAUGH2,
  SOUND_ENTERGAME,
  SOUND_GRANDWIN,
  SOUND_MAXIWIN,
  SOUND_MINIWIN,
  SOUND_MINORWIN,
  SOUND_PAY,
  SOUND_PLAYLOOP,
  SOUND_REEL,
  SOUND_REVEAL,
  SOUND_WIN,
  SPIN_DELAY,
  SlotItem,
  generateBetArray,
  getSlotCombination,
} from "./utils";
// src/games/DevilsLock/index.tsx
import {
  GambaUi,
  useCurrentPool,
  useSound,
  useWagerInput,
} from "gamba-react-ui-v2";
import { useEffect, useState } from "react";

import GambaPlayButton from "@/components/GambaPlayButton";
import { GameResult } from "gamba-core-v2";
import { Slot } from "./Slot";
import { toast } from "sonner";
import { useGamba } from "gamba-react-v2";

export default function Slots() {
  const gamba = useGamba();
  const game = GambaUi.useGame();
  const pool = useCurrentPool();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<GameResult>();
  const [good, setGood] = useState(false);
  const [revealedSlots, setRevealedSlots] = useState(NUM_SLOTS);
  const [wager, setWager] = useWagerInput();
  const [bet, setBet] = useState<number[]>([]);
  const [combination, setCombination] = useState(
    Array.from({ length: NUM_SLOTS }).map(() => SLOT_ITEMS[0]),
  );

  // Effect to generate the bet array and initial slot combination
  useEffect(() => {
    const initialBetArray = generateBetArray(100);
    setBet(initialBetArray);
    const initialCombination = getSlotCombination(15, 0, initialBetArray, true);
    setCombination(initialCombination);
  }, []);

  // Sounds
  const sounds = useSound({
    win: SOUND_WIN,
    devil_laugh1: SOUND_DEVILLAUGH1,
    devil_laugh2: SOUND_DEVILLAUGH2,
    enter_game: SOUND_ENTERGAME,
    grand_win: SOUND_GRANDWIN,
    maxi_win: SOUND_MAXIWIN,
    mini_win: SOUND_MINIWIN,
    minor_win: SOUND_MINORWIN,
    pay: SOUND_PAY,
    play_loop: SOUND_PLAYLOOP,
    reveal: SOUND_REVEAL,
    reel_stop: SOUND_REEL,
  });

  const isCentered = (index: number) => {
    const centerIndex = Math.floor(NUM_SLOTS / 2);
    return index === centerIndex;
  };

  const revealSlot = async (
    combination: SlotItem[],
    resultMultiplier: number,
    slot = 0,
  ) => {
    sounds.play("reel_stop");

    // Determine if all slots are the same
    const allSame = combination
      .slice(0, slot + 1)
      .every((item, index, arr) => !index || item === arr[index - 1]);

    // Play the corresponding win sound based on the resultMultiplier
    if (resultMultiplier === 20) {
      if (allSame) sounds.play("grand_win");
    } else if (resultMultiplier === 15) {
      if (allSame) sounds.play("maxi_win");
    } else if (resultMultiplier === 10) {
      if (allSame) sounds.play("minor_win");
    } else if (resultMultiplier === 5) {
      if (allSame) sounds.play("mini_win");
    } else if (resultMultiplier < 5 && resultMultiplier > 0) {
      if (allSame) sounds.play("win");
    }

    // Set the revealed slots count
    setRevealedSlots(slot + 1);

    // Play the reel stop sound again if all slots revealed
    if (slot === NUM_SLOTS - 1) {
      setTimeout(() => {
        setSpinning(false);
        if (allSame) {
          setGood(true);
        } else {
          const laughSound =
            Math.random() < 0.5 ? "devil_laugh1" : "devil_laugh2";
          sounds.play(laughSound);
        }
      }, FINAL_DELAY);
    } else {
      // Continue revealing slots recursively
      await new Promise((resolve) => setTimeout(resolve, REVEAL_SLOT_DELAY));
      await revealSlot(combination, resultMultiplier, slot + 1);
    }
  };

  const play = async () => {
    try {
      setSpinning(true);
      setResult(undefined);

      await game.play({
        wager,
        bet,
      });
      sounds.play("play_loop");

      setRevealedSlots(0);
      setGood(false);

      const startTime = Date.now();

      const result = await gamba.result();
      console.log(result);
      sounds.sounds.play_loop.player.stop();

      // Make sure we wait a minimum time of SPIN_DELAY before slots are revealed:
      const resultDelay = Date.now() - startTime;
      const revealDelay = Math.max(0, SPIN_DELAY - resultDelay);

      // Determine if it's a win or not
      const win = result.payout > 0;

      // Get the slot combination based on the result multiplier and win status
      const combination = getSlotCombination(
        NUM_SLOTS,
        result.multiplier,
        bet,
        win,
      );

      setCombination(combination);

      setResult(result);

      // Reveal slots with the determined combination
      setTimeout(() => revealSlot(combination, result.multiplier), revealDelay);
    } catch (err: any) {
      setSpinning(false);
      setRevealedSlots(NUM_SLOTS);
      toast.error(`An error occurred: ${err.message}`);
    }
  };

  return (
    <>
      <GambaUi.Portal target="screen">
        <ScreenWrapper>
          <StyledSlots>
            <BonusesLeft>
              <BonusItemContainer scale={1.2}>
                <BonusImage src="/games/devilslock/grand.png" scale={1.4} />
                <BonusAmount scale={1.2}>
                  {(wager * 20) / 10 ** 9} SOL
                </BonusAmount>
              </BonusItemContainer>
              <BonusItemContainer scale={1.1}>
                <BonusImage src="/games/devilslock/maxi.png" scale={1.3} />
                <BonusAmount scale={1.1}>
                  {(wager * 15) / 10 ** 9} SOL
                </BonusAmount>
              </BonusItemContainer>
              <BonusItemContainer scale={1}>
                <BonusImage src="/games/devilslock/minor.png" scale={1.2} />
                <BonusAmount scale={1}>
                  {(wager * 10) / 10 ** 9} SOL
                </BonusAmount>
              </BonusItemContainer>
              <BonusItemContainer scale={0.9}>
                <BonusImage src="/games/devilslock/mini.png" scale={1.1} />
                <BonusAmount scale={0.9}>
                  {(wager * 5) / 10 ** 9} SOL
                </BonusAmount>
              </BonusItemContainer>
            </BonusesLeft>
            <PigsTop>
              <PigImage src="/games/devilslock/leftpig.png" alt="Left Pig" />
              <LogoCenter>
                <img src="/games/devilslock/logo.png" alt="Logo" />
              </LogoCenter>
              <PigImage src="/games/devilslock/rightpig.png" alt="Right Pig" />
            </PigsTop>

            <SlotsGrid>
              {combination.map((slot, i) => (
                <Slot
                  key={i}
                  index={i}
                  revealed={revealedSlots > i}
                  item={slot}
                  good={good}
                  isCentered={isCentered(i)}
                />
              ))}
            </SlotsGrid>
          </StyledSlots>
        </ScreenWrapper>
      </GambaUi.Portal>
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaPlayButton
          disabled={!wager || spinning}
          onClick={play}
          text="Spin"
        />
      </GambaUi.Portal>
    </>
  );
}
