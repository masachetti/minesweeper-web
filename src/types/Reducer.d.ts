type ReducerAction =
  | ReducerNodeAction
  | ReducerGameAction
  | ReducerSettingsAction
  | ReducerTimerAction;

type ReducerNodeAction = {
  type: "CLICK-NODE" | "MARK-NODE" | "OPEN-NEARBY-NODES" | "START-GAME";
  position: NodePosition;
};

type ReducerGameAction = {
  type: "RESET-GAME";
};

type ReducerSettingsAction = {
  type: "CHANGE-SETTINGS";
  settings: Settings;
};

type ReducerTimerAction = {
  type: "INCREASE-TIMER";
};

type ReducerState = {
  gameState: GameState;
  timeCounter: number;
  bombCounter: number;
  matrix: Matrix;
  settings: Settings;
};