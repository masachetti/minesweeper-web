import React, { useEffect, useState } from "react";
import useIsMounted from "../hooks/useIsMounted";
import { AnimatePresence, motion } from "framer-motion";
import { useGame } from "../contexts/game";

const SettingsMenu = ({ onOutsideClick = () => {} }) => {
  const { settings, changeSettings } = useGame();
  const [rows, setRows] = useState(settings.matrixShape.rows);
  const [columns, setColumns] = useState(settings.matrixShape.columns);
  const [bombs, setBombs] = useState(settings.numberOfBombs);
  const mounted = useIsMounted();

  useEffect(() => {
    return () => {
      if (!mounted()) {
        changeSettings({
          matrixShape: { rows, columns },
          numberOfBombs: bombs,
        });
      }
    };
  }, [mounted]);

  return (
    <>
      <motion.div
        initial={{
          transformOrigin: "top center",
        }}
        animate={{
          transform: [
            "scaleX(0.01) scaleY(0)",
            "scaleX(0.01) scaleY(1)",
            "scaleX(1) scaleY(1)",
          ],
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        exit={{
          transform: [
            "scaleX(1) scaleY(1)",
            "scaleX(0.01) scaleY(1)",
            "scaleX(0.01) scaleY(0)",
          ],
        }}
        className="absolute top-full h-42 z-50 overflow-hidden"
      >
        <div className="h-40 w-56 gap-y-3 bg-emerald-950 rounded-md border mt-1 flex flex-col items-center text-white">
          <div className="mt-3 flex w-full justify-between gap-x-2 px-2">
            <p className="font-bold">Dimensões :</p>
            <input
              type="number"
              placeholder="Li"
              className="w-10 text-black rounded-md text-center px-1 "
              value={rows}
              onChange={(e) => setRows(Number(e.target.value))}
            ></input>
            <p>X</p>
            <input
              type="number"
              placeholder="Col"
              className="w-10 text-black rounded-md text-center px-1"
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
            ></input>
          </div>
          <div className="flex w-full justify-between gap-x-2 px-2">
            <p className="font-bold">Bombas :</p>
            <input
              type="number"
              className="w-14 text-black rounded-md text-center px-1 "
              value={bombs}
              onChange={(e) => setBombs(Number(e.target.value))}
            ></input>
          </div>
        </div>
      </motion.div>
      <div
        className="fixed w-screen h-screen top-0 right-0"
        onClick={onOutsideClick}
      ></div>
    </>
  );
};

export default SettingsMenu;
