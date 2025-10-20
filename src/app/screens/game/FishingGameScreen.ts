import { Container, Graphics } from "pixi.js";
import { engine } from "../../getEngine";
import { FishManager } from "./FishManager";
import { Cannon } from "./Cannon";
import { BulletManager } from "./BulletManager";
import { CoinManager } from "./CoinManager";
import { GameUI } from "./GameUI";
import { Player } from "./Player";
import { SoundManager } from "./SoundManager";
import { LevelUpEffects } from "./LevelUpEffects";
import { MissionSystem } from "./MissionSystem";
import { AdvertisementManager } from "./AdvertisementManager";

export class FishingGameScreen extends Container {
  private fishManager!: FishManager;
  private cannon!: Cannon;
  private bulletManager!: BulletManager;
  private coinManager!: CoinManager;
  private gameUI!: GameUI;
  private background!: Graphics;
  private gameArea!: Container;
  private player!: Player;
  private levelUpEffects!: LevelUpEffects;
  private missionSystem!: MissionSystem;
  private isPaused: boolean = false;
  private resumeTime: number = 0; // Thời gian resume để ngăn bắn đạn ngay lập tức

  private gameRunning: boolean = true;

  constructor() {
    super();
    this.setupBackground();
    this.setupGameArea();
  }

  public async initialize(): Promise<void> {
    // Load advertisement data before initializing game components
    const adManager = AdvertisementManager.getInstance();
    await adManager.loadAdvertisementData();

    // Now initialize game components that depend on advertisement data
    this.setupGameComponents();

    // Initialize fish manager after advertisement data is loaded
    await this.fishManager.initialize();

    // Setup sound after gameUI is created
    await this.setupSound();

    // Setup event listeners after components are created
    this.setupEventListeners();
  }

  private setupBackground(): void {
    this.background = new Graphics();

    // Sử dụng toàn bộ kích thước màn hình
    const app = engine();
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    // Gradient background như bầu trời
    this.background.rect(0, 0, screenWidth, screenHeight);
    this.background.fill({ color: 0x87ceeb }); // Sky Blue - Xanh bầu trời nhạt
    this.addChild(this.background);

    // Tạo gradient từ xanh nhạt đến xanh đậm
    this.createSkyGradient();

    // Tạo hiệu ứng mây
    this.createCloudEffect();
  }

  private createSkyGradient(): void {
    const gradientGraphics = new Graphics();
    const app = engine();
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    // Gradient từ xanh nhạt ở trên xuống xanh đậm ở dưới
    for (let y = 0; y < screenHeight; y += 10) {
      const alpha = y / screenHeight;
      const color = this.interpolateColor(0x87ceeb, 0x4682b4, alpha); // Sky Blue -> Steel Blue

      gradientGraphics.rect(0, y, screenWidth, 10);
      gradientGraphics.fill({ color: color, alpha: 0.7 });
    }
    this.addChild(gradientGraphics);
  }

  private createCloudEffect(): void {
    const cloudGraphics = new Graphics();
    const app = engine();
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    // Tạo các đám mây nhẹ nhàng
    for (let i = 0; i < 5; i++) {
      const x = (i * screenWidth) / 5 + Math.random() * 100;
      const y = screenHeight * 0.2 + Math.random() * 100;
      const size = 30 + Math.random() * 40;

      cloudGraphics.circle(x, y, size);
      cloudGraphics.fill({ color: 0xffffff, alpha: 0.3 });
    }
    this.addChild(cloudGraphics);
  }

  private interpolateColor(
    color1: number,
    color2: number,
    factor: number,
  ): number {
    const r1 = (color1 >> 16) & 0xff;
    const g1 = (color1 >> 8) & 0xff;
    const b1 = color1 & 0xff;

    const r2 = (color2 >> 16) & 0xff;
    const g2 = (color2 >> 8) & 0xff;
    const b2 = color2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return (r << 16) | (g << 8) | b;
  }

  private setupGameArea(): void {
    this.gameArea = new Container();
    this.addChild(this.gameArea);
  }

  private setupGameComponents(): void {
    // Tạo người chơi
    this.player = new Player();

    // Khởi tạo hiệu ứng lên cấp
    this.levelUpEffects = new LevelUpEffects(this);

    // Khởi tạo hệ thống nhiệm vụ
    this.missionSystem = new MissionSystem();

    // Tạo các thành phần game
    this.fishManager = new FishManager();
    this.cannon = new Cannon();
    this.cannon.setPlayer(this.player); // Set player cho cannon
    this.bulletManager = new BulletManager();
    this.coinManager = new CoinManager();
    this.gameUI = new GameUI();
    this.gameUI.setPlayer(this.player); // Set Player cho GameUI
    this.gameUI.setCannon(this.cannon); // Set Cannon cho GameUI
    this.gameUI.setEventEmitter(this.gameUI); // Set EventEmitter cho GameUI
    this.cannon.setGameUI(this.gameUI); // Set GameUI cho cannon

    // Kết nối BulletManager với FishManager
    this.bulletManager.setFishManager(this.fishManager);

    this.gameArea.addChild(this.fishManager);
    this.gameArea.addChild(this.cannon);
    this.gameArea.addChild(this.bulletManager);
    this.gameArea.addChild(this.coinManager);
    this.addChild(this.gameUI);
    this.addChild(this.missionSystem);

    // Cập nhật UI ban đầu
    this.updateUI();
  }

  private setupEventListeners(): void {
    const app = engine();

    // Lắng nghe sự kiện bắn đạn
    this.cannon.addEventListener("shoot", (bullet: any) => {
      this.bulletManager.addBullet(bullet);
      // Cập nhật UI ngay sau khi bắn
      this.updateUI();
    });

    // Lắng nghe sự kiện va chạm đạn với đối tượng
    this.bulletManager.addEventListener(
      "targetHit",
      (target: any, bullet: any, targetDied: boolean) => {
        this.handleTargetHit(target, bullet, targetDied);
      },
    );

    // Lắng nghe sự kiện thu thập xu
    this.coinManager.addEventListener("coinCollected", (coin: any) => {
      this.handleCoinCollected(coin);
    });

    // Lắng nghe sự kiện pause/resume từ GameUI
    this.gameUI.on("pauseGame", () => {
      this.pauseGame();
    });

    this.gameUI.on("resumeGame", () => {
      this.resumeGame();
    });

    // Lắng nghe sự kiện click chuột để bắn
    app.stage.interactive = true;
    app.stage.on("pointerdown", (event) => {
      if (this.gameRunning && !this.isPaused) {
        // Kiểm tra thời gian resume để tránh bắn đạn ngay lập tức
        const timeSinceResume = Date.now() - this.resumeTime;
        if (timeSinceResume < 200) {
          // Không bắn trong 200ms sau khi resume
          return;
        }

        // Kiểm tra xem click có nằm trong nút điều chỉnh đạn không
        if (
          this.gameUI.isClickOnBulletButtons(event.global.x, event.global.y)
        ) {
          return; // Không bắn nếu click vào nút điều chỉnh
        }

        // Kiểm tra xem chuột có nằm dưới súng không
        const app = engine();
        const cannonY = app.screen.height - 80; // Vị trí Y của súng
        if (event.global.y > cannonY) {
          return; // Không bắn nếu chuột nằm dưới súng
        }

        // Bắt đầu bắn liên thanh khi giữ chuột
        this.cannon.startAutoShooting(event.global.x, event.global.y);
      }
    });

    // Lắng nghe sự kiện thả chuột để dừng bắn
    app.stage.on("pointerup", () => {
      if (this.gameRunning) {
        this.cannon.stopAutoShooting();
      }
    });

    // Lắng nghe sự kiện di chuyển chuột để xoay súng
    app.stage.on("pointermove", (event) => {
      if (this.gameRunning) {
        this.cannon.aim(event.global.x, event.global.y);
      }
    });
  }

  private handleTargetHit(target: any, bullet: any, targetDied: boolean): void {
    // Phát âm thanh bắn trúng
    this.playHitSound();

    // Tạo hiệu ứng nổ
    this.createExplosionEffect(target.x, target.y);

    // Xóa đạn
    this.bulletManager.removeBullet(bullet);

    // Nếu đối tượng chết
    if (targetDied) {
      // Ẩn tên đối tượng ngay lập tức khi chết
      this.hideTargetName(target);

      // Lấy phần thưởng từ đối tượng
      const reward = target.getReward();

      // Thêm xu và đạn
      this.player.addCoins(reward.coins);
      this.player.addAmmo(reward.ammo);

      // Hiệu ứng đặc biệt cho boss
      if (target.isBoss && target.isBoss()) {
        // Hiệu ứng nổ lớn cho boss
        this.createBossExplosionEffect(target.x, target.y);

        // Phát âm thanh đặc biệt
        this.playBossDefeatedSound();
      } else {
        // Hiệu ứng cộng xu và đạn bay vào UI bình thường
        this.gameUI.showCoinGain(reward.coins, target.x, target.y);
        this.gameUI.showAmmoGain(reward.ammo, target.x, target.y);
      }

      // Cập nhật tiến độ nhiệm vụ
      const missionCompleted = this.missionSystem.updateMissionProgress(
        target.targetType,
      );

      // Xóa đối tượng
      this.fishManager.removeTarget(target);

      // Kiểm tra hoàn thành nhiệm vụ (chỉ lên cấp khi hoàn thành nhiệm vụ)
      if (missionCompleted) {
        this.handleMissionCompleted();
      }
    }

    // Cập nhật UI
    this.updateUI();
  }

  private handleCoinCollected(coin: any): void {
    // Phát âm thanh thu thập xu
    this.playCoinSound();
    this.player.addCoins(coin.value);
    this.updateUI();
  }

  private handleLevelUp(): void {
    // Cập nhật player level
    this.bulletManager.setPlayerLevel(this.player.level);

    // Phát âm thanh lên cấp
    this.playLevelUpSound();

    // Hiển thị thông báo lên cấp với hiệu ứng đẹp mắt
    this.levelUpEffects.showLevelUpNotification(
      this.player.level,
      this.player.getBulletsPerShot(),
    );
  }

  private handleMissionCompleted(): void {
    // Lấy phần thưởng từ nhiệm vụ
    const reward = this.missionSystem.getMissionReward();
    if (reward) {
      // Thêm xu và đạn
      this.player.addCoins(reward.coins);
      this.player.addAmmo(reward.ammo);

      // Lên cấp khi hoàn thành nhiệm vụ
      this.player.levelUp();
      this.handleLevelUp();

      // Phát âm thanh hoàn thành nhiệm vụ
      if (this.gameUI.isSoundEnabled()) {
        SoundManager.getInstance().playLevelUp();
      }

      // Cập nhật UI
      this.updateUI();
    }
  }

  private playLevelUpSound(): void {
    // Phát âm thanh lên cấp
    if (this.gameUI.isSoundEnabled()) {
      SoundManager.getInstance().playLevelUp();
    }
  }

  private async setupSound(): Promise<void> {
    // Khởi tạo SoundManager
    await SoundManager.getInstance().initialize();

    // Tự động unlock âm thanh khi game khởi động
    SoundManager.getInstance().unlock();

    // Phát nhạc nền tự động
    setTimeout(() => {
      if (this.gameUI.isSoundEnabled()) {
        SoundManager.getInstance().playBackgroundMusic();
      }
    }, 1000); // Delay 1 giây để đảm bảo âm thanh đã load xong
  }

  private playHitSound(): void {
    // Phát âm thanh bắn trúng
    if (this.gameUI.isSoundEnabled()) {
      SoundManager.getInstance().playHit();
    }
  }

  private playCoinSound(): void {
    // Phát âm thanh thu thập xu
    if (this.gameUI.isSoundEnabled()) {
      SoundManager.getInstance().playCoin();
    }
  }

  private createExplosionEffect(x: number, y: number): void {
    // Tạo hiệu ứng nổ khi bắn trúng cá
    const explosion = new Graphics();
    explosion.circle(0, 0, 20);
    explosion.fill({ color: 0xff6600, alpha: 0.8 });
    explosion.x = x;
    explosion.y = y;

    this.gameArea.addChild(explosion);

    // Animation nổ
    const animate = () => {
      explosion.scale.x *= 1.2;
      explosion.scale.y *= 1.2;
      explosion.alpha *= 0.9;

      if (explosion.alpha > 0.1) {
        requestAnimationFrame(animate);
      } else {
        this.gameArea.removeChild(explosion);
        explosion.destroy();
      }
    };

    animate();
  }

  // Hiệu ứng nổ đặc biệt cho cá boss
  private createBossExplosionEffect(x: number, y: number): void {
    // Chỉ tạo mảnh vỡ bay ra khắp nơi
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const fragment = new Graphics();

        // Tạo mảnh vỡ với hình dạng ngẫu nhiên
        const fragmentType = Math.random();
        if (fragmentType < 0.3) {
          // Mảnh vuông nhỏ
          fragment.rect(-3, -3, 6, 6);
          fragment.fill({ color: 0xff6600, alpha: 0.9 });
        } else if (fragmentType < 0.6) {
          // Mảnh tròn nhỏ
          fragment.circle(0, 0, 4);
          fragment.fill({ color: 0xffaa00, alpha: 0.8 });
        } else if (fragmentType < 0.8) {
          // Mảnh dài
          fragment.rect(-2, -8, 4, 16);
          fragment.fill({ color: 0xff0000, alpha: 0.7 });
        } else {
          // Mảnh tam giác
          fragment.moveTo(0, -5);
          fragment.lineTo(-4, 4);
          fragment.lineTo(4, 4);
          fragment.closePath();
          fragment.fill({ color: 0xffff00, alpha: 0.8 });
        }

        const angle = (i * Math.PI * 2) / 30 + Math.random() * 0.3;
        const distance = 60 + Math.random() * 60;
        const speed = 4 + Math.random() * 5;

        fragment.x = x + Math.cos(angle) * distance;
        fragment.y = y + Math.sin(angle) * distance;

        this.gameArea.addChild(fragment);

        // Animation mảnh vỡ bay ra với hiệu ứng rơi
        const velocityX = Math.cos(angle) * speed;
        let velocityY = Math.sin(angle) * speed;
        const gravity = 0.08;

        const animateFragment = () => {
          fragment.x += velocityX;
          fragment.y += velocityY;
          velocityY += gravity; // Hiệu ứng rơi
          fragment.alpha *= 0.98;
          fragment.rotation += 0.12;

          if (fragment.alpha > 0.1) {
            requestAnimationFrame(animateFragment);
          } else {
            this.gameArea.removeChild(fragment);
            fragment.destroy();
          }
        };

        animateFragment();
      }, i * 25);
    }

    // Thêm các tia lửa bay ra
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const spark = new Graphics();
        spark.circle(0, 0, 2);
        spark.fill({ color: 0xffff00, alpha: 1 });

        const angle = (i * Math.PI * 2) / 20;
        const distance = 50 + Math.random() * 50;
        const speed = 5 + Math.random() * 4;

        spark.x = x + Math.cos(angle) * distance;
        spark.y = y + Math.sin(angle) * distance;

        this.gameArea.addChild(spark);

        // Animation tia lửa bay ra
        const animateSpark = () => {
          spark.x += Math.cos(angle) * speed;
          spark.y += Math.sin(angle) * speed;
          spark.alpha *= 0.96;
          spark.scale.x *= 0.99;
          spark.scale.y *= 0.99;

          if (spark.alpha > 0.1) {
            requestAnimationFrame(animateSpark);
          } else {
            this.gameArea.removeChild(spark);
            spark.destroy();
          }
        };

        animateSpark();
      }, i * 30);
    }
  }

  // Âm thanh đặc biệt khi đánh bại boss
  private playBossDefeatedSound(): void {
    // Sử dụng âm thanh boss chết đặc biệt
    SoundManager.getInstance().playBossDied();
  }

  private hideTargetName(target: any): void {
    // Ẩn tên đối tượng ngay lập tức khi chết
    if (target.nameText) {
      target.nameText.alpha = 0;
      target.nameText.visible = false;
    }
  }

  private updateUI(): void {
    this.gameUI.updateCoins(this.player.coins);
    this.gameUI.updateLevel(this.player.level);
    this.gameUI.updateAmmo(
      this.player.getAmmo(),
      this.player.getBulletsPerShot(),
    );

    // Cập nhật player level cho BulletManager
    this.bulletManager.setPlayerLevel(this.player.level);
  }

  public update(deltaTime: number): void {
    if (!this.gameRunning || this.isPaused) return;

    try {
      // Giới hạn deltaTime để tránh lag
      const clampedDeltaTime = Math.min(deltaTime, 50); // Max 50ms per frame

      this.fishManager.update(clampedDeltaTime);
      this.bulletManager.update(clampedDeltaTime);
      this.coinManager.update(clampedDeltaTime);
      this.cannon.update(clampedDeltaTime);
    } catch (error) {
      console.error("Error in game update:", error);
      this.gameRunning = false; // Dừng game nếu có lỗi
    }
  }

  // Tạm dừng game
  private pauseGame(): void {
    this.isPaused = true;
    console.log("Game paused");
  }

  // Tiếp tục game
  private resumeGame(): void {
    this.isPaused = false;
    this.resumeTime = Date.now(); // Lưu thời gian resume
    console.log("Game resumed");
  }

  public destroy(): void {
    const app = engine();
    app.stage.off("pointerdown");
    app.stage.off("pointerup");
    app.stage.off("pointermove");
    super.destroy();
  }
}
