import React, { Children, PropsWithChildren } from "react";
import GameGrid from "./GameGrid";
import { useGame } from "../contexts/game";
import TopBar from "./TopBar";
import { motion } from "framer-motion";

const Game = () => {
  const { gameState, timeCounter } = useGame();

  const isGameFinished = gameState === "lose" || gameState === "win";

  const winPanel = () => {
    return (
      <motion.div 
      className="absolute w-3/4 h-40 z-20 flex flex-col items-center justify-between bg-emerald-600 border-2 rounded-lg py-3 px-2"
      initial={{
        y: "-100px",
        opacity: 0
      }}
      animate={{
        y: "0",
        opacity: 1
      }}
      transition={{
        duration: 0.5
      }}
      >
        <p className="text-white text-lg text-center font-bold">
          Parabéns!<br/>Você completou o puzzle.
        </p>
        <div className="w-full h-0.5 bg-white -mt-4"></div>
        <p className="mb-6 text-white font-bold">Tempo : {timeCounter}s</p>
      </motion.div>
    );
  };

  return (
    <div className="flex items-center w-screen h-screen flex-col mb-24">
      <TopBar></TopBar>
      <div className="w-fit h-fit mt-3 relative">
        {isGameFinished && (
          <>
            <div className="absolute z-10 bg-gray-600 opacity-60 w-full h-full" />
            <div className="absolute z-20 w-full h-full flex justify-center items-center">
              {gameState === "lose" ? (
                <p className="text-6xl font-bold text-red-600 tracking-wide">
                  ERROU
                </p>
              ) : (
                winPanel()
              )}
            </div>
          </>
        )}
        <GameGrid className={isGameFinished ? "blur-[1px]" : ""}></GameGrid>
      </div>
    </div>
  );
};

export default Game;
