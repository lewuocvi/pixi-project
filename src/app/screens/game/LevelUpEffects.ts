import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { engine } from "../../getEngine";

export class LevelUpEffects {
  private parent: Container;

  constructor(parent: Container) {
    this.parent = parent;
  }

  public showLevelUpNotification(
    playerLevel: number,
    bulletsPerShot: number,
  ): void {
    // Tạo container cho thông báo
    const notificationContainer = new Container();
    const app = engine();
    notificationContainer.x = app.screen.width / 2;
    notificationContainer.y = app.screen.height / 2;

    // Tạo hiệu ứng particles
    this.createLevelUpParticles(
      notificationContainer.x,
      notificationContainer.y,
    );

    // Background với hiệu ứng
    const background = new Graphics();
    background.rect(-250, -80, 500, 160);
    background.fill({ color: 0x4caf50, alpha: 0.95 });
    background.stroke({ color: 0xffffff, width: 4 });

    // Hiệu ứng ánh sáng xung quanh
    const glowEffect = new Graphics();
    glowEffect.circle(0, 0, 300);
    glowEffect.fill({ color: 0x4caf50, alpha: 0.3 });
    notificationContainer.addChild(glowEffect);
    notificationContainer.addChild(background);

    // Text lên cấp với hiệu ứng
    const levelUpText = new Text({
      text: `🎉 LEVEL UP! 🎉`,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 36,
        fill: 0xffffff,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 3 },
      }),
    });
    levelUpText.anchor.set(0.5);
    levelUpText.x = 0;
    levelUpText.y = -20;

    // Text cấp độ mới
    const levelText = new Text({
      text: `Cấp ${playerLevel}`,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffff00,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 2 },
      }),
    });
    levelText.anchor.set(0.5);
    levelText.x = 0;
    levelText.y = 20;

    // Text thông tin đạn
    const bulletText = new Text({
      text: `Sức mạnh: ${bulletsPerShot} đạn/lần!`,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    bulletText.anchor.set(0.5);
    bulletText.x = 0;
    bulletText.y = 50;

    notificationContainer.addChild(levelUpText);
    notificationContainer.addChild(levelText);
    notificationContainer.addChild(bulletText);

    // Animation scale
    notificationContainer.scale.set(0.1);
    this.parent.addChild(notificationContainer);

    // Tạo animation
    const animate = () => {
      const currentScale = notificationContainer.scale.x;
      if (currentScale < 1) {
        notificationContainer.scale.set(currentScale + 0.1);
        requestAnimationFrame(animate);
      } else {
        // Animation hoàn thành, bắt đầu fade out sau 2 giây
        setTimeout(() => {
          this.fadeOutNotification(notificationContainer);
        }, 2000);
      }
    };
    animate();
  }

  private createLevelUpParticles(x: number, y: number): void {
    // Tạo particles xung quanh vị trí lên cấp
    for (let i = 0; i < 20; i++) {
      const particle = new Graphics();
      const angle = (Math.PI * 2 * i) / 20;
      const distance = 100 + Math.random() * 50;

      particle.circle(0, 0, 3 + Math.random() * 3);
      particle.fill({
        color: [0xffff00, 0xff6600, 0xff0000, 0x00ffff][
          Math.floor(Math.random() * 4)
        ],
        alpha: 0.8,
      });

      particle.x = x + Math.cos(angle) * distance;
      particle.y = y + Math.sin(angle) * distance;

      this.parent.addChild(particle);

      // Animation particle
      const animateParticle = () => {
        particle.alpha -= 0.02;
        particle.scale.x += 0.05;
        particle.scale.y += 0.05;
        particle.y -= 2;

        if (particle.alpha > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          this.parent.removeChild(particle);
        }
      };
      animateParticle();
    }
  }

  private fadeOutNotification(notification: Container): void {
    const fadeOut = () => {
      notification.alpha -= 0.05;
      if (notification.alpha > 0) {
        requestAnimationFrame(fadeOut);
      } else {
        this.parent.removeChild(notification);
      }
    };
    fadeOut();
  }
}
