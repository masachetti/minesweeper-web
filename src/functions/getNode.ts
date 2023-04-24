type GetNodeParams = {
  matrix: Matrix;
  position: NodePosition;
};
export default function getNode({
  matrix: { shape, nodes },
  position,
}: GetNodeParams) {
  if (position.rowIndex < 0 || position.columnIndex < 0) return undefined;
  if (position.rowIndex >= shape.rows || position.columnIndex >= shape.columns)
    return undefined;
  return nodes[position.rowIndex][position.columnIndex];
}
