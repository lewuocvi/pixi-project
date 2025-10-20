import { Graphics, Container, Text, TextStyle } from "pixi.js";

export interface TargetConfig {
  type: string;
  name: string;
  color: number;
  size: number;
  points: number;
  coinValue: number;
  ammoReward: number;
  speed: number;
  health: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  category: "fish" | "advertisement" | "boss";
}

export abstract class Target extends Container {
  public direction: number = 1; // 1 = phải, -1 = trái
  public speed: number = 50;
  public points: number = 10;
  public coinValue: number = 1;
  public ammoReward: number = 1;
  public targetType: string = "";
  public targetName: string = "";
  public maxHealth: number = 1;
  public currentHealth: number = 1;
  public healthBar: Graphics | null = null;
  public rarity: "common" | "uncommon" | "rare" | "epic" | "legendary" =
    "common";
  public category: "fish" | "advertisement" | "boss" = "fish";

  protected targetGraphics: Graphics;
  protected nameText: Text | null = null;
  protected config: TargetConfig;

  constructor(config: TargetConfig) {
    super();

    this.config = config;
    this.targetType = config.type;
    this.targetName = config.name;
    this.points = config.points;
    this.coinValue = config.coinValue;
    this.ammoReward = config.ammoReward;
    this.speed = config.speed;
    this.maxHealth = config.health;
    this.currentHealth = config.health;
    this.rarity = config.rarity;
    this.category = config.category;

    // Tạo graphics cho đối tượng
    this.targetGraphics = new Graphics();
    this.addChild(this.targetGraphics);

    this.setupTarget();
  }

  protected abstract setupTarget(): void;
  protected abstract drawTarget(): void;

  protected createHealthBar(): void {
    this.healthBar = new Graphics();
    this.updateHealthBar();
    this.addChild(this.healthBar);
  }

  protected updateHealthBar(): void {
    if (!this.healthBar) return;

    this.healthBar.clear();

    // Tính toán vị trí thanh máu dựa trên kích thước target
    const barWidth = this.config.size * 0.4; // 40% kích thước target
    const barHeight = 8;
    const barY = -this.config.size * 0.5 - 15; // Phía trên target

    // Background của thanh máu
    this.healthBar.rect(-barWidth / 2, barY, barWidth, barHeight);
    this.healthBar.fill({ color: 0x333333 });

    // Thanh máu hiện tại
    const healthPercentage = this.currentHealth / this.maxHealth;
    const healthColor = this.getHealthBarColor(healthPercentage);

    this.healthBar.rect(
      -barWidth / 2,
      barY,
      barWidth * healthPercentage,
      barHeight,
    );
    this.healthBar.fill({ color: healthColor });

    // Viền thanh máu
    this.healthBar.rect(-barWidth / 2, barY, barWidth, barHeight);
    this.healthBar.stroke({ color: 0xffffff, width: 1 });
  }

  protected getHealthBarColor(percentage: number): number {
    if (percentage > 0.6) return 0x00ff00; // Xanh lá
    if (percentage > 0.3) return 0xffff00; // Vàng
    return 0xff0000; // Đỏ
  }

  protected createNameDisplay(): void {
    this.nameText = new Text({
      text: this.targetName,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 12,
        fill: this.getRarityColor(),
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 2 },
        dropShadow: {
          color: 0x000000,
          blur: 2,
          angle: Math.PI / 4,
          distance: 1,
        },
      }),
    });

    this.nameText.anchor.set(0.5);
    this.nameText.x = 0;
    this.nameText.y = -this.config.size * 0.5 - 35; // Phía trên thanh máu
    this.addChild(this.nameText);
  }

  protected getRarityColor(): number {
    switch (this.rarity) {
      case "common":
        return 0xffffff;
      case "uncommon":
        return 0x00ff00;
      case "rare":
        return 0x0088ff;
      case "epic":
        return 0xaa00ff;
      case "legendary":
        return 0xffaa00;
      default:
        return 0xffffff;
    }
  }

  public takeDamage(damage: number): boolean {
    this.currentHealth -= damage;
    this.currentHealth = Math.max(0, this.currentHealth);

    // Cập nhật thanh máu
    if (this.healthBar && this.maxHealth > 1) {
      this.updateHealthBar();
    }

    // Trả về true nếu đối tượng chết
    return this.currentHealth <= 0;
  }

  public getReward(): { coins: number; ammo: number } {
    return {
      coins: this.coinValue,
      ammo: this.ammoReward,
    };
  }

  public isBoss(): boolean {
    return this.rarity === "legendary";
  }

  public update(deltaTime: number): void {
    // Di chuyển đối tượng
    this.x += this.direction * this.speed * (deltaTime / 1000);

    // Hiệu ứng di chuyển (chỉ khi không phải quảng cáo cố định)
    if (this.speed > 0) {
      this.y += Math.sin(this.x * 0.01) * 0.5;
      this.rotation = Math.sin(this.x * 0.02) * 0.1;
      this.scale.y = 1 + Math.sin(this.x * 0.03) * 0.1;
    }

    // Animation tên
    if (this.nameText) {
      this.nameText.y =
        -this.config.size * 0.5 - 35 + Math.sin(this.x * 0.05) * 2;
      this.nameText.alpha = 0.8 + Math.sin(this.x * 0.08) * 0.2;
    }

    // Animation đặc biệt cho boss (chỉ khi không phải quảng cáo cố định)
    if (this.isBoss() && this.speed > 0) {
      this.alpha = 0.8 + Math.sin(this.x * 0.1) * 0.2;
      this.targetGraphics.rotation = Math.sin(this.x * 0.05) * 0.2;
      this.scale.x = 1 + Math.sin(this.x * 0.08) * 0.1;
    }
  }

  public getBounds(): any {
    // Tính toán bounding box dựa trên kích thước thực tế của target
    const width = this.config.size * 1.2; // Banner width
    const height = this.config.size * 0.8; // Banner height

    return {
      x: this.x - width / 2,
      y: this.y - height / 2,
      width: width,
      height: height,
    };
  }

  public hideName(): void {
    if (this.nameText) {
      this.nameText.alpha = 0;
      this.nameText.visible = false;
    }
  }
}
