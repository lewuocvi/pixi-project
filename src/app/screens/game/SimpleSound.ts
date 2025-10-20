export class SimpleSound {
  private static sounds: Map<string, HTMLAudioElement> = new Map();
  private static isUnlocked: boolean = false;

  public static async init(): Promise<void> {
    // Không cần khởi tạo gì với HTML5 Audio
  }

  public static async unlock(): Promise<void> {
    this.isUnlocked = true;
  }

  public static async loadSound(name: string, url: string): Promise<void> {
    try {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.volume = 1.0;
      this.sounds.set(name, audio);
    } catch (_e) {
      console.log(`Failed to load sound: ${name}`);
    }
  }

  public static play(name: string, volume: number = 1.0): void {
    if (!this.isUnlocked) return;

    const audio = this.sounds.get(name);
    if (!audio) return;

    try {
      // Clone audio để có thể phát nhiều lần cùng lúc
      const audioClone = audio.cloneNode() as HTMLAudioElement;
      audioClone.volume = volume;
      audioClone.play().catch(() => {
        // Không cần log lỗi
      });
    } catch (_e) {
      // Không cần log lỗi
    }
  }

  public static isEnabled(): boolean {
    return this.isUnlocked;
  }
}
