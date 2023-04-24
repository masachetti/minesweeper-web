import React, { useState } from "react";
import SettingsMenu from "./SettingsMenu";
import { AnimatePresence } from "framer-motion";

const icon = (
  <svg
    width={35}
    height={35}
    fill="none"
    stroke="#fff"
    strokeLinecap="round"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3.75 7.5h16.5" />
    <path d="M3.75 12h16.5" />
    <path d="M3.75 16.5h16.5" />
  </svg>
);

const SettingsButton = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative flex justify-center">
      <div
        className="relative bg-black border-2 rounded-lg flex justify-center items-center px-2 py-1 cursor-pointer hover:bg-neutral-700 active:bg-neutral-800"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {icon}
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <SettingsMenu
            onOutsideClick={() => setIsMenuOpen(false)}
          ></SettingsMenu>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsButton;
