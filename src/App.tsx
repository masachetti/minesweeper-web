import Game from "./components/Game";
import { GameProvider } from "./contexts/game";

function App() {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
}

export default App;
