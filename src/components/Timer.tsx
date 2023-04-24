import React from "react";
import { useGame } from "../contexts/game";
import ClockIcon from "./icons/ClockIcon";

const Timer = () => {
  const { timeCounter } = useGame();

  const minutes = Math.floor(timeCounter / 60);
  const seconds = timeCounter % 60;
  const minutesStr = (minutes >= 10 ? "" : "0") + minutes;
  const secondsStr = (seconds >= 10 ? "" : "0") + seconds;
  return (
    <div
      style={{ fontFamily: "Orbitron", fontVariantNumeric: "tabular-nums" }}
      className="relative text-white bg-black py-1 px-2 rounded-lg border-2 text-2xl w-28 flex items-center justify-center"
    >
      {`${minutesStr}:${secondsStr}`}
      <ClockIcon className="absolute top-0 right-0" color="white" size={18} strokeWidth={2.5}></ClockIcon>
    </div>
  );
};

export default Timer;
