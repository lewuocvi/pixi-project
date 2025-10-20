import { Graphics, Container } from "pixi.js";
import { EventEmitter } from "events";
import { SoundManager } from "./SoundManager";
import { engine } from "../../getEngine";
import { Player } from "./Player";

export class Cannon extends Container {
  private cannonBody!: Graphics;
  private cannonBarrel!: Container;
  private cannonAngle: number = 0;
  private shootCooldown: number = 0;
  private shootInterval: number = 200; // 200ms giữa các lần bắn (nhanh hơn)
  private isAutoShooting: boolean = false; // Bắn liên thanh
  private eventEmitter: EventEmitter;
  private player!: Player;
  private gameUI: any;

  constructor() {
    super();
    this.eventEmitter = new EventEmitter();
    this.setupCannon();
  }

  public setPlayer(player: Player): void {
    this.player = player;
  }

  public setGameUI(gameUI: any): void {
    this.gameUI = gameUI;
  }

  private setupCannon(): void {
    // Vị trí súng ở giữa màn hình (responsive)
    const app = engine();
    this.x = app.screen.width / 2; // Giữa màn hình
    this.y = app.screen.height - 80; // 80px từ dưới

    // Thân súng chính (hình chữ nhật bo góc) - màu cam như trong ảnh
    this.cannonBody = new Graphics();

    // Thân súng chính
    this.cannonBody.rect(-40, -25, 80, 50);
    this.cannonBody.fill({ color: 0xff6600 });
    this.cannonBody.stroke({ color: 0xcc4400, width: 3 });

    // Chi tiết thân súng
    this.cannonBody.rect(-38, -23, 76, 46);
    this.cannonBody.fill({ color: 0xff8800 });

    // Vòng tròn ở giữa thân súng (sight)
    this.cannonBody.circle(0, 0, 20);
    this.cannonBody.fill({ color: 0xcc4400 });
    this.cannonBody.circle(0, 0, 18);
    this.cannonBody.fill({ color: 0xff6600 });
    this.cannonBody.circle(0, 0, 15);
    this.cannonBody.fill({ color: 0xffffff });
    this.cannonBody.circle(0, 0, 12);
    this.cannonBody.fill({ color: 0x000000 });

    // Chi tiết kim loại
    this.cannonBody.rect(-35, -20, 70, 4);
    this.cannonBody.fill({ color: 0xffaa00 });
    this.cannonBody.rect(-35, 16, 70, 4);
    this.cannonBody.fill({ color: 0xffaa00 });

    // Chi tiết dọc
    this.cannonBody.rect(-3, -23, 6, 46);
    this.cannonBody.fill({ color: 0xcc4400 });

    this.addChild(this.cannonBody);

    // Nòng súng (hình trụ dài với chi tiết) - màu cam
    this.cannonBarrel = new Container();

    // Nòng súng chính
    const barrelMain = new Graphics();
    barrelMain.rect(0, -8, 80, 16);
    barrelMain.fill({ color: 0xff6600 });
    barrelMain.stroke({ color: 0xcc4400, width: 2 });
    this.cannonBarrel.addChild(barrelMain);

    // Chi tiết nòng súng
    const barrelDetail = new Graphics();
    barrelDetail.rect(2, -6, 76, 12);
    barrelDetail.fill({ color: 0xff8800 });
    this.cannonBarrel.addChild(barrelDetail);

    // Vòng kim loại ở đầu nòng
    const barrelRing = new Graphics();
    barrelRing.rect(75, -10, 12, 20);
    barrelRing.fill({ color: 0xffaa00 });
    barrelRing.stroke({ color: 0xcc4400, width: 1 });
    this.cannonBarrel.addChild(barrelRing);

    // Lỗ nòng súng
    const barrelHole = new Graphics();
    barrelHole.circle(81, 0, 4);
    barrelHole.fill({ color: 0x000000 });
    this.cannonBarrel.addChild(barrelHole);

    // Chi tiết vòng tròn trên nòng
    const barrelCircles = new Graphics();
    barrelCircles.circle(20, 0, 5);
    barrelCircles.fill({ color: 0xcc4400 });
    barrelCircles.circle(40, 0, 5);
    barrelCircles.fill({ color: 0xcc4400 });
    barrelCircles.circle(60, 0, 5);
    barrelCircles.fill({ color: 0xcc4400 });
    this.cannonBarrel.addChild(barrelCircles);

    this.addChild(this.cannonBarrel);

    // Bệ súng (chân đỡ) - màu cam
    const cannonBase = new Graphics();
    cannonBase.rect(-50, 25, 100, 30);
    cannonBase.fill({ color: 0xff6600 });
    cannonBase.stroke({ color: 0xcc4400, width: 3 });

    // Chi tiết bệ súng
    cannonBase.rect(-48, 27, 96, 26);
    cannonBase.fill({ color: 0xff8800 });

    // Vòng tròn ở bệ súng
    cannonBase.circle(0, 40, 12);
    cannonBase.fill({ color: 0xcc4400 });
    cannonBase.circle(0, 40, 10);
    cannonBase.fill({ color: 0xff6600 });

    // Chi tiết chân đỡ
    cannonBase.rect(-45, 35, 90, 6);
    cannonBase.fill({ color: 0xcc4400 });

    this.addChild(cannonBase);

    // Nút điều chỉnh sức mạnh (+)
    const plusButton = new Graphics();
    plusButton.circle(-60, 0, 15);
    plusButton.fill({ color: 0x00ff00 });
    plusButton.stroke({ color: 0x00cc00, width: 2 });

    // Dấu +
    plusButton.rect(-3, -8, 6, 16);
    plusButton.fill({ color: 0xffffff });
    plusButton.rect(-8, -3, 16, 6);
    plusButton.fill({ color: 0xffffff });

    this.addChild(plusButton);

    // Nút điều chỉnh sức mạnh (-)
    const minusButton = new Graphics();
    minusButton.circle(60, 0, 15);
    minusButton.fill({ color: 0xff0000 });
    minusButton.stroke({ color: 0xcc0000, width: 2 });

    // Dấu -
    minusButton.rect(-8, -3, 16, 6);
    minusButton.fill({ color: 0xffffff });

    this.addChild(minusButton);

    // Hiệu ứng ánh sáng trên nòng súng
    const lightContainer = new Container();
    const lightEffect = new Graphics();
    lightEffect.rect(0, -2, 70, 4);
    lightEffect.fill({ color: 0x87ceeb, alpha: 0.3 });
    lightContainer.addChild(lightEffect);
    this.cannonBarrel.addChild(lightContainer);

    // Bóng đổ cho thân súng
    const shadow = new Graphics();
    shadow.ellipse(0, 25, 35, 8);
    shadow.fill({ color: 0x000000, alpha: 0.3 });
    this.addChildAt(shadow, 0);

    // Đặt anchor point ở cuối nòng súng
    this.cannonBarrel.x = 25;
  }

  public aim(targetX: number, targetY: number): void {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    this.cannonAngle = Math.atan2(dy, dx);

    // Xoay nòng súng (Container có thể xoay)
    this.cannonBarrel.rotation = this.cannonAngle;
  }

  public shoot(targetX: number, targetY: number): void {
    if (this.shootCooldown > 0) return;
    if (!this.player || !this.player.canShoot()) {
      // Hiển thị hội thoại mua đạn khi hết đạn
      if (this.gameUI) {
        this.gameUI.showBuyAmmoDialog();
      }
      return; // Kiểm tra đạn
    }

    this.aim(targetX, targetY);

    // Trừ đạn
    this.player.shoot();

    // Tạo hiệu ứng lửa khi bắn
    this.createMuzzleFlash();

    // Lấy số đạn bắn ra
    const bulletsPerShot = this.gameUI ? this.gameUI.getBulletsPerShot() : 1;

    // Tạo nhiều viên đạn
    const barrelLength = 80; // Chiều dài nòng súng mới
    const barrelOffset = 40; // Offset của nòng súng mới

    for (let i = 0; i < bulletsPerShot; i++) {
      // Tính góc spread cho từng viên đạn
      const spreadAngle =
        this.cannonAngle + (i - (bulletsPerShot - 1) / 2) * 0.1; // Spread 0.1 radian

      const bullet = {
        x: this.x + Math.cos(this.cannonAngle) * (barrelOffset + barrelLength),
        y: this.y + Math.sin(this.cannonAngle) * (barrelOffset + barrelLength),
        vx: Math.cos(spreadAngle) * 800, // Vận tốc đạn
        vy: Math.sin(spreadAngle) * 800,
        angle: spreadAngle,
        damage: 1, // Mỗi viên đạn gây 1 damage
      };

      this.eventEmitter.emit("shoot", bullet);
    }

    this.shootCooldown = this.shootInterval;

    // Phát âm thanh bắn
    this.playShootSound();
  }

  // Bắn liên thanh
  public startAutoShooting(targetX: number, targetY: number): void {
    this.isAutoShooting = true;
    this.aim(targetX, targetY);
  }

  // Dừng bắn liên thanh
  public stopAutoShooting(): void {
    this.isAutoShooting = false;
  }

  public update(deltaTime: number): void {
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }

    // Bắn liên thanh nếu đang trong chế độ auto shooting
    if (this.isAutoShooting && this.shootCooldown <= 0) {
      // Sử dụng góc hiện tại để bắn
      this.shoot(
        this.x + Math.cos(this.cannonAngle) * 1000,
        this.y + Math.sin(this.cannonAngle) * 1000,
      );
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

  private playShootSound(): void {
    // Phát âm thanh bắn đạn
    SoundManager.getInstance().playShoot();
  }

  private createMuzzleFlash(): void {
    // Tạo hiệu ứng lửa ở đầu nòng súng
    const muzzleFlash = new Graphics();

    // Lửa chính
    muzzleFlash.circle(0, 0, 8);
    muzzleFlash.fill({ color: 0xff4500 });

    // Lửa phụ
    muzzleFlash.circle(-3, -2, 4);
    muzzleFlash.fill({ color: 0xffd700 });
    muzzleFlash.circle(3, 2, 4);
    muzzleFlash.fill({ color: 0xffd700 });
    muzzleFlash.circle(0, 3, 3);
    muzzleFlash.fill({ color: 0xffff00 });

    // Đặt vị trí ở đầu nòng súng
    const barrelLength = 80;
    const barrelOffset = 40;
    muzzleFlash.x =
      this.x + Math.cos(this.angle) * (barrelOffset + barrelLength);
    muzzleFlash.y =
      this.y + Math.sin(this.angle) * (barrelOffset + barrelLength);
    muzzleFlash.rotation = this.angle;

    this.parent?.addChild(muzzleFlash);

    // Xóa hiệu ứng sau 100ms
    setTimeout(() => {
      if (muzzleFlash.parent) {
        muzzleFlash.parent.removeChild(muzzleFlash);
        muzzleFlash.destroy();
      }
    }, 100);
  }
}
