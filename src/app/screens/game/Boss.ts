import { Target, TargetConfig } from "./Target";
import { Graphics, Text, TextStyle } from "pixi.js";

export class Boss extends Target {
  constructor(bossType?: string) {
    const config = Boss.getBossConfig(bossType);
    super(config);
  }

  protected setupTarget(): void {
    this.drawBoss();
    this.createBossName();
    this.createBossHealthBar();
  }

  protected drawTarget(): void {
    // Method này được gọi từ Target constructor
    // Logic đã được chuyển vào drawBoss()
    this.drawBoss();
  }

  private drawBoss(): void {
    const size = this.config.size;
    const color = this.config.color;

    // Vẽ thân người boss
    this.drawHumanBody(size, color);

    // Vẽ hiệu ứng ánh sáng xung quanh boss
    this.drawBossAura();
  }

  private drawHumanBody(size: number, color: number): void {
    // Kiểm tra nếu là Nghĩa_Mập thì vẽ body mập hơn
    if (this.config.type === "nghia_map") {
      this.drawFatBody(size, color);
    } else {
      this.drawNormalBody(size, color);
    }

    // Vẽ mắt boss
    this.drawBossEyes(size);

    // Vẽ miệng boss (cười ác)
    this.drawBossMouth(size);

    // Vẽ tóc boss (kiểu tóc dựng đứng)
    this.drawBossHair(size, color);

    // Vẽ đặc điểm đặc biệt cho từng boss
    this.drawBossSpecialFeatures(size, color);

    // Vẽ vũ khí boss
    this.drawBossWeapon(size);
  }

  private drawNormalBody(size: number, color: number): void {
    const scale = size / 60;

    // Vẽ đầu (hình tròn)
    const headRadius = 8 * scale;
    this.targetGraphics.circle(0, -15 * scale, headRadius);
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ thân (hình chữ nhật bo tròn)
    const bodyWidth = 12 * scale;
    const bodyHeight = 20 * scale;
    this.targetGraphics.roundRect(
      -bodyWidth / 2,
      -5 * scale,
      bodyWidth,
      bodyHeight,
      3,
    );
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ tay trái
    this.targetGraphics.roundRect(-10 * scale, 0, 6 * scale, 15 * scale, 2);
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ tay phải
    this.targetGraphics.roundRect(4 * scale, 0, 6 * scale, 15 * scale, 2);
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ chân trái
    this.targetGraphics.roundRect(
      -4 * scale,
      15 * scale,
      5 * scale,
      12 * scale,
      2,
    );
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ chân phải
    this.targetGraphics.roundRect(
      -1 * scale,
      15 * scale,
      5 * scale,
      12 * scale,
      2,
    );
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });
  }

  private drawFatBody(size: number, color: number): void {
    const scale = size / 60;

    // Vẽ đầu mập hơn (hình tròn lớn hơn)
    const headRadius = 10 * scale; // Đầu to hơn
    this.targetGraphics.circle(0, -15 * scale, headRadius);
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ thân mập (hình oval rộng)
    const bodyWidth = 20 * scale; // Rộng gần gấp đôi
    const bodyHeight = 25 * scale; // Cao hơn
    this.targetGraphics.ellipse(0, 2 * scale, bodyWidth / 2, bodyHeight / 2);
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ tay mập hơn
    this.targetGraphics.roundRect(-12 * scale, 0, 8 * scale, 18 * scale, 3);
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    this.targetGraphics.roundRect(4 * scale, 0, 8 * scale, 18 * scale, 3);
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ chân mập hơn
    this.targetGraphics.roundRect(
      -6 * scale,
      18 * scale,
      7 * scale,
      15 * scale,
      3,
    );
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    this.targetGraphics.roundRect(
      -1 * scale,
      18 * scale,
      7 * scale,
      15 * scale,
      3,
    );
    this.targetGraphics.fill({ color: color, alpha: 0.9 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ bụng bia to
    this.targetGraphics.ellipse(0, 8 * scale, 12 * scale, 8 * scale);
    this.targetGraphics.fill({ color: color, alpha: 0.8 });
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ ngực mập
    this.targetGraphics.ellipse(-4 * scale, -2 * scale, 6 * scale, 4 * scale);
    this.targetGraphics.fill({ color: color, alpha: 0.8 });
    this.targetGraphics.stroke({ color: 0x000000, width: 1 });

    this.targetGraphics.ellipse(4 * scale, -2 * scale, 6 * scale, 4 * scale);
    this.targetGraphics.fill({ color: color, alpha: 0.8 });
    this.targetGraphics.stroke({ color: 0x000000, width: 1 });
  }

  private drawBossWeapon(size: number): void {
    const scale = size / 60;

    // Vẽ kiếm trong tay phải
    this.targetGraphics.moveTo(8 * scale, 5 * scale);
    this.targetGraphics.lineTo(12 * scale, 5 * scale);
    this.targetGraphics.stroke({ color: 0xcccccc, width: 2 });

    // Vẽ lưỡi kiếm
    this.targetGraphics.moveTo(10 * scale, 5 * scale);
    this.targetGraphics.lineTo(10 * scale, -5 * scale);
    this.targetGraphics.stroke({ color: 0xcccccc, width: 3 });

    // Vẽ chuôi kiếm
    this.targetGraphics.moveTo(8 * scale, 5 * scale);
    this.targetGraphics.lineTo(8 * scale, 8 * scale);
    this.targetGraphics.stroke({ color: 0x8b4513, width: 2 });

    // Vẽ tay cầm kiếm
    this.targetGraphics.roundRect(
      7 * scale,
      6 * scale,
      2 * scale,
      3 * scale,
      1,
    );
    this.targetGraphics.fill({ color: 0x8b4513, alpha: 0.8 });
  }

  private drawBossSpecialFeatures(size: number, _color: number): void {
    switch (this.config.type) {
      case "pham_kha_di":
        // Vẽ râu quai nón cho Phạm Khả Di
        this.drawBeard(size);
        // Vẽ áo khoác đặc biệt
        this.drawSpecialCoat(size, 0x444444);
        break;

      case "tran_van_nghia":
        // Vẽ kính mắt cho Trần Văn Nghĩa
        this.drawGlasses(size);
        // Vẽ áo vest
        this.drawSpecialCoat(size, 0x222222);
        break;

      case "nghia_map":
        // Vẽ áo phông rộng cho Nghĩa_Mập (bụng đã được vẽ trong drawFatBody)
        this.drawSpecialCoat(size, 0x666666);
        // Vẽ thêm chi tiết mập
        this.drawFatDetails(size);
        break;
    }
  }

  private drawBeard(size: number): void {
    const scale = size / 60;

    // Vẽ râu quai nón
    this.targetGraphics.moveTo(-4 * scale, -5 * scale);
    this.targetGraphics.quadraticCurveTo(0, -2 * scale, 4 * scale, -5 * scale);
    this.targetGraphics.stroke({ color: 0x000000, width: 3 });

    // Vẽ râu dưới cằm
    this.targetGraphics.moveTo(-2 * scale, -5 * scale);
    this.targetGraphics.lineTo(-1 * scale, 0);
    this.targetGraphics.lineTo(0, -5 * scale);
    this.targetGraphics.lineTo(1 * scale, 0);
    this.targetGraphics.lineTo(2 * scale, -5 * scale);
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });
  }

  private drawGlasses(size: number): void {
    const scale = size / 60;

    // Vẽ kính mắt
    this.targetGraphics.circle(-3 * scale, -12 * scale, 3 * scale);
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    this.targetGraphics.circle(3 * scale, -12 * scale, 3 * scale);
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ cầu nối kính
    this.targetGraphics.moveTo(0, -12 * scale);
    this.targetGraphics.lineTo(0, -12 * scale);
    this.targetGraphics.stroke({ color: 0x000000, width: 1 });
  }

  private drawFatDetails(size: number): void {
    const scale = size / 60;

    // Vẽ nếp nhăn trên bụng
    for (let i = 0; i < 3; i++) {
      this.targetGraphics.moveTo(-8 * scale + i * 4 * scale, 6 * scale);
      this.targetGraphics.lineTo(-6 * scale + i * 4 * scale, 8 * scale);
      this.targetGraphics.stroke({ color: 0x000000, width: 1 });
    }

    // Vẽ cằm đôi
    this.targetGraphics.ellipse(0, -5 * scale, 4 * scale, 2 * scale);
    this.targetGraphics.fill({ color: this.config.color, alpha: 0.7 });
    this.targetGraphics.stroke({ color: 0x000000, width: 1 });

    // Vẽ má phúng phính
    this.targetGraphics.circle(-6 * scale, -8 * scale, 3 * scale);
    this.targetGraphics.fill({ color: this.config.color, alpha: 0.8 });
    this.targetGraphics.stroke({ color: 0x000000, width: 1 });

    this.targetGraphics.circle(6 * scale, -8 * scale, 3 * scale);
    this.targetGraphics.fill({ color: this.config.color, alpha: 0.8 });
    this.targetGraphics.stroke({ color: 0x000000, width: 1 });
  }

  private drawSpecialCoat(size: number, coatColor: number): void {
    const scale = size / 60;

    // Kiểm tra nếu là Nghĩa_Mập thì vẽ áo rộng hơn
    if (this.config.type === "nghia_map") {
      // Vẽ áo phông rộng cho Nghĩa_Mập
      this.targetGraphics.roundRect(
        -10 * scale,
        -3 * scale,
        20 * scale,
        22 * scale,
        3,
      );
      this.targetGraphics.fill({ color: coatColor, alpha: 0.6 });
      this.targetGraphics.stroke({ color: 0x000000, width: 1 });

      // Vẽ cổ áo rộng
      this.targetGraphics.roundRect(
        -5 * scale,
        -8 * scale,
        10 * scale,
        6 * scale,
        2,
      );
      this.targetGraphics.fill({ color: coatColor, alpha: 0.6 });
      this.targetGraphics.stroke({ color: 0x000000, width: 1 });

      // Vẽ tay áo rộng
      this.targetGraphics.roundRect(-14 * scale, 0, 10 * scale, 20 * scale, 3);
      this.targetGraphics.fill({ color: coatColor, alpha: 0.6 });
      this.targetGraphics.stroke({ color: 0x000000, width: 1 });

      this.targetGraphics.roundRect(4 * scale, 0, 10 * scale, 20 * scale, 3);
      this.targetGraphics.fill({ color: coatColor, alpha: 0.6 });
      this.targetGraphics.stroke({ color: 0x000000, width: 1 });
    } else {
      // Vẽ áo khoác/vest bình thường
      this.targetGraphics.roundRect(
        -7 * scale,
        -3 * scale,
        14 * scale,
        18 * scale,
        2,
      );
      this.targetGraphics.fill({ color: coatColor, alpha: 0.7 });
      this.targetGraphics.stroke({ color: 0x000000, width: 1 });

      // Vẽ cổ áo
      this.targetGraphics.roundRect(
        -3 * scale,
        -8 * scale,
        6 * scale,
        5 * scale,
        1,
      );
      this.targetGraphics.fill({ color: coatColor, alpha: 0.7 });
      this.targetGraphics.stroke({ color: 0x000000, width: 1 });
    }
  }

  private drawBossHair(size: number, _color: number): void {
    const scale = size / 60;
    const hairColor = this.getHairColor();

    // Vẽ tóc dựng đứng (kiểu mohawk)
    for (let i = 0; i < 5; i++) {
      const x = -6 * scale + i * 3 * scale;
      const y = -25 * scale;
      const height = 8 * scale;

      this.targetGraphics.moveTo(x, y);
      this.targetGraphics.lineTo(x + 1 * scale, y - height);
      this.targetGraphics.lineTo(x + 2 * scale, y);
      this.targetGraphics.closePath();
      this.targetGraphics.fill({ color: hairColor, alpha: 0.9 });
      this.targetGraphics.stroke({ color: 0x000000, width: 1 });
    }
  }

  private drawBossMouth(size: number): void {
    const scale = size / 60;

    // Vẽ miệng cười ác
    this.targetGraphics.moveTo(-3 * scale, 2 * scale);
    this.targetGraphics.quadraticCurveTo(0, 5 * scale, 3 * scale, 2 * scale);
    this.targetGraphics.stroke({ color: 0x000000, width: 2 });

    // Vẽ răng nanh
    this.targetGraphics.moveTo(-2 * scale, 2 * scale);
    this.targetGraphics.lineTo(-1.5 * scale, 4 * scale);
    this.targetGraphics.lineTo(-1 * scale, 2 * scale);
    this.targetGraphics.fill({ color: 0xffffff, alpha: 0.9 });

    this.targetGraphics.moveTo(1 * scale, 2 * scale);
    this.targetGraphics.lineTo(1.5 * scale, 4 * scale);
    this.targetGraphics.lineTo(2 * scale, 2 * scale);
    this.targetGraphics.fill({ color: 0xffffff, alpha: 0.9 });
  }

  private getHairColor(): number {
    switch (this.config.rarity) {
      case "legendary":
        return 0xff0000; // Đỏ
      case "epic":
        return 0xff6600; // Cam đỏ
      default:
        return 0xffaa00; // Vàng cam
    }
  }

  private drawBossAura(): void {
    const size = this.config.size;
    const auraColor = this.getAuraColor();

    // Vẽ nhiều lớp aura
    for (let i = 0; i < 3; i++) {
      const auraRadius = size / 2 + (i + 1) * 10;
      const alpha = 0.3 - i * 0.1;

      this.targetGraphics.circle(0, 0, auraRadius);
      this.targetGraphics.stroke({
        color: auraColor,
        width: 2,
        alpha: alpha,
      });
    }
  }

  private drawBossEyes(size: number): void {
    const scale = size / 60;
    const eyeSize = 2 * scale;

    // Mắt trái
    this.targetGraphics.circle(-3 * scale, -12 * scale, eyeSize);
    this.targetGraphics.fill({ color: 0xff0000, alpha: 0.8 });
    this.targetGraphics.stroke({ color: 0x000000, width: 1 });

    // Mắt phải
    this.targetGraphics.circle(3 * scale, -12 * scale, eyeSize);
    this.targetGraphics.fill({ color: 0xff0000, alpha: 0.8 });
    this.targetGraphics.stroke({ color: 0x000000, width: 1 });

    // Vẽ ánh sáng trong mắt
    this.targetGraphics.circle(-3 * scale, -12 * scale, eyeSize * 0.3);
    this.targetGraphics.fill({ color: 0xffffff, alpha: 0.9 });

    this.targetGraphics.circle(3 * scale, -12 * scale, eyeSize * 0.3);
    this.targetGraphics.fill({ color: 0xffffff, alpha: 0.9 });
  }

  private createBossName(): void {
    const bossNameText = new Text({
      text: this.config.name,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xff0000,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 3 },
        dropShadow: {
          color: 0x000000,
          blur: 3,
          angle: Math.PI / 4,
          distance: 2,
        },
      }),
    });

    bossNameText.anchor.set(0.5);
    bossNameText.x = 0;
    bossNameText.y = -this.config.size * 0.7;

    this.addChild(bossNameText);
  }

  private createBossHealthBar(): void {
    this.healthBar = new Graphics();
    this.addChild(this.healthBar);
    this.updateHealthBar();
  }

  protected updateHealthBar(): void {
    if (!this.healthBar) return;

    this.healthBar.clear();

    const barWidth = this.config.size * 1.5;
    const barHeight = 12;
    const barX = -barWidth / 2;
    const barY = -this.config.size * 0.6;

    // Background
    this.healthBar.rect(barX, barY, barWidth, barHeight);
    this.healthBar.fill({ color: 0x333333, alpha: 0.8 });

    // Health bar
    const healthPercentage = this.currentHealth / this.maxHealth;
    const healthWidth = barWidth * healthPercentage;
    const healthColor = this.getBossHealthBarColor(healthPercentage);

    this.healthBar.rect(barX, barY, healthWidth, barHeight);
    this.healthBar.fill({ color: healthColor, alpha: 0.9 });

    // Viền thanh máu
    this.healthBar.rect(barX, barY, barWidth, barHeight);
    this.healthBar.stroke({ color: 0x000000, width: 2 });
  }

  private getBossHealthBarColor(percentage: number): number {
    if (percentage > 0.6) return 0xff0000; // Đỏ
    if (percentage > 0.3) return 0xff6600; // Cam đỏ
    return 0xcc0000; // Đỏ đậm
  }

  private getAuraColor(): number {
    switch (this.config.rarity) {
      case "legendary":
        return 0xff0000; // Đỏ
      case "epic":
        return 0xff6600; // Cam đỏ
      default:
        return 0xffaa00; // Vàng cam
    }
  }

  public static getBossConfig(bossType?: string): TargetConfig {
    const bossTypes: { [key: string]: TargetConfig } = {
      pham_kha_di: {
        type: "pham_kha_di",
        name: "Phạm Khả Di",
        color: 0x8b0000, // Dark Red
        size: 60,
        points: 1000,
        coinValue: 200,
        ammoReward: 100,
        speed: 25,
        health: 80,
        rarity: "legendary",
        category: "boss",
      },
      tran_van_nghia: {
        type: "tran_van_nghia",
        name: "Trần Văn Nghĩa",
        color: 0xdc143c, // Crimson
        size: 70,
        points: 1500,
        coinValue: 300,
        ammoReward: 150,
        speed: 20,
        health: 120,
        rarity: "legendary",
        category: "boss",
      },
      nghia_map: {
        type: "nghia_map",
        name: "Nghĩa_Mập",
        color: 0xb22222, // Fire Brick
        size: 80,
        points: 2000,
        coinValue: 500,
        ammoReward: 250,
        speed: 15,
        health: 200,
        rarity: "legendary",
        category: "boss",
      },
    };

    // Nếu không chỉ định loại boss, chọn ngẫu nhiên
    if (!bossType) {
      const bossKeys = Object.keys(bossTypes);
      bossType = bossKeys[Math.floor(Math.random() * bossKeys.length)];
    }

    return bossTypes[bossType] || bossTypes["pham_kha_di"];
  }

  public isBoss(): boolean {
    return true;
  }

  public getReward(): { coins: number; ammo: number } {
    // Boss có phần thưởng đặc biệt
    const baseReward = super.getReward();
    return {
      coins: baseReward.coins * 2, // Gấp đôi xu
      ammo: baseReward.ammo * 2, // Gấp đôi đạn
    };
  }
}
