import { Target } from "./Target";
import { Text, TextStyle, Graphics } from "pixi.js";
import {
  AdvertisementManager,
  AdvertisementData,
  AdvertisementContent,
  AdvertisementConfig,
} from "./AdvertisementManager";

export class Advertisement extends Target {
  private advertisementData: AdvertisementData;
  private systemConfig: AdvertisementConfig;
  public adType: string; // Lưu loại quảng cáo cụ thể (banner, popup, etc.)

  constructor(adType?: string) {
    const manager = AdvertisementManager.getInstance();

    console.log(`Creating Advertisement with type: ${adType}`);
    console.log(`Manager loaded: ${manager.isDataLoaded()}`);

    // Ensure data is loaded before creating advertisement
    if (!manager.isDataLoaded()) {
      console.error(
        "AdvertisementManager data not loaded, cannot create Advertisement",
      );
      throw new Error(
        "AdvertisementManager data not loaded. Call loadAdvertisementData() first.",
      );
    }

    const data = manager.getAdvertisementConfig(adType);
    const config = manager.getSystemConfig();

    console.log(`Data:`, data);
    console.log(`Config:`, config);

    if (!data) {
      throw new Error(`Failed to get advertisement config for type: ${adType}`);
    }

    if (!config) {
      throw new Error("Failed to get system config");
    }

    // Parse color before calling super()
    const backgroundColor =
      typeof data.backgroundColor === "string"
        ? parseInt(data.backgroundColor.replace("0x", ""), 16)
        : data.backgroundColor;

    super({
      type: "advertisement",
      name: data.name,
      color: backgroundColor,
      size: data.size,
      points: data.points,
      coinValue: data.coinValue,
      ammoReward: data.ammoReward,
      speed: data.speed,
      health: data.health,
      rarity: data.rarity,
      category: "advertisement",
    });

    // Set data after calling super()
    this.adType = adType || "banner";
    this.advertisementData = data;
    this.systemConfig = config;

    // Initialize advertisement after data is set
    this.initializeAdvertisement();

    console.log(
      `Advertisement created successfully with data:`,
      this.advertisementData,
    );
  }

  private initializeAdvertisement(): void {
    console.log("🚀 Initializing advertisement...");
    this.drawTarget();

    // Tạo thanh máu cho quảng cáo có nhiều máu
    if (this.config.health > 1) {
      this.createAdvertisementHealthBar();
    }
  }

  protected setupTarget(): void {
    // Override to prevent Target.setupTarget() from being called
    // We'll call this manually after data is set
    console.log("🎯 Advertisement.setupTarget() called");
  }

  protected drawTarget(): void {
    this.createBackground();
    this.addBannerContent();
  }

  private createBackground(): void {
    console.log("🎨 Creating background...");
    console.log("this.advertisementData:", this.advertisementData);

    if (!this.advertisementData) {
      console.error(
        "❌ this.advertisementData is undefined in createBackground()",
      );
      return;
    }

    const width = this.config.size * 1.2;
    const height = this.config.size * 0.8;
    const x = -width / 2;
    const y = -height / 2;

    // Tạo background chính với màu hòa hợp game
    this.targetGraphics.rect(x, y, width, height);
    this.targetGraphics.fill({
      color: this.parseColor(this.advertisementData.backgroundColor),
      alpha: 0.8,
    });

    // Tạo shadow effect nhẹ nhàng
    const shadowOffset = 2;
    this.targetGraphics.rect(x + shadowOffset, y + shadowOffset, width, height);
    this.targetGraphics.fill({
      color: 0x000000,
      alpha: 0.1,
    });

    // Tạo highlight effect nhẹ nhàng ở trên cùng
    const highlightHeight = 2;
    const highlightColor = this.getLighterColor(
      this.parseColor(this.advertisementData.backgroundColor),
    );
    this.targetGraphics.rect(x, y, width, highlightHeight);
    this.targetGraphics.fill({
      color: highlightColor,
      alpha: 0.3,
    });
  }

  private getLighterColor(color: number): number {
    // Tăng độ sáng của màu để tạo highlight
    const r = Math.min(255, ((color >> 16) & 0xff) + 50);
    const g = Math.min(255, ((color >> 8) & 0xff) + 50);
    const b = Math.min(255, (color & 0xff) + 50);
    return (r << 16) | (g << 8) | b;
  }

  private createAdvertisementHealthBar(): void {
    console.log("❤️ Creating advertisement health bar...");
    console.log("Health:", this.config.health);

    // Sử dụng hệ thống thanh máu của Target
    this.healthBar = new Graphics();
    this.addChild(this.healthBar);
    this.updateHealthBar();

    console.log("✅ Advertisement health bar created successfully");
  }

  protected updateHealthBar(): void {
    if (!this.healthBar) return;

    console.log("🔄 Updating advertisement health bar...");
    console.log("Current health:", this.currentHealth);
    console.log("Max health:", this.maxHealth);

    this.healthBar.clear();

    const barWidth = this.config.size * 1.2; // Chiều rộng bằng với quảng cáo
    const barHeight = 8;
    const barX = -barWidth / 2;
    const barY = -this.config.size * 0.4; // Nằm sát trên đầu quảng cáo

    console.log("Health bar dimensions:", { barWidth, barHeight, barX, barY });

    // Background
    this.healthBar.rect(barX, barY, barWidth, barHeight);
    this.healthBar.fill({ color: 0x333333, alpha: 0.8 });

    // Health bar - sử dụng currentHealth thực tế
    const healthPercentage = this.currentHealth / this.maxHealth;
    const healthWidth = barWidth * healthPercentage;
    const healthColor = this.getHealthBarColor(healthPercentage);

    this.healthBar.rect(barX, barY, healthWidth, barHeight);
    this.healthBar.fill({ color: healthColor, alpha: 0.9 });

    console.log("✅ Health bar updated successfully");
  }

  protected getHealthBarColor(percentage: number): number {
    if (percentage > 0.6) return 0x27ae60; // Xanh lá
    if (percentage > 0.3) return 0xf39c12; // Cam
    return 0xe74c3c; // Đỏ
  }

  private addBannerContent(): void {
    console.log("🎯 Adding banner content...");
    console.log("Advertisement data:", this.advertisementData);
    console.log("System config:", this.systemConfig);

    if (!this.advertisementData || !this.systemConfig) {
      console.error("Advertisement data or system config is undefined");
      return;
    }

    const content = this.advertisementData.content;
    const layoutConfig = this.systemConfig.layout;

    console.log("Content to render:", content);
    console.log("Layout config to use:", layoutConfig);

    // Sử dụng layout chung cho tất cả quảng cáo
    this.addSimpleContent(content, layoutConfig);
  }

  private createText(
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: number = 0xffffff,
  ): Text {
    console.log(
      `📝 Creating text: "${text}" at (${x}, ${y}) with size ${fontSize} and color ${color}`,
    );

    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: fontSize,
      fill: color,
      align: "center",
      fontWeight: "bold",
    });

    const textObj = new Text({ text, style });
    textObj.x = x;
    textObj.y = y;
    textObj.anchor.set(0.5);

    this.addChild(textObj);
    console.log(`✅ Text "${text}" added successfully`);
    return textObj;
  }

  // Layout handler sử dụng layout chung
  private addSimpleContent(
    content: AdvertisementContent,
    layoutConfig: any,
  ): void {
    console.log("🎨 Adding simple content...");
    console.log("Content:", content);
    console.log("Layout config:", layoutConfig);
    console.log("This.config:", this.config);
    console.log("This.config.size:", this.config?.size);

    const fontSize = Math.max(8, this.config.size * 0.08);
    const textColor = this.parseColor(this.advertisementData.textColor);

    // Icon
    if (content.icon && layoutConfig.icon) {
      this.createText(
        content.icon,
        this.config.size * layoutConfig.icon.position.x,
        this.config.size * layoutConfig.icon.position.y,
        fontSize * layoutConfig.icon.size,
        textColor,
      );
    }

    // Title
    if (content.title && layoutConfig.title) {
      this.createText(
        content.title,
        this.config.size * layoutConfig.title.position.x,
        this.config.size * layoutConfig.title.position.y,
        fontSize * layoutConfig.title.size,
        textColor,
      );
    }

    // Sub Title
    if (content.sub_title && layoutConfig.sub_title) {
      this.createText(
        content.sub_title,
        this.config.size * layoutConfig.sub_title.position.x,
        this.config.size * layoutConfig.sub_title.position.y,
        fontSize * layoutConfig.sub_title.size,
        textColor,
      );
    }

    // Lines
    if (content.lines && layoutConfig.lines) {
      content.lines.forEach((line, index) => {
        const lineY =
          layoutConfig.lines.position.y + index * layoutConfig.lines.spacing;
        this.createText(
          line,
          this.config.size * layoutConfig.lines.position.x,
          this.config.size * lineY,
          fontSize * layoutConfig.lines.size,
          textColor,
        );
      });
    }
  }

  private parseColor(color: string | number): number {
    console.log(`🎨 Parsing color: ${color} (type: ${typeof color})`);

    if (typeof color === "string") {
      const parsed = parseInt(color, 16);
      console.log(`🎨 Parsed color: ${parsed}`);
      return parsed;
    }

    console.log(`🎨 Using color as number: ${color}`);
    return color;
  }
}
