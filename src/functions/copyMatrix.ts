export default function copyMatrix({ nodes, shape }: Matrix): Matrix {
  return {
    nodes: nodes.map((row) => row.map((node) => ({ ...node }))),
    shape: { ...shape },
  };
}
