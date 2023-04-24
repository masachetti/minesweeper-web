import getNearbyNodes from "./getNearbyNodes";
import getNode from "./getNode";

type OpenNodeParams = {
  matrix: Matrix;
  position: NodePosition;
};

function openRecursively(matrix: Matrix, node: MatrixNode) {
  if (node.isHidden) {
    node.isHidden = false;
    if (node.numberOfNearbyBombs === 0) {
      const nearbyNodes = getNearbyNodes({ matrix, position: node.position });
      nearbyNodes.forEach((nNode) => openRecursively(matrix, nNode));
    }
  }
}

export default function openNode({ matrix, position }: OpenNodeParams) {
  const node = getNode({ matrix, position });
  if (!node) return;
  openRecursively(matrix, node);
}
