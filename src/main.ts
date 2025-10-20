import { setEngine } from "./app/getEngine";
import { LoadScreen } from "./app/screens/LoadScreen";
import { FishingGameScreen } from "./app/screens/game/FishingGameScreen";
import { userSettings } from "./app/utils/userSettings";
import { CreationEngine } from "./engine/engine";

/**
 * Importing these modules will automatically register there plugins with the engine.
 */
// import "@pixi/sound"; // Đã tắt để tránh AudioContext warning
// import "@esotericsoftware/spine-pixi-v8";

// Create a new creation engine instance
const engine = new CreationEngine();
setEngine(engine);

(async () => {
  // Initialize the creation engine instance
  await engine.init({
    background: "#1E1E1E",
    resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false },
  });

  // Initialize the user settings (sử dụng stub audio system)
  userSettings.init();

  // Show the load screen
  await engine.navigation.showScreen(LoadScreen);

  // Show the fishing game screen
  const gameScreen = new FishingGameScreen();

  // Initialize the game screen (loads advertisement data)
  await gameScreen.initialize();

  engine.stage.addChild(gameScreen);

  // Game loop
  let lastTime = 0;
  const gameLoop = (currentTime: number) => {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    gameScreen.update(deltaTime);
    requestAnimationFrame(gameLoop);
  };

  requestAnimationFrame(gameLoop);
})();
