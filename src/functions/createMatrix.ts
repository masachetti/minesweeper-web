const createMatrix = (shape: MatrixShape): Matrix => {
  function createInitialNode(position: NodePosition): MatrixNode {
    return {
      position,
      isBomb: false,
      isHidden: true,
      isMarked: false,
      numberOfNearbyBombs: 0,
      isTriggeredBomb: false,
    };
  }

  const createInitialMatrix = ({ rows, columns }: MatrixShape) => {
    return Array.from({ length: rows }, (_, rowIndex) =>
      Array.from({ length: columns }, (_, columnIndex) =>
        createInitialNode({ rowIndex, columnIndex })
      )
    );
  };

  const nodes: MatrixNode[][] = createInitialMatrix(shape);

  return { nodes, shape };
};

export default createMatrix;
