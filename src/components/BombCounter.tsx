import React from "react";
import { useGame } from "../contexts/game";
import bombImg from "../assets/bomb.png";

const BombCounter = () => {
  const { bombCounter } = useGame();
  return (
    <div
      style={{ fontFamily: "Orbitron", fontVariantNumeric: "tabular-nums" }}
      className="relative text-white bg-black py-1 px-2 rounded-lg border-2 text-2xl w-28 flex justify-center items-center"
    >
      {bombCounter}
      <img
        className="absolute top-0 right-0 w-5 h-5"
        src={bombImg}
        style={{
          filter:
            "invert(100%) sepia(100%) saturate(1%) hue-rotate(245deg) brightness(109%) contrast(101%)",
        }}
      ></img>
    </div>
  );
};

export default BombCounter;
