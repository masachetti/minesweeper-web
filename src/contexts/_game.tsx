import { createContext, useContext, useEffect, useState } from "react";
import createMatrix from "../functions/createMatrix";
import placeBombs from "../functions/placeBombs";

type GameContextValue = {
  nodes: MatrixNode<GameNode>[][];
  gameState: GameState;
  timeCounter: number;
  bombCounter: number;
  settings: Settings;
  clickNode: (nodePosition: NodePosition) => void;
  markNode: (node: MatrixNode<GameNode>) => void;
  openNearbyNodes: (node: MatrixNode<GameNode>) => void;
  restartGame: () => void;
  changeSettings: (newSettings: Settings) => void;
};

const defaultSettings = {
  matrixShape: {
    rows: 10,
    columns: 10,
  },
  numberOfBombs: 25,
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
  restartGame: () => {},
  changeSettings: () => {},
});

function createInitialNode(): GameNode {
  return {
    isBomb: false,
    isHidden: true,
    isMarked: false,
    numberOfNearbyBombs: 0,
    isTriggeredBomb: false,
  };
}

function createBaseMatrix(shape: MatrixShape) {
  return createMatrix({
    shape,
    nodeInitializationFunction: createInitialNode,
  });
}

export const GameProvider = ({ children }: React.PropsWithChildren) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [gameState, setGameState] = useState<GameState>("not-started");
  const [timerId, setTimerId] = useState<undefined | number>(undefined);
  const [timeCounter, setTimeCounter] = useState(0);
  const [bombCounter, setBombCounter] = useState(settings.numberOfBombs);
  const [matrix, setMatrix] = useState<Matrix<GameNode>>(() =>
    createBaseMatrix(settings.matrixShape)
  );

  const changeSettings = (newSettings: Settings) => {
    if (
      settings.matrixShape.rows !== newSettings.matrixShape.rows ||
      settings.matrixShape.columns !== newSettings.matrixShape.columns ||
      settings.numberOfBombs !== newSettings.numberOfBombs
    ) {
      if (gameState === "playing") {
        const windowText =
          "Uma partida está em andamento. Deseja iniciar uma nova partida com as novas configurações?";
        if (!window.confirm(windowText)) return;
      }
      console.log("new settings> ", newSettings);
      setSettings(newSettings);
      restartGame(newSettings);
      return;
    }
    setSettings(newSettings);
  };

  const checkIfGameIsFinished = () => {
    // Win condition > All nodes need to be:
    // 1. Bomb and hidden (1,1)
    // or 2. Not bomb and not hidden (0,0)
    const nodeList = matrix.nodes.flat();
    const isGameFinished = nodeList.every(
      (node) => node.isBomb === node.isHidden
    );
    if (isGameFinished) {
      setGameState("win");
      stopTimer();
    }
  };

  const refreshNodes = () => {
    checkIfGameIsFinished();
    setMatrix({ ...matrix });
  };

  const restartGame = (gameSettings = settings) => {
    setGameState("not-started");
    setMatrix(createBaseMatrix(gameSettings.matrixShape));
    stopTimer();
    setTimeCounter(0);
    setBombCounter(gameSettings.numberOfBombs);
  };

  const startGame = (startedNode: MatrixNode<GameNode>) => {
    const excludedPositions = [
      startedNode.position,
      ...startedNode.getNearbyNodes().map((n) => n.position),
    ];
    placeBombs({
      nodes: matrix.nodes,
      numberOfBombs: settings.numberOfBombs,
      excludedPositions,
      matrixShape: settings.matrixShape,
    });
    setTimeCounter(0);
    setBombCounter(settings.numberOfBombs);
    startTimer();
    setGameState("playing");
  };

  const startTimer = () => {
    const timerId = setInterval(() => {
      setTimeCounter((prevCounter) => prevCounter + 1);
    }, 1000);
    setTimerId(timerId);
  };

  const stopTimer = () => {
    const tempIntervalId = setInterval(() => {
      if (timerId){
        clearInterval(timerId);
        setTimerId(undefined);
        clearInterval(tempIntervalId)
      }
    }, 50)
  }

  const openNode = (node: MatrixNode<GameNode>) => {
    if (node.isHidden) {
      node.isHidden = false;
      if (node.numberOfNearbyBombs === 0) {
        const nearbyNodes = node.getNearbyNodes();
        nearbyNodes.forEach(openNode);
      }
    }
  };

  const clickNode = (nodePosition: NodePosition) => {
    console.log("Node click > ", nodePosition);
    const node = matrix.getNode(nodePosition);
    if (node) {
      if (gameState === "not-started") startGame(node);
      if (node.isBomb) {
        node.isTriggeredBomb = true;
        setGameState("lose");
        stopTimer();
        return;
      }
      openNode(node);
      refreshNodes();
    }
  };

  const markNode = (node: MatrixNode<GameNode>) => {
    if (node.isHidden && bombCounter > 0) {
      if (node.isMarked) setBombCounter(bombCounter + 1);
      else setBombCounter(bombCounter - 1);
      node.isMarked = !node.isMarked;
      refreshNodes();
    }
  };

  const openNearbyNodes = (node: MatrixNode<GameNode>) => {
    if (node.isHidden) return;
    const nearbyNodes = node.getNearbyNodes();
    const numberOfNearbyMarkedNodes = nearbyNodes.reduce(
      (prev, curr) => prev + Number(curr.isMarked),
      0
    );
    if (numberOfNearbyMarkedNodes === node.numberOfNearbyBombs) {
      nearbyNodes.forEach((node) => {
        if (!node.isMarked) openNode(node);
      });
      refreshNodes();
    }
  };

  const value = {
    nodes: matrix.nodes,
    clickNode,
    markNode,
    gameState,
    openNearbyNodes,
    timeCounter,
    bombCounter,
    restartGame,
    settings,
    changeSettings,
  };
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);
