// src/games/DevilsLock/utils.ts

// SOUNDS
export const SOUND_DEVILLAUGH1 = "/games/devilslock/sounds/DevilLaugh1.mp3"; // loss
export const SOUND_DEVILLAUGH2 = "/games/devilslock/sounds/DevilLaugh2.mp3"; // loss
export const SOUND_ENTERGAME = "/games/devilslock/sounds/EnterGame.mp3"; // play on screen load randomCombination
export const SOUND_GRANDWIN = "/games/devilslock/sounds/GrandWin.mp3"; // grand win
export const SOUND_MINIWIN = "/games/devilslock/sounds/MiniWin.mp3"; // mini win
export const SOUND_MINORWIN = "/games/devilslock/sounds/MinorWin.mp3"; // minor win
export const SOUND_MAXIWIN = "/games/devilslock/sounds/MaxiWin.mp3"; // maxi win
export const SOUND_PLAYLOOP = "/games/devilslock/sounds/PlayLoop.mp3"; // play spinning loop
export const SOUND_REVEAL = "/games/devilslock/sounds/RevealSquare.mp3"; // reveal win square
export const SOUND_REEL = "/games/devilslock/sounds/ReelStops.mp3"; // each reel stops tick
export const SOUND_WIN = "/games/devilslock/sounds/Win.mp3"; // win sound
export const SOUND_PAY = "/games/devilslock/sounds/Pay.mp3"; // paying sound after win sound

// NUMBER OF SLOTS
export const NUM_SLOTS = 15;
// MS that it takes for spin to finish and reveal to start
export const SPIN_DELAY = 1000;
// MS between each slot reveal
export const REVEAL_SLOT_DELAY = 10;
// MS after reveal until win / lose effect is played
export const FINAL_DELAY = 500;

// SLOT IMAGES
export const IMAGE_9 = "/games/devilslock/9.png";
export const IMAGE_10 = "/games/devilslock/10.png";
export const IMAGE_J = "/games/devilslock/J.png";
export const IMAGE_Q = "/games/devilslock/Q.png";
export const IMAGE_K = "/games/devilslock/K.png";
export const IMAGE_A = "/games/devilslock/A.png";
export const IMAGE_PITCHFORK = "/games/devilslock/pitchfork.png";
export const IMAGE_DIAMOND = "/games/devilslock/diamond.png";
export const IMAGE_MONEY = "/games/devilslock/money.png";
export const IMAGE_CROWN = "/games/devilslock/crown.png";
export const IMAGE_MINI = "/games/devilslock/mini.png";
export const IMAGE_MINOR = "/games/devilslock/minor.png";
export const IMAGE_MAXI = "/games/devilslock/maxi.png";
export const IMAGE_GRAND = "/games/devilslock/grand.png";

// CENTER-ONLY IMAGE FOR ANY WIN ( WILD )
export const IMAGE_DEVIL = "/games/devilslock/devil.png";

export interface SlotItem {
  multiplier: number;
  image: string;
}

// Utility function for grouping slot items
const slotItem = (multiplier: number, ...icons: string[]): SlotItem[] =>
  icons.map((image) => ({ multiplier, image }));

// All available slot items with associated multipliers
export const SLOT_ITEMS = [
  slotItem(0.25, IMAGE_9),
  slotItem(0.5, IMAGE_10),
  slotItem(0.75, IMAGE_J),
  slotItem(1, IMAGE_Q),
  slotItem(1.25, IMAGE_K),
  slotItem(1.5, IMAGE_A),
  slotItem(2, IMAGE_PITCHFORK),
  slotItem(2.25, IMAGE_DIAMOND),
  slotItem(2.5, IMAGE_MONEY),
  slotItem(2.75, IMAGE_CROWN),
  slotItem(5, IMAGE_MINI),
  slotItem(10, IMAGE_MINOR),
  slotItem(15, IMAGE_MAXI),
  slotItem(20, IMAGE_GRAND),
].flat();

// Generates the bet array with a total sum of 100
export const generateBetArray = (maxLength = 100): number[] => {
  const commonMultipliers = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.25, 2.5, 2.75];
  const specialMultipliers = [5, 10, 15, 20];

  let betArray = [...specialMultipliers];

  // Calculate remaining sum to reach 100
  let remainingSum = 100 - betArray.reduce((a, b) => a + b, 0);

  // Fill remaining slots with common multipliers until we reach the desired sum
  while (remainingSum > 0 && betArray.length < maxLength) {
    const validMultipliers = commonMultipliers.filter((m) => m <= remainingSum);
    if (validMultipliers.length === 0) break;

    const randomMultiplier =
      validMultipliers[Math.floor(Math.random() * validMultipliers.length)];
    betArray.push(randomMultiplier);
    remainingSum -= randomMultiplier;
  }

  // If the array isn't exactly 100 elements, add zeros to fill up to 100 elements
  const numZeros = maxLength - betArray.length;
  betArray.push(...Array(numZeros).fill(0));

  // Shuffle the array for randomness
  betArray = betArray.sort(() => Math.random() - 0.5);

  // If the sum isn't exactly 100, adjust the last non-zero element to make up the difference
  const currentSum = betArray.reduce((a, b) => a + b, 0);
  const difference = 100 - currentSum;

  // Find the last non-zero element and adjust it by the difference
  for (let i = betArray.length - 1; i >= 0; i--) {
    if (betArray[i] !== 0) {
      betArray[i] += difference;
      break;
    }
  }

  return betArray;
};

/**
 * Picks a random slot item combination based on the result.
 * TODO: Add support for ALL MULTIS CHECKS AND ALL COMBINATIONS
 */
export const getSlotCombination = (
  count: number,
  multiplier: number,
  bet: number[],
  win: boolean,
): SlotItem[] => {
  // When the player wins, all slots will display the same winning symbol
  if (multiplier > 0) {
    const items = SLOT_ITEMS.filter((x) => x.multiplier === multiplier);
    return new Array(count).fill(
      items[Math.floor(Math.random() * items.length)],
    );
  }

  // For other cases, simulate a random roll
  const availableSlotItems = SLOT_ITEMS.filter((x) =>
    bet.includes(x.multiplier),
  );

  const items: SlotItem[] = [];
  let middleIndex = Math.floor(count / 2);

  // Ensure the middle row shows the devil image only if win is true
  for (let i = 0; i < count; i++) {
    let item: SlotItem;
    if (i === middleIndex && win) {
      item = { multiplier: 0, image: IMAGE_DEVIL };
    } else {
      // Pick a random slot item from the available ones
      item =
        availableSlotItems[
          Math.floor(Math.random() * availableSlotItems.length)
        ];
    }
    items.push(item);
  }

  return items;
};
