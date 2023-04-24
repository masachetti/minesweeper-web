type GameContextValue = {
  nodes: Matrix["nodes"];
  gameState: GameState;
  timeCounter: number;
  bombCounter: number;
  settings: Settings;
  clickNode: (nodePosition: NodePosition) => void;
  markNode: (nodePosition: NodePosition) => void;
  openNearbyNodes: (nodePosition: NodePosition) => void;
  resetGame: () => void;
  changeSettings: (newSettings: Settings) => void;
};