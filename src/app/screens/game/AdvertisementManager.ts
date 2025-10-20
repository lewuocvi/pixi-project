export interface AdvertisementContent {
  icon?: string;
  title: string;
  sub_title?: string;
  lines: string[];
}

export interface AdvertisementConfig {
  layout: {
    icon: {
      position: { x: number; y: number };
      size: number;
    };
    title: {
      position: { x: number; y: number };
      size: number;
      color: string;
    };
    sub_title: {
      position: { x: number; y: number };
      size: number;
      color: string;
    };
    lines: {
      position: { x: number; y: number };
      size: number;
      color: string;
      spacing: number;
    };
  };
  colors: {
    [key: string]: string | number;
  };
  background: {
    shadow: {
      offset: { x: number; y: number };
      color: string | number;
      alpha: number;
    };
    border: {
      color: string | number;
      width: number;
      radius: number;
    };
    highlight: {
      color: string | number;
      alpha: number;
      height: number;
    };
  };
}

export interface AdvertisementData {
  id: string;
  name: string;
  backgroundColor: string | number;
  textColor: string | number;
  borderColor: string | number;
  size: number;
  points: number;
  coinValue: number;
  ammoReward: number;
  speed: number;
  health: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  category: string;
  content: AdvertisementContent;
}

export interface AdvertisementSystemData {
  config: AdvertisementConfig;
  advertisements: AdvertisementData[];
  rarityWeights: { [key: string]: number };
  categoryGroups: { [key: string]: string[] };
}

export class AdvertisementManager {
  private static instance: AdvertisementManager;
  private systemData: AdvertisementSystemData | null = null;
  private isLoaded = false;

  private constructor() {}

  public static getInstance(): AdvertisementManager {
    if (!AdvertisementManager.instance) {
      console.log("Creating new AdvertisementManager instance");
      AdvertisementManager.instance = new AdvertisementManager();
    } else {
      console.log("Using existing AdvertisementManager instance");
    }
    return AdvertisementManager.instance;
  }

  public async loadAdvertisementData(): Promise<void> {
    if (this.isLoaded) {
      return;
    }

    try {
      const response = await fetch("/assets/main/advertisements.json");
      if (!response.ok) {
        throw new Error(
          `Failed to load advertisements: ${response.statusText}`,
        );
      }

      this.systemData = await response.json();
      this.isLoaded = true;
      console.log("✅ Advertisement data loaded successfully");
      // Safe-guarded logs to satisfy strict null checks
      console.log(
        `📊 Loaded ${this.systemData?.advertisements.length ?? 0} advertisements`,
      );
      console.log(
        "📋 Available advertisement IDs:",
        this.systemData?.advertisements.map((ad) => ad.id) ?? [],
      );
    } catch (error) {
      console.error("Error loading advertisement data:", error);
      // Fallback to default data if loading fails
      this.createFallbackData();
    }
  }

  private createFallbackData(): void {
    this.systemData = {
      config: {
        layout: {
          icon: { position: { x: -0.4, y: -0.2 }, size: 1.5 },
          title: {
            position: { x: -0.1, y: -0.3 },
            size: 1.0,
            color: "primary",
          },
          sub_title: {
            position: { x: -0.1, y: -0.2 },
            size: 0.7,
            color: "secondary",
          },
          lines: {
            position: { x: -0.1, y: -0.1 },
            size: 0.6,
            color: "accent",
            spacing: 0.15,
          },
        },
        colors: {
          primary: "0x2C3E50",
          secondary: "0xE67E22",
          accent: "0x27AE60",
          muted: "0x34495E",
          highlight: "0xC0392B",
        },
        background: {
          shadow: { offset: { x: 3, y: 3 }, color: "0x000000", alpha: 0.15 },
          border: { color: "0xD5D5D5", width: 2, radius: 12 },
          highlight: { color: "0x3498DB", alpha: 0.8, height: 3 },
        },
      },
      advertisements: [
        {
          id: "banner",
          name: "Banner Quảng Cáo",
          backgroundColor: 0xe8f4fd,
          textColor: 0x2c3e50,
          borderColor: 0x3498db,
          size: 300,
          points: 15,
          coinValue: 2,
          ammoReward: 1,
          speed: 35,
          health: 2,
          rarity: "common",
          category: "general",
          content: {
            icon: "📢",
            title: "QUẢNG CÁO",
            sub_title: "Liên hệ ngay",
            lines: ["0963.60.62.63", "NGHIAAPPLE.COM", "Sửa chữa điện thoại"],
          },
        },
      ],
      rarityWeights: {
        common: 0.3,
        uncommon: 0.3,
        rare: 0.2,
        epic: 0.15,
        legendary: 0.05,
      },
      categoryGroups: {
        general: ["banner"],
      },
    };
    this.isLoaded = true;
  }

  public getAdvertisementConfig(adType?: string): AdvertisementData {
    console.log(`getAdvertisementConfig called with adType: ${adType}`);
    console.log(`isLoaded: ${this.isLoaded}, systemData:`, this.systemData);

    if (!this.isLoaded || !this.systemData) {
      throw new Error(
        "Advertisement data not loaded. Call loadAdvertisementData() first.",
      );
    }

    // If no specific type requested, choose randomly based on rarity
    if (!adType) {
      adType = this.getRandomAdvertisementType();
      console.log(`No adType provided, using random: ${adType}`);
    }

    const rawConfig = this.systemData.advertisements.find(
      (ad) => ad.id === adType,
    );
    console.log(`Found config for ${adType}:`, rawConfig);

    if (!rawConfig) {
      console.warn(
        `Advertisement type '${adType}' not found, using banner as fallback`,
      );
      const fallbackConfig = this.systemData.advertisements.find(
        (ad) => ad.id === "banner",
      );
      if (!fallbackConfig) {
        throw new Error("Fallback advertisement config not found");
      }
      return fallbackConfig;
    }

    return rawConfig;
  }

  public getSystemConfig(): AdvertisementConfig {
    if (!this.isLoaded || !this.systemData) {
      throw new Error(
        "Advertisement data not loaded. Call loadAdvertisementData() first.",
      );
    }
    return this.systemData.config;
  }

  // Removed incorrect and unused converter; AdvertisementData already matches the JSON schema

  private getRandomAdvertisementType(): string {
    if (!this.systemData) {
      return "banner";
    }

    const rand = Math.random();
    let cumulativeWeight = 0;

    for (const [rarity, weight] of Object.entries(
      this.systemData.rarityWeights,
    )) {
      cumulativeWeight += weight;
      if (rand <= cumulativeWeight) {
        const adsInRarity = this.systemData.categoryGroups[rarity];
        if (adsInRarity && adsInRarity.length > 0) {
          return adsInRarity[Math.floor(Math.random() * adsInRarity.length)];
        }
      }
    }

    // Fallback to first available advertisement
    const firstAd = this.systemData.advertisements[0];
    return firstAd?.id || "banner";
  }

  public getAllAdvertisementTypes(): string[] {
    if (!this.isLoaded || !this.systemData) {
      return ["banner"];
    }
    return this.systemData.advertisements.map((ad) => ad.id);
  }

  public getAdvertisementTypesByRarity(rarity: string): string[] {
    if (!this.isLoaded || !this.systemData) {
      return [];
    }
    return this.systemData.categoryGroups[rarity] || [];
  }

  public getAdvertisementTypesByCategory(category: string): string[] {
    if (!this.isLoaded || !this.systemData) {
      return [];
    }
    return this.systemData.advertisements
      .filter((ad) => ad.category === category)
      .map((ad) => ad.id);
  }

  public getAdvertisementById(id: string): AdvertisementData | null {
    if (!this.isLoaded || !this.systemData) {
      return null;
    }
    return this.systemData.advertisements.find((ad) => ad.id === id) || null;
  }

  public addAdvertisement(advertisement: AdvertisementData): boolean {
    if (!this.isLoaded || !this.systemData) {
      return false;
    }

    // Check if ID already exists
    if (
      this.systemData.advertisements.find((ad) => ad.id === advertisement.id)
    ) {
      console.warn(
        `Advertisement with ID '${advertisement.id}' already exists`,
      );
      return false;
    }

    this.systemData.advertisements.push(advertisement);
    return true;
  }

  public removeAdvertisement(id: string): boolean {
    if (!this.isLoaded || !this.systemData) {
      return false;
    }

    const index = this.systemData.advertisements.findIndex(
      (ad) => ad.id === id,
    );
    if (index === -1) {
      return false;
    }

    this.systemData.advertisements.splice(index, 1);
    return true;
  }

  public updateAdvertisement(
    id: string,
    updates: Partial<AdvertisementData>,
  ): boolean {
    if (!this.isLoaded || !this.systemData) {
      return false;
    }

    const index = this.systemData.advertisements.findIndex(
      (ad) => ad.id === id,
    );
    if (index === -1) {
      return false;
    }

    this.systemData.advertisements[index] = {
      ...this.systemData.advertisements[index],
      ...updates,
    };
    return true;
  }

  public getAllAdvertisements(): AdvertisementData[] {
    if (!this.isLoaded || !this.systemData) {
      return [];
    }
    return [...this.systemData.advertisements];
  }

  public isDataLoaded(): boolean {
    return this.isLoaded;
  }

  public getAdvertisementData(): AdvertisementData | null {
    return null;
  }
}
