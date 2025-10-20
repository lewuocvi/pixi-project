import { Target, TargetConfig } from "./Target";

export class Fish extends Target {
  constructor(fishType?: string) {
    const config = Fish.getFishConfig(fishType);
    super(config);
  }

  protected setupTarget(): void {
    this.drawTarget();

    // Tạo thanh máu cho cá có nhiều máu
    if (this.maxHealth > 1) {
      this.createHealthBar();
    }

    // Tạo text hiển thị tên cá
    this.createNameDisplay();
  }

  protected drawTarget(): void {
    this.targetGraphics.clear();

    // Thân cá (hình oval)
    this.targetGraphics.ellipse(0, 0, this.config.size, this.config.size * 0.6);
    this.targetGraphics.fill({ color: this.config.color });

    // Đuôi cá
    this.targetGraphics.moveTo(
      -this.config.size * 0.8,
      -this.config.size * 0.3,
    );
    this.targetGraphics.lineTo(-this.config.size * 0.8, this.config.size * 0.3);
    this.targetGraphics.lineTo(-this.config.size * 1.2, 0);
    this.targetGraphics.closePath();
    this.targetGraphics.fill({ color: this.config.color * 0.8 });

    // Mắt cá
    this.targetGraphics.circle(
      this.config.size * 0.3,
      -this.config.size * 0.2,
      this.config.size * 0.15,
    );
    this.targetGraphics.fill({ color: 0xffffff });

    this.targetGraphics.circle(
      this.config.size * 0.35,
      -this.config.size * 0.2,
      this.config.size * 0.08,
    );
    this.targetGraphics.fill({ color: 0x000000 });

    // Vây cá
    this.targetGraphics.ellipse(
      this.config.size * 0.1,
      -this.config.size * 0.4,
      this.config.size * 0.3,
      this.config.size * 0.2,
    );
    this.targetGraphics.fill({ color: this.config.color * 0.7 });

    this.targetGraphics.ellipse(
      this.config.size * 0.1,
      this.config.size * 0.4,
      this.config.size * 0.3,
      this.config.size * 0.2,
    );
    this.targetGraphics.fill({ color: this.config.color * 0.7 });

    // Hiệu ứng đặc biệt cho cá boss
    if (this.isBoss()) {
      this.drawBossEffects();
    }

    // Hiệu ứng đặc biệt cho cá hiếm
    if (this.rarity === "epic") {
      this.drawEpicEffects();
    }
  }

  private drawBossEffects(): void {
    // Vòng tròn năng lượng xung quanh cá boss
    this.targetGraphics.circle(0, 0, this.config.size * 1.5);
    this.targetGraphics.stroke({ color: 0xffaa00, width: 3 });

    // Thêm các điểm sáng
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const x = Math.cos(angle) * this.config.size * 1.3;
      const y = Math.sin(angle) * this.config.size * 1.3;
      this.targetGraphics.circle(x, y, 3);
      this.targetGraphics.fill({ color: 0xffff00 });
    }

    // Thêm răng nanh cho cá boss
    this.targetGraphics.moveTo(this.config.size * 0.4, -this.config.size * 0.1);
    this.targetGraphics.lineTo(
      this.config.size * 0.6,
      -this.config.size * 0.05,
    );
    this.targetGraphics.lineTo(this.config.size * 0.5, 0);
    this.targetGraphics.closePath();
    this.targetGraphics.fill({ color: 0xffffff });

    this.targetGraphics.moveTo(this.config.size * 0.4, this.config.size * 0.1);
    this.targetGraphics.lineTo(this.config.size * 0.6, this.config.size * 0.05);
    this.targetGraphics.lineTo(this.config.size * 0.5, 0);
    this.targetGraphics.closePath();
    this.targetGraphics.fill({ color: 0xffffff });
  }

  private drawEpicEffects(): void {
    // Hiệu ứng ánh sáng cho cá epic
    this.targetGraphics.circle(0, 0, this.config.size * 1.2);
    this.targetGraphics.stroke({ color: 0xaa00ff, width: 2 });

    // Thêm các điểm sáng nhỏ
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const x = Math.cos(angle) * this.config.size * 1.1;
      const y = Math.sin(angle) * this.config.size * 1.1;
      this.targetGraphics.circle(x, y, 2);
      this.targetGraphics.fill({ color: 0xaa00ff });
    }
  }

  public static getFishConfig(fishType?: string): TargetConfig {
    const fishTypes: { [key: string]: TargetConfig } = {
      // Cá thường - Tông màu bầu trời
      small: {
        type: "small",
        name: "Cá Nhỏ",
        color: 0x87ceeb, // Sky Blue - Xanh bầu trời nhạt
        size: 20,
        points: 10,
        coinValue: 1,
        ammoReward: 1,
        speed: 50,
        health: 1,
        rarity: "common",
        category: "fish",
      },
      medium: {
        type: "medium",
        name: "Cá Trung",
        color: 0x4682b4, // Steel Blue - Xanh thép
        size: 35,
        points: 25,
        coinValue: 3,
        ammoReward: 2,
        speed: 40,
        health: 3,
        rarity: "common",
        category: "fish",
      },
      large: {
        type: "large",
        name: "Cá Lớn",
        color: 0x4169e1, // Royal Blue - Xanh hoàng gia
        size: 50,
        points: 50,
        coinValue: 7,
        ammoReward: 5,
        speed: 30,
        health: 5,
        rarity: "uncommon",
        category: "fish",
      },

      // Cá hiếm - Tông màu biển và hoàng hôn
      golden: {
        type: "golden",
        name: "Cá Vàng",
        color: 0xffd700, // Gold - Vàng như ánh nắng mặt trời
        size: 30,
        points: 100,
        coinValue: 15,
        ammoReward: 10,
        speed: 60,
        health: 2,
        rarity: "rare",
        category: "fish",
      },
      rainbow: {
        type: "rainbow",
        name: "Cá Cầu Vồng",
        color: 0x40e0d0, // Turquoise - Xanh ngọc lam như cầu vồng
        size: 40,
        points: 150,
        coinValue: 25,
        ammoReward: 15,
        speed: 45,
        health: 4,
        rarity: "rare",
        category: "fish",
      },
      crystal: {
        type: "crystal",
        name: "Cá Pha Lê",
        color: 0x00ced1, // Dark Turquoise - Xanh ngọc đậm như pha lê
        size: 35,
        points: 200,
        coinValue: 35,
        ammoReward: 20,
        speed: 55,
        health: 3,
        rarity: "epic",
        category: "fish",
      },

      // Cá boss - Tông màu hoàng hôn
      boss: {
        type: "boss",
        name: "Cá Boss Huyền Thoại",
        color: 0xdc143c, // Crimson - Đỏ thẫm như hoàng hôn
        size: 80,
        points: 500,
        coinValue: 100,
        ammoReward: 50,
        speed: 15,
        health: 50,
        rarity: "legendary",
        category: "fish",
      },
      dragon: {
        type: "dragon",
        name: "Cá Rồng",
        color: 0xff6347, // Tomato - Đỏ cà chua như bình minh
        size: 70,
        points: 400,
        coinValue: 80,
        ammoReward: 40,
        speed: 20,
        health: 40,
        rarity: "legendary",
        category: "fish",
      },
      leviathan: {
        type: "leviathan",
        name: "Cá Leviathan",
        color: 0x2f4f4f, // Dark Slate Gray - Xám đậm như biển sâu
        size: 90,
        points: 600,
        coinValue: 120,
        ammoReward: 60,
        speed: 12,
        health: 60,
        rarity: "legendary",
        category: "fish",
      },
    };

    // Nếu không chỉ định loại cá, chọn ngẫu nhiên
    if (!fishType) {
      const commonFish = ["small", "medium", "large"];
      const rareFish = ["golden", "rainbow"];
      const epicFish = ["crystal"];
      const legendaryFish = ["boss", "dragon", "leviathan"];

      const rand = Math.random();
      if (rand < 0.6) {
        fishType = commonFish[Math.floor(Math.random() * commonFish.length)];
      } else if (rand < 0.85) {
        fishType = rareFish[Math.floor(Math.random() * rareFish.length)];
      } else if (rand < 0.95) {
        fishType = epicFish[Math.floor(Math.random() * epicFish.length)];
      } else {
        fishType =
          legendaryFish[Math.floor(Math.random() * legendaryFish.length)];
      }
    }

    return fishTypes[fishType] || fishTypes["small"];
  }
}
