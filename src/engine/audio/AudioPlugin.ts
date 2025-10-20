// import { sound } from "@pixi/sound"; // Đã tắt để tránh AudioContext warning
import { ExtensionType } from "pixi.js";
import type { Application, ExtensionMetadata } from "pixi.js";

// import { BGM, SFX } from "./audio"; // Đã tắt để tránh AudioContext warning

/**
 * Middleware for Application's audio functionality.
 *
 * Adds the following methods to Application:
 * * Application#audio
 * * Application#audio.bgm
 * * Application#audio.sfx
 * * Application#audio.getMasterVolume
 * * Application#audio.setMasterVolume
 */
export class CreationAudioPlugin {
  /** @ignore */
  public static extension: ExtensionMetadata = ExtensionType.Application;

  /**
   * Initialize the plugin with scope of application instance
   */
  public static init(): void {
    const app = this as unknown as Application;

    // Stub audio system để tránh lỗi
    app.audio = {
      bgm: {
        play: () => {},
        getVolume: () => 1,
        setVolume: () => {},
        currentAlias: undefined,
        current: undefined,
      },
      sfx: {
        play: () => {},
        getVolume: () => 1,
        setVolume: () => {},
      },
      getMasterVolume: () => 1,
      setMasterVolume: (_volume: number) => {
        // Không làm gì vì đã tắt audio system
      },
    };
  }

  /**
   * Clean up the ticker, scoped to application
   */
  public static destroy(): void {
    const app = this as unknown as Application;
    app.audio = null as unknown as Application["audio"];
  }
}
