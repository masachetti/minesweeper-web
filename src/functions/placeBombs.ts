import getNearbyNodes from "./getNearbyNodes";
import getNode from "./getNode";

type PlaceBombsParams = {
  matrix: Matrix;
  numberOfBombs: number;
  excludedPositions: NodePosition[];
};

export default function placeBombs({
  matrix,
  numberOfBombs,
  excludedPositions,
}: PlaceBombsParams) {
  const { rows, columns } = matrix.shape;
  const maxPossibleBombs = rows * columns - excludedPositions.length;
  if (numberOfBombs > maxPossibleBombs) return;

  const generateRandomPosition = (): NodePosition => ({
    rowIndex: Math.floor(Math.random() * rows),
    columnIndex: Math.floor(Math.random() * columns),
  });
  const isPositionExcluded = ({ rowIndex, columnIndex }: NodePosition) => {
    return !!excludedPositions.find(
      (p) => p.rowIndex === rowIndex && p.columnIndex === columnIndex
    );
  };
  const isPositionValid = (position: NodePosition) => {
    const node = getNode({ matrix, position });
    if (!node || node.isBomb) return false;
    if (isPositionExcluded(position)) return false;
    return true;
  };
  let placedBombs = 0;
  while (placedBombs < numberOfBombs) {
    const newPosition = generateRandomPosition();
    if (isPositionValid(newPosition)) {
      const params = {
        matrix,
        position: newPosition,
      };
      const bombNode = getNode(params) as MatrixNode;
      bombNode.isBomb = true;
      getNearbyNodes(params).forEach((node) => (node.numberOfNearbyBombs += 1));
      placedBombs++;
    }
  }
}
