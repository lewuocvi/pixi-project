import { Container, Graphics, Text, TextStyle } from "pixi.js";

export interface Mission {
  id: string;
  title: string;
  description: string;
  targetType: string; // 'small', 'medium', 'large', 'golden', 'boss', 'any'
  targetCount: number;
  currentCount: number;
  reward: {
    coins: number;
    ammo: number; // Thưởng đạn thay vì experience
  };
  completed: boolean;
  level: number;
}

export class MissionSystem extends Container {
  private missions: Mission[] = [];
  private currentMissionIndex: number = 0;
  private missionUI: Container | null = null;

  constructor() {
    super();
    this.initializeMissions();
    this.setupMissionUI();
  }

  private setupMissionUI(): void {
    this.missionUI = new Container();
    this.addChild(this.missionUI);

    // Vị trí UI nhiệm vụ
    this.missionUI.x = 20;
    this.missionUI.y = 20;

    this.updateMissionDisplay();
  }

  private updateMissionDisplay(): void {
    if (!this.missionUI) return;

    this.missionUI.removeChildren();

    const currentMission = this.getCurrentMission();
    if (!currentMission) {
      // Hiển thị thông báo hoàn thành tất cả nhiệm vụ
      const completedText = new Text(
        "🎉 Hoàn thành tất cả nhiệm vụ! 🎉",
        new TextStyle({
          fontFamily: "Arial",
          fontSize: 16,
          fill: 0x00ff00,
          fontWeight: "bold",
          stroke: { color: 0x000000, width: 2 },
        }),
      );
      this.missionUI.addChild(completedText);
      return;
    }

    // Background cho nhiệm vụ
    const background = new Graphics();
    background.rect(0, 0, 400, 120);
    background.fill({ color: 0x000000, alpha: 0.7 });
    background.stroke({ color: 0xffffff, width: 2 });
    this.missionUI.addChild(background);

    // Tiêu đề nhiệm vụ
    const titleText = new Text(
      currentMission.title,
      new TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffff00,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 2 },
      }),
    );
    titleText.x = 10;
    titleText.y = 10;
    this.missionUI.addChild(titleText);

    // Mô tả nhiệm vụ
    const descText = new Text(
      currentMission.description,
      new TextStyle({
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0xffffff,
        stroke: { color: 0x000000, width: 1 },
      }),
    );
    descText.x = 10;
    descText.y = 35;
    this.missionUI.addChild(descText);

    // Thanh tiến độ
    const progressText = new Text(
      `${currentMission.currentCount}/${currentMission.targetCount}`,
      new TextStyle({
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0x00ff00,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 1 },
      }),
    );
    progressText.x = 10;
    progressText.y = 60;
    this.missionUI.addChild(progressText);

    // Thanh tiến độ visual
    const progressBarBg = new Graphics();
    progressBarBg.rect(10, 80, 200, 15);
    progressBarBg.fill({ color: 0x333333, alpha: 0.8 });
    progressBarBg.stroke({ color: 0xffffff, width: 1 });
    this.missionUI.addChild(progressBarBg);

    const progressPercentage =
      currentMission.currentCount / currentMission.targetCount;
    const progressBar = new Graphics();
    progressBar.rect(10, 80, 200 * progressPercentage, 15);
    progressBar.fill({ color: 0x00ff00, alpha: 0.8 });
    this.missionUI.addChild(progressBar);

    // Phần thưởng
    const rewardText = new Text(
      `Phần thưởng: ${currentMission.reward.coins} xu, ${currentMission.reward.ammo} đạn`,
      new TextStyle({
        fontFamily: "Arial",
        fontSize: 10,
        fill: 0xffaa00,
        stroke: { color: 0x000000, width: 1 },
      }),
    );
    rewardText.x = 10;
    rewardText.y = 100;
    this.missionUI.addChild(rewardText);
  }

  private initializeMissions(): void {
    // Danh sách nhiệm vụ theo cấp độ - hỗ trợ cả cá và quảng cáo
    this.missions = [
      // Cấp 1
      {
        id: "mission_1_1",
        title: "Người mới bắt đầu",
        description: "Tiêu diệt 5 con cá nhỏ",
        targetType: "small",
        targetCount: 5,
        currentCount: 0,
        reward: { coins: 50, ammo: 100 },
        completed: false,
        level: 1,
      },
      {
        id: "mission_1_2",
        title: "Thợ săn cá",
        description: "Tiêu diệt 10 đối tượng bất kỳ",
        targetType: "any",
        targetCount: 10,
        currentCount: 0,
        reward: { coins: 100, ammo: 200 },
        completed: false,
        level: 1,
      },
      {
        id: "mission_1_3",
        title: "Phá quảng cáo",
        description: "Tiêu diệt 5 banner quảng cáo",
        targetType: "banner",
        targetCount: 5,
        currentCount: 0,
        reward: { coins: 80, ammo: 150 },
        completed: false,
        level: 1,
      },

      // Cấp 2
      {
        id: "mission_2_1",
        title: "Săn cá trung bình",
        description: "Tiêu diệt 8 con cá trung bình",
        targetType: "medium",
        targetCount: 8,
        currentCount: 0,
        reward: { coins: 150, ammo: 300 },
        completed: false,
        level: 2,
      },
      {
        id: "mission_2_2",
        title: "Thợ săn vàng",
        description: "Tiêu diệt 3 con cá vàng",
        targetType: "golden",
        targetCount: 3,
        currentCount: 0,
        reward: { coins: 200, ammo: 500 },
        completed: false,
        level: 2,
      },
      {
        id: "mission_2_3",
        title: "Chặn popup",
        description: "Tiêu diệt 6 popup quảng cáo",
        targetType: "popup",
        targetCount: 6,
        currentCount: 0,
        reward: { coins: 180, ammo: 350 },
        completed: false,
        level: 2,
      },

      // Cấp 3
      {
        id: "mission_3_1",
        title: "Săn cá lớn",
        description: "Tiêu diệt 5 con cá lớn",
        targetType: "large",
        targetCount: 5,
        currentCount: 0,
        reward: { coins: 300, ammo: 600 },
        completed: false,
        level: 3,
      },
      {
        id: "mission_3_2",
        title: "Thợ săn chuyên nghiệp",
        description: "Tiêu diệt 15 đối tượng bất kỳ",
        targetType: "any",
        targetCount: 15,
        currentCount: 0,
        reward: { coins: 400, ammo: 800 },
        completed: false,
        level: 3,
      },
      {
        id: "mission_3_3",
        title: "Phá video quảng cáo",
        description: "Tiêu diệt 4 video quảng cáo",
        targetType: "video",
        targetCount: 4,
        currentCount: 0,
        reward: { coins: 350, ammo: 700 },
        completed: false,
        level: 3,
      },

      // Cấp 4
      {
        id: "mission_4_1",
        title: "Săn boss",
        description: "Tiêu diệt 2 con cá boss",
        targetType: "boss",
        targetCount: 2,
        currentCount: 0,
        reward: { coins: 600, ammo: 1200 },
        completed: false,
        level: 4,
      },
      {
        id: "mission_4_2",
        title: "Chiến đấu với Phạm Khả Di",
        description: "Tiêu diệt 1 con boss Phạm Khả Di",
        targetType: "pham_kha_di",
        targetCount: 1,
        currentCount: 0,
        reward: { coins: 800, ammo: 1500 },
        completed: false,
        level: 4,
      },
      {
        id: "mission_4_3",
        title: "Thợ săn chuyên nghiệp",
        description: "Tiêu diệt 20 đối tượng bất kỳ",
        targetType: "any",
        targetCount: 20,
        currentCount: 0,
        reward: { coins: 500, ammo: 1000 },
        completed: false,
        level: 4,
      },

      // Cấp 5
      {
        id: "mission_5_1",
        title: "Đối đầu Trần Văn Nghĩa",
        description: "Tiêu diệt 1 con boss Trần Văn Nghĩa",
        targetType: "tran_van_nghia",
        targetCount: 1,
        currentCount: 0,
        reward: { coins: 1200, ammo: 2000 },
        completed: false,
        level: 5,
      },
      {
        id: "mission_5_2",
        title: "Thợ săn boss",
        description: "Tiêu diệt 3 con boss bất kỳ",
        targetType: "boss",
        targetCount: 3,
        currentCount: 0,
        reward: { coins: 1000, ammo: 1800 },
        completed: false,
        level: 5,
      },
      {
        id: "mission_5_3",
        title: "Phá quảng cáo cao cấp",
        description: "Tiêu diệt 8 quảng cáo dịch vụ",
        targetType: "any",
        targetCount: 8,
        currentCount: 0,
        reward: { coins: 600, ammo: 1200 },
        completed: false,
        level: 5,
      },

      // Cấp 6 - Boss cuối cùng
      {
        id: "mission_6_1",
        title: "Thử thách cuối cùng",
        description: "Tiêu diệt boss Nghĩa_Mập",
        targetType: "nghia_map",
        targetCount: 1,
        currentCount: 0,
        reward: { coins: 2000, ammo: 3000 },
        completed: false,
        level: 6,
      },
      {
        id: "mission_6_2",
        title: "Bậc thầy săn boss",
        description: "Tiêu diệt 5 con boss bất kỳ",
        targetType: "boss",
        targetCount: 5,
        currentCount: 0,
        reward: { coins: 1500, ammo: 2500 },
        completed: false,
        level: 6,
      },
      {
        id: "mission_6_3",
        title: "Thợ săn tối thượng",
        description: "Tiêu diệt 30 đối tượng bất kỳ",
        targetType: "any",
        targetCount: 30,
        currentCount: 0,
        reward: { coins: 1000, ammo: 2000 },
        completed: false,
        level: 6,
      },
    ];
  }

  public updateMissionProgress(targetType: string): boolean {
    const currentMission = this.getCurrentMission();
    if (!currentMission) return false;

    // Kiểm tra xem targetType có khớp với nhiệm vụ không
    if (
      currentMission.targetType === "any" ||
      currentMission.targetType === targetType
    ) {
      currentMission.currentCount++;

      // Kiểm tra xem nhiệm vụ đã hoàn thành chưa
      if (currentMission.currentCount >= currentMission.targetCount) {
        currentMission.completed = true;
        this.currentMissionIndex++;

        // Cập nhật UI
        this.updateMissionDisplay();

        return true; // Nhiệm vụ hoàn thành
      }
    }

    // Cập nhật UI
    this.updateMissionDisplay();
    return false; // Nhiệm vụ chưa hoàn thành
  }

  public getCurrentMission(): Mission | null {
    if (this.currentMissionIndex < this.missions.length) {
      return this.missions[this.currentMissionIndex];
    }
    return null;
  }

  public getMissionReward(): { coins: number; ammo: number } | null {
    const currentMission = this.getCurrentMission();
    if (currentMission && currentMission.completed) {
      return currentMission.reward;
    }
    return null;
  }

  public hasActiveMission(): boolean {
    return this.currentMissionIndex < this.missions.length;
  }

  public getMissionProgress(): { current: number; total: number } {
    const currentMission = this.getCurrentMission();
    if (currentMission) {
      return {
        current: currentMission.currentCount,
        total: currentMission.targetCount,
      };
    }
    return { current: 0, total: 0 };
  }
}
