import { Container } from "pixi.js";
import { EventEmitter } from "events";
import { FishManager } from "./FishManager";
import { Bullet } from "./Bullet";
import { Target } from "./Target";
import { engine } from "../../getEngine";

export class BulletManager extends Container {
  private bullets: Bullet[] = [];
  private fishManager: FishManager | null = null;
  private eventEmitter: EventEmitter;
  private maxBullets: number = 200; // Tăng giới hạn số đạn tối đa để hỗ trợ bắn nhiều đạn
  private playerLevel: number = 1;
  private hitboxPadding: number = 15; // Padding cho hitbox để dễ bắn trúng viền

  constructor() {
    super();
    this.eventEmitter = new EventEmitter();
  }

  public setFishManager(fishManager: FishManager): void {
    this.fishManager = fishManager;
  }

  public addBullet(bulletData: any): void {
    // Kiểm tra giới hạn số đạn
    if (this.bullets.length >= this.maxBullets) {
      // Xóa đạn cũ nhất nếu đã đạt giới hạn (chỉ khi thực sự cần)
      const oldestBullet = this.bullets[0];
      this.removeBullet(oldestBullet);
    }

    const bullet = new Bullet(
      bulletData.x,
      bulletData.y,
      bulletData.vx,
      bulletData.vy,
      bulletData.damage || 1, // Sử dụng damage từ bulletData
      this.playerLevel,
    );

    this.addChild(bullet);
    this.bullets.push(bullet);
  }

  public setBulletLevel(level: number): void {
    this.playerLevel = Math.min(level, 4); // Tối đa level 4
  }

  public update(deltaTime: number): void {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];

      try {
        // Cập nhật đạn
        bullet.update(deltaTime);

        // Kiểm tra va chạm với cá (chỉ nếu chưa va chạm)
        if (this.fishManager && !bullet.hit) {
          this.checkCollisions(bullet);
        }

        // Xóa đạn nếu hết thời gian sống hoặc ra khỏi màn hình
        const app = engine();
        if (
          bullet.life <= 0 || // Chỉ xóa khi hết thời gian sống
          bullet.x < -50 ||
          bullet.x > app.screen.width + 50 ||
          bullet.y < -50 ||
          bullet.y > app.screen.height + 50
        ) {
          this.removeBullet(bullet);
        }
      } catch (error) {
        console.error("Error updating bullet:", error);
        this.removeBullet(bullet);
      }
    }
  }

  private checkCollisions(bullet: Bullet): void {
    if (!this.fishManager) return;

    const targets = this.fishManager.getTargets();

    for (const target of targets) {
      // Kiểm tra collision với bounding box của target
      if (this.isBulletHittingTarget(bullet, target)) {
        bullet.hit = true; // Đánh dấu đã va chạm

        // Gây damage cho đối tượng
        const targetDied = target.takeDamage(bullet.damage);

        this.eventEmitter.emit("targetHit", target, bullet, targetDied);
        return; // Quan trọng: return ngay sau khi emit để tránh xử lý nhiều collision
      }
    }
  }

  private isBulletHittingTarget(bullet: Bullet, target: Target): boolean {
    // Lấy bounding box của target
    const targetBounds = target.getBounds();

    // Tính toán hitbox mở rộng để dễ bắn trúng viền
    const left = targetBounds.x - this.hitboxPadding;
    const right = targetBounds.x + targetBounds.width + this.hitboxPadding;
    const top = targetBounds.y - this.hitboxPadding;
    const bottom = targetBounds.y + targetBounds.height + this.hitboxPadding;

    // Kiểm tra xem bullet có nằm trong hitbox không
    return (
      bullet.x >= left &&
      bullet.x <= right &&
      bullet.y >= top &&
      bullet.y <= bottom
    );
  }

  public setHitboxPadding(padding: number): void {
    this.hitboxPadding = padding;
  }

  public getHitboxPadding(): number {
    return this.hitboxPadding;
  }

  public drawHitboxDebug(target: Target): void {
    // Phương thức để debug hitbox (có thể gọi từ console)
    const bounds = target.getBounds();
    const left = bounds.x - this.hitboxPadding;
    const right = bounds.x + bounds.width + this.hitboxPadding;
    const top = bounds.y - this.hitboxPadding;
    const bottom = bounds.y + bounds.height + this.hitboxPadding;

    console.log(`Hitbox for ${target.targetType}:`, {
      originalBounds: bounds,
      hitboxBounds: { left, right, top, bottom },
      padding: this.hitboxPadding,
    });
  }

  public removeBullet(bullet: Bullet): void {
    const index = this.bullets.indexOf(bullet);
    if (index > -1) {
      this.bullets.splice(index, 1);
      this.removeChild(bullet);
      bullet.destroy();
    }
  }

  public addEventListener(
    event: string,
    listener: (...args: any[]) => void,
  ): void {
    this.eventEmitter.on(event, listener);
  }

  public removeEventListener(
    event: string,
    listener: (...args: any[]) => void,
  ): void {
    this.eventEmitter.off(event, listener);
  }

  public setPlayerLevel(level: number): void {
    this.playerLevel = level;
  }
}
