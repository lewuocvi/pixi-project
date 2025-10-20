import { Container } from "pixi.js";
import { Target } from "./Target";
import { Fish } from "./Fish";
import { Advertisement } from "./Advertisement";

export class TargetManager extends Container {
  private targets: Target[] = [];
  private spawnTimer: number = 0;
  private spawnInterval: number = 2000; // 2 giây spawn 1 đối tượng
  private fishSpawnChance: number = 0.3; // 30% cá, 70% quảng cáo (quảng cáo nhiều hơn)
  private initialAdSpawned: boolean = false; // Để spawn quảng cáo đầu tiên

  // Theo dõi loại quảng cáo đang hiển thị để tránh spawn trùng lặp
  private activeAdTypes: Set<string> = new Set();

  constructor() {
    super();
  }

  public async initialize(): Promise<void> {
    // Spawn quảng cáo đầu tiên sau khi advertisement data đã được load
    this.spawnInitialAdvertisements();
  }

  private spawnInitialAdvertisements(): void {
    console.log("🎯 Spawning initial advertisements...");
    // Spawn 3-5 quảng cáo ngay lập tức, mỗi loại chỉ 1 cái
    const adTypes = [
      "banner",
      "popup",
      "video",
      "iphone_repair",
      "ipad_repair",
      "android_repair",
      "unlock_service",
      "frp_remove",
      "knox_check",
      "camera_install",
      "camera_3k",
      "solar_light",
      "solar_24h",
      "wifi_install",
      "server_install",
      "nghiaapple_mega",
      "nghiaapple_viral",
      // Quảng cáo mới
      "tech_solution",
      "camera_full_hd",
      "solar_premium",
      "software_service",
      "repair_comprehensive",
      "contact_comprehensive",
    ];

    // Chọn ngẫu nhiên 3-5 loại quảng cáo khác nhau
    const selectedTypes = this.shuffleArray(adTypes).slice(
      0,
      3 + Math.floor(Math.random() * 3),
    );

    console.log(`🎯 Selected ${selectedTypes.length} advertisement types:`, selectedTypes);
    
    selectedTypes.forEach((adType) => {
      console.log(`🎯 Creating advertisement: ${adType}`);
      try {
        const ad = new Advertisement(adType);

        // Vị trí ngẫu nhiên trên màn hình
        const x = 200 + Math.random() * 1400; // Từ 200 đến 1600
        const y = 200 + Math.random() * 400; // Từ 200 đến 600

        ad.x = x;
        ad.y = y;
        ad.direction = 0; // Không di chuyển
        ad.speed = 0;

        // Thêm vào danh sách active
        this.activeAdTypes.add(adType);
        // Không thêm cooldown để quảng cáo có thể spawn lại ngay sau khi chết

        this.targets.push(ad);
        this.addChild(ad);
        
        console.log(`✅ Advertisement ${adType} created successfully at (${x}, ${y})`);
      } catch (error) {
        console.error(`❌ Failed to create advertisement ${adType}:`, error);
      }
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  public update(deltaTime: number): void {
    this.spawnTimer += deltaTime;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTarget();
      this.spawnTimer = 0;
    }

    // Cập nhật tất cả đối tượng
    for (let i = this.targets.length - 1; i >= 0; i--) {
      const target = this.targets[i];
      target.update(deltaTime);

      // Xóa đối tượng nếu đã ra khỏi màn hình
      if (target.x < -100 || target.x > 2020) {
        this.removeTarget(target);
      }
    }
  }


  private spawnTarget(): void {
    let target: Target;

    // Quyết định spawn cá hay quảng cáo
    if (Math.random() < this.fishSpawnChance) {
      target = new Fish();
    } else {
      // Kiểm tra xem có thể spawn quảng cáo không
      const availableAdType = this.getAvailableAdType();
      if (availableAdType) {
        target = new Advertisement(availableAdType);
        this.activeAdTypes.add(availableAdType);
        console.log(`🎯 Spawned advertisement: ${availableAdType}, activeAdTypes:`, Array.from(this.activeAdTypes));
        // Không thêm cooldown để quảng cáo có thể spawn lại ngay sau khi chết
      } else {
        // Nếu không có quảng cáo nào có thể spawn, spawn cá thay thế
        console.log(`🐟 No available ads, spawning fish instead. activeAdTypes:`, Array.from(this.activeAdTypes));
        target = new Fish();
      }
    }

    // Vị trí spawn ngẫu nhiên
    const side = Math.random() < 0.5 ? "left" : "right";
    const y = 200 + Math.random() * 400; // Từ 200 đến 600 pixel

    if (side === "left") {
      target.x = -50;
      target.direction = 1; // Di chuyển sang phải
    } else {
      target.x = 1970;
      target.direction = -1; // Di chuyển sang trái
    }

    target.y = y;
    this.addChild(target);
    this.targets.push(target);
  }

  private getAvailableAdType(): string | null {
    // Danh sách tất cả loại quảng cáo
    const allAdTypes = [
      "banner",
      "popup",
      "video",
      "iphone_repair",
      "ipad_repair",
      "android_repair",
      "unlock_service",
      "frp_remove",
      "knox_check",
      "camera_install",
      "camera_3k",
      "solar_light",
      "solar_24h",
      "wifi_install",
      "server_install",
      "nghiaapple_mega",
      "nghiaapple_viral",
      // Quảng cáo mới
      "tech_solution",
      "camera_full_hd",
      "solar_premium",
      "software_service",
      "repair_comprehensive",
      "contact_comprehensive",
    ];

    // Lọc ra các loại quảng cáo có thể spawn (chỉ kiểm tra không đang hiển thị)
    // Bỏ kiểm tra cooldown để quảng cáo có thể spawn lại ngay sau khi chết
    const availableTypes = allAdTypes.filter(
      (adType) => !this.activeAdTypes.has(adType),
    );

    // Trả về loại ngẫu nhiên từ danh sách có sẵn
    if (availableTypes.length > 0) {
      return availableTypes[Math.floor(Math.random() * availableTypes.length)];
    }

    return null; // Không có loại nào có thể spawn
  }

  public removeTarget(target: Target): void {
    const index = this.targets.indexOf(target);
    if (index > -1) {
      // Nếu là quảng cáo, xóa khỏi danh sách active
      if (target.category === "advertisement" && (target as any).adType) {
        this.activeAdTypes.delete((target as any).adType);
        console.log(`🗑️ Removed advertisement type: ${(target as any).adType} from activeAdTypes`);
      }

      this.targets.splice(index, 1);
      this.removeChild(target);
      target.destroy();
    }
  }

  public getTargets(): Target[] {
    return this.targets;
  }

  public getFishes(): Target[] {
    return this.targets.filter((target) => target.category === "fish");
  }

  public getAdvertisements(): Target[] {
    return this.targets.filter((target) => target.category === "advertisement");
  }

  public getBosses(): Target[] {
    return this.targets.filter((target) => target.isBoss());
  }

  public getTargetsByRarity(
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary",
  ): Target[] {
    return this.targets.filter((target) => target.rarity === rarity);
  }

  public setSpawnInterval(interval: number): void {
    this.spawnInterval = interval;
  }

  public setFishSpawnChance(chance: number): void {
    this.fishSpawnChance = Math.max(0, Math.min(1, chance));
  }

  public getTargetCount(): number {
    return this.targets.length;
  }

  public getTargetCountByCategory(category: "fish" | "advertisement"): number {
    return this.targets.filter((target) => target.category === category).length;
  }

  public getTargetCountByRarity(
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary",
  ): number {
    return this.targets.filter((target) => target.rarity === rarity).length;
  }

  public clearAllTargets(): void {
    for (const target of this.targets) {
      this.removeChild(target);
      target.destroy();
    }
    this.targets = [];
    this.activeAdTypes.clear();
  }

  public getActiveAdTypes(): string[] {
    return Array.from(this.activeAdTypes);
  }

  public spawnSpecificTarget(
    type: string,
    category: "fish" | "advertisement",
  ): Target | null {
    let target: Target;

    if (category === "fish") {
      target = new Fish(type);
    } else {
      target = new Advertisement(type);
    }

    // Vị trí spawn ngẫu nhiên
    const side = Math.random() < 0.5 ? "left" : "right";
    const y = 200 + Math.random() * 400;

    if (side === "left") {
      target.x = -50;
      target.direction = 1;
    } else {
      target.x = 1970;
      target.direction = -1;
    }

    target.y = y;
    this.addChild(target);
    this.targets.push(target);

    return target;
  }
}
