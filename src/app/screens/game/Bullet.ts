import { Graphics, Container } from "pixi.js";

export class Bullet extends Container {
  public vx: number;
  public vy: number;
  public damage: number;
  public level: number;
  public life: number;
  public hit: boolean = false;
  private bulletGraphics: Graphics;
  private trailEffect: Graphics;
  private playerLevel: number;

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    damage: number = 1,
    playerLevel: number = 1,
  ) {
    super();

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.damage = damage; // Damage riêng biệt
    this.level = playerLevel;
    this.playerLevel = playerLevel;
    this.life = 5000; // 5 giây

    // Tạo graphics cho đạn
    this.bulletGraphics = new Graphics();
    this.trailEffect = new Graphics();
    this.addChild(this.trailEffect);
    this.addChild(this.bulletGraphics);

    // Thiết lập damage và vẻ ngoài dựa trên level
    this.setupBullet();
  }

  private setupBullet(): void {
    // Tính damage dựa trên bulletsPerShot và player level
    const baseDamage = this.getBaseDamageByLevel(this.level);
    const playerMultiplier = 1 + (this.playerLevel - 1) * 0.2; // +20% mỗi cấp
    this.damage = Math.floor(baseDamage * playerMultiplier);

    // Vẽ đạn theo bulletsPerShot
    switch (this.level) {
      case 1:
        this.drawBasicBullet();
        break;
      case 2:
        this.drawAdvancedBullet();
        break;
      case 3:
        this.drawExplosiveBullet();
        break;
      case 4:
        this.drawLaserBullet();
        break;
      case 5:
        this.drawLaserBullet(); // Cấp 5 cũng dùng laser
        break;
      default:
        this.drawBasicBullet();
    }

    // Tạo hiệu ứng trail
    this.createTrailEffect();
  }

  private getBaseDamageByLevel(level: number): number {
    switch (level) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
        return 4;
      case 4:
        return 8;
      case 5:
        return 12;
      default:
        return 1;
    }
  }

  private drawBasicBullet(): void {
    // Đạn cơ bản - màu xanh bầu trời với gradient
    this.bulletGraphics.clear();
    this.bulletGraphics.circle(0, 0, 5);
    this.bulletGraphics.fill({ color: 0x87ceeb }); // Sky Blue
    this.bulletGraphics.circle(0, 0, 3);
    this.bulletGraphics.fill({ color: 0x4682b4 }); // Steel Blue
    this.bulletGraphics.circle(0, 0, 1);
    this.bulletGraphics.fill({ color: 0xffffff }); // White
  }

  private drawAdvancedBullet(): void {
    // Đạn nâng cao - màu xanh hoàng gia với hiệu ứng xoay
    this.bulletGraphics.clear();
    this.bulletGraphics.circle(0, 0, 6);
    this.bulletGraphics.fill({ color: 0x4169e1 }); // Royal Blue
    this.bulletGraphics.circle(0, 0, 4);
    this.bulletGraphics.fill({ color: 0x1e90ff }); // Dodger Blue
    this.bulletGraphics.circle(0, 0, 2);
    this.bulletGraphics.fill({ color: 0x00bfff }); // Deep Sky Blue

    // Thêm vòng tròn xoay
    this.bulletGraphics.circle(3, 0, 1);
    this.bulletGraphics.fill({ color: 0xffffff });
    this.bulletGraphics.circle(-3, 0, 1);
    this.bulletGraphics.fill({ color: 0xffffff });
  }

  private drawExplosiveBullet(): void {
    // Đạn nổ - màu hoàng hôn với hiệu ứng lửa
    this.bulletGraphics.clear();
    this.bulletGraphics.circle(0, 0, 7);
    this.bulletGraphics.fill({ color: 0xff6347 }); // Tomato
    this.bulletGraphics.circle(0, 0, 5);
    this.bulletGraphics.fill({ color: 0xffa500 }); // Orange
    this.bulletGraphics.circle(0, 0, 3);
    this.bulletGraphics.fill({ color: 0xffd700 }); // Gold
    this.bulletGraphics.circle(0, 0, 1);
    this.bulletGraphics.fill({ color: 0xffffff }); // White

    // Thêm tia lửa
    this.bulletGraphics.rect(-8, -1, 16, 2);
    this.bulletGraphics.fill({ color: 0xffa500 }); // Orange
    this.bulletGraphics.rect(-1, -8, 2, 16);
    this.bulletGraphics.fill({ color: 0xffa500 }); // Orange
  }

  private drawLaserBullet(): void {
    // Đạn laser - màu xanh ngọc với hiệu ứng năng lượng
    this.bulletGraphics.clear();
    this.bulletGraphics.circle(0, 0, 8);
    this.bulletGraphics.fill({ color: 0x00ced1 }); // Dark Turquoise
    this.bulletGraphics.circle(0, 0, 6);
    this.bulletGraphics.fill({ color: 0x20b2aa }); // Light Sea Green
    this.bulletGraphics.circle(0, 0, 4);
    this.bulletGraphics.fill({ color: 0x40e0d0 }); // Turquoise
    this.bulletGraphics.circle(0, 0, 2);
    this.bulletGraphics.fill({ color: 0xffffff }); // White

    // Thêm tia năng lượng
    this.bulletGraphics.rect(-10, -2, 20, 4);
    this.bulletGraphics.fill({ color: 0x00ced1, alpha: 0.7 }); // Dark Turquoise
    this.bulletGraphics.rect(-2, -10, 4, 20);
    this.bulletGraphics.fill({ color: 0x00ced1, alpha: 0.7 }); // Dark Turquoise
  }

  private createTrailEffect(): void {
    // Tạo hiệu ứng trail dựa trên level đạn
    this.trailEffect.clear();

    switch (this.level) {
      case 1:
        // Trail đơn giản cho đạn cơ bản - màu xanh bầu trời
        this.trailEffect.circle(-10, 0, 3);
        this.trailEffect.fill({ color: 0x87ceeb, alpha: 0.5 }); // Sky Blue
        this.trailEffect.circle(-20, 0, 2);
        this.trailEffect.fill({ color: 0x87ceeb, alpha: 0.3 }); // Sky Blue
        break;
      case 2:
        // Trail xanh hoàng gia cho đạn nâng cao
        this.trailEffect.circle(-12, 0, 4);
        this.trailEffect.fill({ color: 0x4169e1, alpha: 0.6 }); // Royal Blue
        this.trailEffect.circle(-24, 0, 3);
        this.trailEffect.fill({ color: 0x4169e1, alpha: 0.4 }); // Royal Blue
        this.trailEffect.circle(-36, 0, 2);
        this.trailEffect.fill({ color: 0x4169e1, alpha: 0.2 }); // Royal Blue
        break;
      case 3:
        // Trail hoàng hôn cho đạn nổ
        this.trailEffect.circle(-15, 0, 5);
        this.trailEffect.fill({ color: 0xff6347, alpha: 0.7 }); // Tomato
        this.trailEffect.circle(-30, 0, 4);
        this.trailEffect.fill({ color: 0xffa500, alpha: 0.5 }); // Orange
        this.trailEffect.circle(-45, 0, 3);
        this.trailEffect.fill({ color: 0xffd700, alpha: 0.3 }); // Gold
        break;
      case 4:
        // Trail laser cho đạn laser - màu xanh ngọc
        this.trailEffect.rect(-20, -2, 20, 4);
        this.trailEffect.fill({ color: 0x00ced1, alpha: 0.8 }); // Dark Turquoise
        this.trailEffect.rect(-40, -1, 20, 2);
        this.trailEffect.fill({ color: 0x00ced1, alpha: 0.6 }); // Dark Turquoise
        this.trailEffect.rect(-60, -1, 20, 2);
        this.trailEffect.fill({ color: 0x00ced1, alpha: 0.4 }); // Dark Turquoise
        break;
    }
  }

  public update(deltaTime: number): void {
    this.x += this.vx * (deltaTime / 1000);
    this.y += this.vy * (deltaTime / 1000);
    this.life -= deltaTime;
  }

  public isDead(): boolean {
    return this.life <= 0 || this.hit;
  }
}
