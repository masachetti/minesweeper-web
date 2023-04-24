import getNode from "./getNode";

const nearbyNodesAuxArray = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

type GetNearbyNodesParams = {
  matrix: Matrix;
  position: NodePosition;
};

export default function getNearbyNodes({
  matrix,
  position,
}: GetNearbyNodesParams) {
  const nearbyNodes = nearbyNodesAuxArray
    .map(([deltaRow, deltaColumn]) =>
      getNode({
        matrix,
        position: {
          rowIndex: position.rowIndex + deltaRow,
          columnIndex: position.columnIndex + deltaColumn,
        },
      })
    )
    .filter((v): v is MatrixNode => v !== undefined);
  return nearbyNodes;
}
