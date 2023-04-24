import React from "react";
import Timer from "./Timer";
import BombCounter from "./BombCounter";
import RestartButton from "./RestartButton";
import SettingsButton from "./SettingsButton";

const TopBar = () => (
  <div className="h-16 w-2/4 bg-emerald-500 rounded-b-2xl rounded-t-sm flex justify-between px-10 py-2 items-stretch">
    <Timer />
    <RestartButton />
    <SettingsButton />
    <BombCounter />
  </div>
);

export default TopBar;
