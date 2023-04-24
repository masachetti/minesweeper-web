import React, { Fragment, Key } from "react";
import { useGame } from "../contexts/game";
import GridNode from "./GridNode";

const GameGrid = ({className=''}) => {

  const { nodes, clickNode, markNode, openNearbyNodes} = useGame();

  return (
    <div className={"border-2 " + className} >
      {nodes.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((node, columnIndex) => (
            <GridNode
              key={columnIndex}
              node={node}
              onClick={() => clickNode(node.position)}
              onRightClick={() => markNode(node.position)}
              onDoubleClick={() => openNearbyNodes(node.position)}
            ></GridNode>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
