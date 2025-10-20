import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { engine } from "../../getEngine";

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
  private missionUI!: Container;
  private missionText!: Text;
  private progressText!: Text;
  private rewardText!: Text;
  private progressBar!: Graphics;

  constructor() {
    super();
    this.setupMissionUI();
    this.initializeMissions();
  }

  private setupMissionUI(): void {
    const app = engine();
    // const screenWidth = app.screen.width; // currently unused
    const screenHeight = app.screen.height;

    // Container cho UI nhiệm vụ
    this.missionUI = new Container();
    this.missionUI.x = 20;
    this.missionUI.y = screenHeight - 200;

    // Background cho nhiệm vụ
    const missionBackground = new Graphics();
    missionBackground.rect(0, 0, 350, 120);
    missionBackground.fill({ color: 0x1a1a1a, alpha: 0.9 });
    missionBackground.stroke({ color: 0x4caf50, width: 3 });
    this.missionUI.addChild(missionBackground);

    // Tiêu đề nhiệm vụ
    const titleText = new Text({
      text: "Nhiệm vụ",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0x4caf50,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 2 },
      }),
    });
    titleText.x = 10;
    titleText.y = 10;
    this.missionUI.addChild(titleText);

    // Text mô tả nhiệm vụ
    this.missionText = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    this.missionText.x = 10;
    this.missionText.y = 35;
    this.missionUI.addChild(this.missionText);

    // Text tiến độ
    this.progressText = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0xffff00,
        fontWeight: "bold",
      }),
    });
    this.progressText.x = 10;
    this.progressText.y = 55;
    this.missionUI.addChild(this.progressText);

    // Text phần thưởng
    this.rewardText = new Text({
      text: "",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0xffaa00,
        fontWeight: "bold",
      }),
    });
    this.rewardText.x = 10;
    this.rewardText.y = 75;
    this.missionUI.addChild(this.rewardText);

    // Thanh tiến độ
    this.progressBar = new Graphics();
    this.progressBar.rect(10, 95, 330, 15);
    this.progressBar.fill({ color: 0x333333 });
    this.progressBar.stroke({ color: 0x666666, width: 1 });
    this.missionUI.addChild(this.progressBar);

    this.addChild(this.missionUI);
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
        title: "Thợ săn huyền thoại",
        description: "Tiêu diệt 20 đối tượng bất kỳ",
        targetType: "any",
        targetCount: 20,
        currentCount: 0,
        reward: { coins: 800, ammo: 1500 },
        completed: false,
        level: 4,
      },
      {
        id: "mission_4_3",
        title: "Phá mega quảng cáo",
        description: "Tiêu diệt 2 mega quảng cáo",
        targetType: "mega",
        targetCount: 2,
        currentCount: 0,
        reward: { coins: 700, ammo: 1400 },
        completed: false,
        level: 4,
      },
      {
        id: "mission_4_4",
        title: "Sửa chữa iPhone",
        description: "Tiêu diệt 5 quảng cáo sửa iPhone",
        targetType: "iphone_repair",
        targetCount: 5,
        currentCount: 0,
        reward: { coins: 650, ammo: 1300 },
        completed: false,
        level: 4,
      },
      {
        id: "mission_4_5",
        title: "Dịch vụ Unlock",
        description: "Tiêu diệt 4 quảng cáo unlock",
        targetType: "unlock_service",
        targetCount: 4,
        currentCount: 0,
        reward: { coins: 680, ammo: 1350 },
        completed: false,
        level: 4,
      },

      // Cấp 5 - Nhiệm vụ đặc biệt
      {
        id: "mission_5_1",
        title: "Săn cá hiếm",
        description: "Tiêu diệt 3 con cá pha lê",
        targetType: "crystal",
        targetCount: 3,
        currentCount: 0,
        reward: { coins: 1000, ammo: 2000 },
        completed: false,
        level: 5,
      },
      {
        id: "mission_5_2",
        title: "Phá viral ad",
        description: "Tiêu diệt 2 viral ad",
        targetType: "viral",
        targetCount: 2,
        currentCount: 0,
        reward: { coins: 900, ammo: 1800 },
        completed: false,
        level: 5,
      },
      {
        id: "mission_5_3",
        title: "Thợ săn tối thượng",
        description: "Tiêu diệt 30 đối tượng bất kỳ",
        targetType: "any",
        targetCount: 30,
        currentCount: 0,
        reward: { coins: 1200, ammo: 2500 },
        completed: false,
        level: 5,
      },
      {
        id: "mission_5_4",
        title: "Lắp đặt Camera",
        description: "Tiêu diệt 3 quảng cáo camera",
        targetType: "camera_install",
        targetCount: 3,
        currentCount: 0,
        reward: { coins: 1100, ammo: 2200 },
        completed: false,
        level: 5,
      },
      {
        id: "mission_5_5",
        title: "Đèn Năng Lượng",
        description: "Tiêu diệt 2 quảng cáo đèn solar",
        targetType: "solar_light",
        targetCount: 2,
        currentCount: 0,
        reward: { coins: 1150, ammo: 2300 },
        completed: false,
        level: 5,
      },
      {
        id: "mission_5_6",
        title: "Hệ Thống Mạng",
        description: "Tiêu diệt 3 quảng cáo wifi/server",
        targetType: "wifi_install",
        targetCount: 3,
        currentCount: 0,
        reward: { coins: 1080, ammo: 2150 },
        completed: false,
        level: 5,
      },

      // Cấp 6 - Nhiệm vụ NghiaApple đặc biệt
      {
        id: "mission_6_1",
        title: "NghiaApple Mega",
        description: "Tiêu diệt 1 NghiaApple Mega",
        targetType: "nghiaapple_mega",
        targetCount: 1,
        currentCount: 0,
        reward: { coins: 2000, ammo: 4000 },
        completed: false,
        level: 6,
      },
      {
        id: "mission_6_2",
        title: "NghiaApple Viral",
        description: "Tiêu diệt 2 NghiaApple Viral",
        targetType: "nghiaapple_viral",
        targetCount: 2,
        currentCount: 0,
        reward: { coins: 1800, ammo: 3600 },
        completed: false,
        level: 6,
      },
      {
        id: "mission_6_3",
        title: "Chuyên Gia NghiaApple",
        description: "Tiêu diệt 20 quảng cáo NghiaApple",
        targetType: "any",
        targetCount: 20,
        currentCount: 0,
        reward: { coins: 2500, ammo: 5000 },
        completed: false,
        level: 6,
      },
      {
        id: "mission_6_4",
        title: "Master NghiaApple",
        description: "Tiêu diệt 50 đối tượng bất kỳ",
        targetType: "any",
        targetCount: 50,
        currentCount: 0,
        reward: { coins: 3000, ammo: 6000 },
        completed: false,
        level: 6,
      },
    ];

    this.updateMissionDisplay();
  }

  public getCurrentMission(): Mission | null {
    if (this.currentMissionIndex < this.missions.length) {
      return this.missions[this.currentMissionIndex];
    }
    return null;
  }

  public updateMissionProgress(targetType: string): boolean {
    const currentMission = this.getCurrentMission();
    if (!currentMission || currentMission.completed) {
      return false;
    }

    // Kiểm tra xem đối tượng có phù hợp với nhiệm vụ không
    if (
      currentMission.targetType === "any" ||
      currentMission.targetType === targetType
    ) {
      currentMission.currentCount++;

      // Kiểm tra hoàn thành nhiệm vụ
      if (currentMission.currentCount >= currentMission.targetCount) {
        currentMission.completed = true;
        this.completeMission(currentMission);
        return true;
      }

      this.updateMissionDisplay();
    }

    return false;
  }

  private completeMission(mission: Mission): void {
    // Hiển thị thông báo hoàn thành nhiệm vụ
    this.showMissionCompleteNotification(mission);

    // Chuyển sang nhiệm vụ tiếp theo
    this.currentMissionIndex++;
    this.updateMissionDisplay();
  }

  private showMissionCompleteNotification(mission: Mission): void {
    const app = engine();
    const notification = new Container();
    notification.x = app.screen.width / 2;
    notification.y = app.screen.height / 2;

    // Background thông báo
    const background = new Graphics();
    background.rect(-200, -80, 400, 160);
    background.fill({ color: 0x4caf50, alpha: 0.95 });
    background.stroke({ color: 0xffffff, width: 4 });
    notification.addChild(background);

    // Text hoàn thành
    const completeText = new Text({
      text: "🎉 HOÀN THÀNH NHIỆM VỤ! 🎉",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 2 },
      }),
    });
    completeText.anchor.set(0.5);
    completeText.x = 0;
    completeText.y = -30;
    notification.addChild(completeText);

    // Text tên nhiệm vụ
    const missionNameText = new Text({
      text: mission.title,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xffff00,
        fontWeight: "bold",
      }),
    });
    missionNameText.anchor.set(0.5);
    missionNameText.x = 0;
    missionNameText.y = 0;
    notification.addChild(missionNameText);

    // Text phần thưởng
    const rewardText = new Text({
      text: `Phần thưởng: +${mission.reward.ammo} đạn, +${mission.reward.coins} xu`,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    rewardText.anchor.set(0.5);
    rewardText.x = 0;
    rewardText.y = 30;
    notification.addChild(rewardText);

    this.addChild(notification);

    // Animation
    notification.scale.set(0.1);
    const animate = () => {
      const currentScale = notification.scale.x;
      if (currentScale < 1) {
        notification.scale.set(currentScale + 0.1);
        requestAnimationFrame(animate);
      } else {
        // Xóa thông báo sau 3 giây
        setTimeout(() => {
          this.fadeOutNotification(notification);
        }, 3000);
      }
    };
    animate();
  }

  private fadeOutNotification(notification: Container): void {
    const fadeOut = () => {
      notification.alpha -= 0.05;
      if (notification.alpha > 0) {
        requestAnimationFrame(fadeOut);
      } else {
        this.removeChild(notification);
      }
    };
    fadeOut();
  }

  private updateMissionDisplay(): void {
    const currentMission = this.getCurrentMission();

    if (currentMission) {
      this.missionText.text = currentMission.description;
      this.progressText.text = `Tiến độ: ${currentMission.currentCount}/${currentMission.targetCount}`;
      this.rewardText.text = `Phần thưởng: +${currentMission.reward.ammo} đạn, +${currentMission.reward.coins} xu`;

      // Cập nhật thanh tiến độ
      const progress = currentMission.currentCount / currentMission.targetCount;
      const progressWidth = 330 * progress;

      this.progressBar.clear();
      this.progressBar.rect(10, 95, 330, 15);
      this.progressBar.fill({ color: 0x333333 });
      this.progressBar.stroke({ color: 0x666666, width: 1 });
      this.progressBar.rect(10, 95, progressWidth, 15);
      this.progressBar.fill({ color: 0x4caf50 });
    } else {
      this.missionText.text = "Tất cả nhiệm vụ đã hoàn thành!";
      this.progressText.text = "";
      this.rewardText.text = "";
    }
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
