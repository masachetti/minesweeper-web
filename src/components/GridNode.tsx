import React from "react";
import flagImage from "../assets/triangular-flag.png";
import bombImage from "../assets/bomb.png";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../contexts/game";

type GridNodesProps = {
  node: GameNode;
  onClick: () => void;
  onRightClick: () => void;
  onDoubleClick: () => void;
};

const nearbyBombsTipColorMap = [
  "black", // 1
  "green", // 2
  "darkblue", // 3
  "darkred", // 4
  "chocolate", // 5
  "deeppink", // 6
  "indigo", // 7
  "goldenrod", // 8
];

const GridNode = ({
  node,
  onClick,
  onRightClick,
  onDoubleClick,
}: GridNodesProps) => {
  const { gameState } = useGame();
  const isGameLost = gameState === "lose";
  const isNodeContentDisplayed = !node.isHidden || (node.isBomb && isGameLost);

  return (
    <div
      className="w-8 h-8 relative"
      onContextMenu={(e) => {
        e.preventDefault();
        onRightClick();
      }}
    >
      {node.isMarked && (
        <img className="absolute z-10 w-8 h-8 p-1" src={flagImage} />
      )}
      <AnimatePresence>
        {isNodeContentDisplayed ? (
          <div
            className="border w-8 h-8 text-center flex justify-center items-center text-xl select-none"
            onContextMenu={(e) => e.preventDefault()}
            onDoubleClick={onDoubleClick}
            key={"U"}
          >
            {node.isBomb ? (
              node.isTriggeredBomb ? (
                <img className="w-8 h-8 p-1 bg-red-500" src={bombImage} />
              ) : (
                <img className="w-8 h-8 p-1" src={bombImage} />
              )
            ) : (
              <p
                className="text-2xl"
                style={{
                  color: nearbyBombsTipColorMap[node.numberOfNearbyBombs - 1],
                }}
              >
                {node.numberOfNearbyBombs || ""}
              </p>
            )}
          </div>
        ) : (
          <motion.div
            className="absolute border bg-teal-500 h-full w-full hover:bg-teal-600 active:bg-teal-500 opacity-100 origin-center"
            onClick={onClick}
            exit={{
              opacity: 0,
              scale: [1, 1.2, 1],
            }}
            transition={{
              ease: "linear",
              duration: 0.15,
            }}
            key={"H"}
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GridNode;
