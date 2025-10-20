import { ExtensionType } from "pixi.js";
import type { Application, ExtensionMetadata } from "pixi.js";
import { BGM, SFX } from "./audio";

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

    // Create real instances to satisfy strict typings
    const bgm = new BGM();
    const sfx = new SFX();

    app.audio = {
      bgm,
      sfx,
      getMasterVolume: () => {
        // Use BGM volume as the master reference
        return bgm.getVolume();
      },
      setMasterVolume: (volume: number) => {
        bgm.setVolume(volume);
        sfx.setVolume(volume);
      },
    } as Application["audio"];
  }

  /**
   * Clean up the ticker, scoped to application
   */
  public static destroy(): void {
    const app = this as unknown as Application;
    app.audio = null as unknown as Application["audio"];
  }
}
