
type GameNode = {
  isBomb: boolean;
  isHidden: boolean;
  isMarked: boolean;
  numberOfNearbyBombs: number;
  isTriggeredBomb: boolean;
}

type GameState = "not-started" | "win" | "lose" | "playing";