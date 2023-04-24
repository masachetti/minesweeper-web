type MatrixShape = {
  rows: number;
  columns: number;
};

type NodePosition = {
  rowIndex: number;
  columnIndex: number;
};

type MatrixNode = GameNode & {
  position: NodePosition;
  // getNearbyNodes: () => MatrixNode<T>[];
};

type MatrixParams = {
  shape: MatrixShape;
};

type Matrix = {
  nodes: MatrixNode[][],
  shape: MatrixShape
}
  // getNode: (postion: NodePosition) => MatrixNode | undefined;

type ApplyOnNearbyNodesParams = {
  nodePosition: NodePosition;
  applyFunction: ({
    node: MatrixNode,
    nodePosition: NodePosition,
  }) => MatrixNode;
};
