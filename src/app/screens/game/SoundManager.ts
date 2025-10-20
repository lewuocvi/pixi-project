import { SimpleSound } from "./SimpleSound";

export class SoundManager {
  private static instance: SoundManager;
  private soundsLoaded: boolean = false;

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.soundsLoaded) return;

    await SimpleSound.init();

    // Load tất cả file âm thanh
    const soundFiles = [
      { name: "bgm-main", url: "/assets/main/sounds/bgm-main.mp3" },
      { name: "sfx-laser-gun", url: "/assets/main/sounds/sfx-laser-gun.mp3" },
      {
        name: "sfx-hit-the-target",
        url: "/assets/main/sounds/sfx-hit-the-target.mp3",
      },
      { name: "sfx-press", url: "/assets/main/sounds/sfx-press.mp3" },
      { name: "sfx-hover", url: "/assets/main/sounds/sfx-hover.mp3" },
      { name: "sfx-level-up", url: "/assets/main/sounds/sfx-level-up.mp3" },
    ];

    try {
      await Promise.all(
        soundFiles.map((sound) => SimpleSound.loadSound(sound.name, sound.url)),
      );
      this.soundsLoaded = true;
      console.log("All sounds loaded successfully");
    } catch (_e) {
      console.log("Some sounds failed to load");
    }
  }

  public unlock(): void {
    SimpleSound.unlock();
  }

  public isEnabled(): boolean {
    return SimpleSound.isEnabled();
  }

  // Game sounds
  public playShoot(): void {
    SimpleSound.play("sfx-laser-gun", 0.8);
  }

  public playHit(): void {
    SimpleSound.play("sfx-hit-the-target", 0.7);
  }

  public playCoin(): void {
    SimpleSound.play("sfx-press", 0.6);
  }

  public playHover(): void {
    SimpleSound.play("sfx-hover", 0.5);
  }

  public playLevelUp(): void {
    SimpleSound.play("sfx-level-up", 0.8);
  }

  public playBossDied(): void {
    SimpleSound.play("sfx-big-fish-died", 0.9);
  }

  public playBackgroundMusic(): void {
    SimpleSound.play("bgm-main", 0.3);
  }
}
