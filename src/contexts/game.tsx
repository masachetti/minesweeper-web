import { createContext, useContext, useReducer } from "react";
import createMatrix from "../functions/createMatrix";
import placeBombs from "../functions/placeBombs";
import useInterval from "../hooks/useInterval";
import getNode from "../functions/getNode";
import getNearbyNodes from "../functions/getNearbyNodes";
import copyMatrix from "../functions/copyMatrix";
import openNode from "../functions/openNode";

const MIN_ROWS_COLUMNS = 5;
const MAX_ROWS_COLUMNS = 20;
const MIN_NUMBER_OF_BOMBS = 5;
const MAX_NUMBER_OF_BOMBS_RATIO = 0.4;

const defaultSettings = {
  matrixShape: {
    rows: 10,
    columns: 10,
  },
  numberOfBombs: 25,
};

const validateSettings = ({ matrixShape, numberOfBombs }: Settings) => {
  if (
    matrixShape.rows < MIN_ROWS_COLUMNS ||
    matrixShape.columns < MIN_ROWS_COLUMNS
  ) {
    const alertMessage = `O valor de uma dimensão deve ser no mínimo ${MIN_ROWS_COLUMNS}!`;
    return [false, alertMessage];
  }
  if (
    matrixShape.rows > MAX_ROWS_COLUMNS ||
    matrixShape.columns > MAX_ROWS_COLUMNS
  ) {
    const alertMessage = `O valor de uma dimensão deve ser no máximo ${MAX_ROWS_COLUMNS}!`;
    return [false, alertMessage];
  }
  if (numberOfBombs < MIN_NUMBER_OF_BOMBS) {
    const alertMessage = `O número de bombas deve ser no mínimo ${MIN_NUMBER_OF_BOMBS}!`;
    return [false, alertMessage];
  }
  const numberOfNodes = matrixShape.rows * matrixShape.columns;
  const maxBombs = numberOfNodes * MAX_NUMBER_OF_BOMBS_RATIO;
  
  if (numberOfBombs > maxBombs) {
    const alertMessage = `O número de bombas deve ser de no máximo ${
      MAX_NUMBER_OF_BOMBS_RATIO * 100
    }% do tamanho do jogo (${maxBombs} bombas)!`;
    return [false, alertMessage];
  }
  return [true, ''];
};

const GameContext = createContext<GameContextValue>({
  nodes: [[]],
  gameState: "not-started",
  timeCounter: 0,
  bombCounter: 0,
  settings: defaultSettings,
  clickNode: () => {},
  markNode: () => {},
  openNearbyNodes: () => {},
  resetGame: () => {},
  changeSettings: () => {},
});

const INITIAL_STATE: ReducerState = {
  settings: defaultSettings,
  gameState: "not-started",
  timeCounter: 0,
  bombCounter: defaultSettings.numberOfBombs,
  matrix: createMatrix(defaultSettings.matrixShape),
};

const clickNode = (
  matrix: Matrix,
  position: NodePosition
): Partial<ReducerState> => {
  const node = getNode({ matrix, position });
  if (!node) return {};
  if (!node.isHidden) return {};
  if (node.isBomb) {
    node.isTriggeredBomb = true;
    return {
      gameState: "lose",
    };
  }
  openNode({ matrix, position });
  return {};
};

const startGame = (
  matrix: Matrix,
  position: NodePosition,
  numberOfBombs: Settings["numberOfBombs"]
): Partial<ReducerState> => {
  const excludedPositions = [
    position,
    ...getNearbyNodes({ matrix, position }).map((n) => n.position),
  ];
  placeBombs({
    matrix,
    numberOfBombs,
    excludedPositions,
  });
  return {
    timeCounter: 0,
    bombCounter: numberOfBombs,
    gameState: "playing",
  };
};

const markNode = (
  matrix: Matrix,
  position: NodePosition,
  bombCounter: number
): Partial<ReducerState> => {
  const node = getNode({ matrix, position });
  if (!node) return {};
  if (node.isHidden && bombCounter > 0) {
    node.isMarked = !node.isMarked;
    return {
      bombCounter: bombCounter + (node.isMarked ? -1 : 1),
    };
  }
  return {};
};

const openNearbyNodes = (
  matrix: Matrix,
  position: NodePosition
): Partial<ReducerState> => {
  const node = getNode({ matrix, position });
  if (!node) return {};
  if (node.isHidden) return {};
  const nearbyNodes = getNearbyNodes({ matrix, position });
  const numberOfNearbyMarkedNodes = nearbyNodes.reduce(
    (prev, curr) => prev + Number(curr.isMarked),
    0
  );
  let returnState = {};
  if (numberOfNearbyMarkedNodes === node.numberOfNearbyBombs) {
    nearbyNodes.forEach((node) => {
      if (!node.isMarked) {
        returnState = {
          ...returnState,
          ...clickNode(matrix, node.position),
        };
      }
    });
  }
  return returnState;
};

const checkIfGameIsFinished = (matrix: Matrix): Partial<ReducerState> => {
  // Win condition > All nodes need to be:
  // 1. Bomb and hidden (1,1)
  // or 2. Not bomb and not hidden (0,0)
  const nodeList = matrix.nodes.flat();
  const isGameFinished = nodeList.every(
    (node) => node.isBomb === node.isHidden
  );
  if (isGameFinished) {
    return {
      gameState: "win",
    };
  }
  return {};
};

function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  if (
    action.type === "START-GAME" ||
    action.type === "OPEN-NEARBY-NODES" ||
    action.type === "CLICK-NODE" ||
    action.type === "MARK-NODE"
  ) {
    const matrix = copyMatrix(state.matrix);
    const position = action.position;
    if (action.type === "START-GAME")
      return {
        ...state,
        ...startGame(matrix, position, state.settings.numberOfBombs),
        matrix,
      };
    if (action.type === "CLICK-NODE") {
      return {
        ...state,
        ...clickNode(matrix, position),
        ...checkIfGameIsFinished(matrix),
        matrix,
      };
    }
    if (action.type === "MARK-NODE") {
      return {
        ...state,
        ...markNode(matrix, position, state.bombCounter),
        matrix,
      };
    }
    if (action.type === "OPEN-NEARBY-NODES") {
      return {
        ...state,
        ...openNearbyNodes(matrix, position),
        ...checkIfGameIsFinished(matrix),
        matrix,
      };
    }
  }
  if (action.type === "RESET-GAME") {
    return {
      ...state,
      gameState: "not-started",
      matrix: createMatrix(state.settings.matrixShape),
      timeCounter: 0,
      bombCounter: state.settings.numberOfBombs,
    };
  }
  if (action.type === "INCREASE-TIMER") {
    return {
      ...state,
      timeCounter: state.timeCounter + 1,
    };
  }
  if (action.type === "CHANGE-SETTINGS") {
    return {
      ...state,
      settings: action.settings,
    };
  }
  return state;
}

export const GameProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const isTimerOn = state.gameState === "playing";
  useInterval(
    () => dispatch({ type: "INCREASE-TIMER" }),
    isTimerOn ? 1000 : null
  );

  const changeSettings = (newSettings: Settings) => {
    const [isValid, alertMessage] = validateSettings(newSettings)
    if (!isValid){
      window.alert(alertMessage)
      return;
    }
    if (
      state.settings.matrixShape.rows !== newSettings.matrixShape.rows ||
      state.settings.matrixShape.columns !== newSettings.matrixShape.columns ||
      state.settings.numberOfBombs !== newSettings.numberOfBombs
    ) {
      if (state.gameState === "playing") {
        const windowText =
          "Uma partida está em andamento. Deseja iniciar uma nova partida com as novas configurações?";
        if (!window.confirm(windowText)) return;
      }
      dispatch({ type: "CHANGE-SETTINGS", settings: newSettings });
      dispatch({ type: "RESET-GAME" });
      return;
    }
    dispatch({ type: "CHANGE-SETTINGS", settings: newSettings });
  };

  const resetGame = () => {
    dispatch({ type: "RESET-GAME" });
  };

  const clickNode = (position: NodePosition) => {
    if (state.gameState === "not-started") {
      dispatch({ type: "START-GAME", position });
    }
    dispatch({ type: "CLICK-NODE", position });
  };

  const markNode = (position: NodePosition) => {
    dispatch({ type: "MARK-NODE", position });
  };

  const openNearbyNodes = (position: NodePosition) => {
    dispatch({ type: "OPEN-NEARBY-NODES", position });
  };

  const value = {
    nodes: state.matrix.nodes,
    clickNode,
    markNode,
    gameState: state.gameState,
    openNearbyNodes,
    timeCounter: state.timeCounter,
    bombCounter: state.bombCounter,
    resetGame,
    settings: state.settings,
    changeSettings,
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);
