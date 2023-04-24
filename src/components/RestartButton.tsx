import React from "react";
import { useGame } from "../contexts/game";

const icon = (
  <svg
    width={35}
    height={35}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M15 6.844s1.142-.563-3-.563a7.5 7.5 0 1 0 7.5 7.5" />
    <path d="m12 2.719 3.75 3.75-3.75 3.75" />
  </svg>
);

const RestartButton = () => {
  const { resetGame: restartGame } = useGame();
  return (
    <div
      className="bg-black border-2 rounded-lg flex justify-center items-center px-2 py-1 cursor-pointer hover:bg-neutral-700 active:bg-neutral-800"
      onClick={() => restartGame()}
    >
      {icon}
    </div>
  );
};

export default RestartButton;
