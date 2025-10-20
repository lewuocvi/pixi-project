import { Container, Text, TextStyle, Graphics } from "pixi.js";
import { SoundManager } from "./SoundManager";
import { engine } from "../../getEngine";

export class GameUI extends Container {
  private coinsText!: Text;
  private levelText!: Text;
  private ammoText!: Text;
  private bulletLevelText!: Text;
  private coins: number = 0;
  private level: number = 1;
  private ammo: number = 1000;
  private bulletsPerShot: number = 1;
  private increaseBulletsButton!: Container;
  private decreaseBulletsButton!: Container;
  private bulletCountText!: Text;
  private player: any = null; // Reference to Player
  private cannon: any = null; // Reference to Cannon
  private eventEmitter: any = null; // Reference to EventEmitter

  constructor() {
    super();
    this.setupUI();
  }

  public setPlayer(player: any): void {
    this.player = player;
  }

  public setCannon(cannon: any): void {
    this.cannon = cannon;
  }

  public setEventEmitter(eventEmitter: any): void {
    this.eventEmitter = eventEmitter;
  }

  // Hiển thị hội thoại mua đạn khi hết đạn
  public showBuyAmmoDialog(): void {
    if (!this.player) return;

    const app = engine();
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    // Tạo hộp thoại
    const dialog = new Container();
    dialog.x = 0;
    dialog.y = 0;

    // Background đen mờ toàn màn hình
    const bg = new Graphics();
    bg.rect(0, 0, screenWidth, screenHeight);
    bg.fill({ color: 0x000000, alpha: 0.8 });
    dialog.addChild(bg);

    // Hộp thoại ở giữa màn hình
    const dialogBox = new Graphics();
    const dialogWidth = 400;
    const dialogHeight = 200;
    const dialogX = (screenWidth - dialogWidth) / 2;
    const dialogY = (screenHeight - dialogHeight) / 2;

    dialogBox.rect(dialogX, dialogY, dialogWidth, dialogHeight);
    dialogBox.fill({ color: 0x333333 });
    dialogBox.stroke({ color: 0xffffff, width: 3 });
    dialog.addChild(dialogBox);

    // Text tiêu đề
    const titleText = new Text({
      text: "Hết đạn!",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 28,
        fill: 0xff4444,
        fontWeight: "bold",
      }),
    });
    titleText.anchor.set(0.5);
    titleText.x = screenWidth / 2;
    titleText.y = dialogY + 50;
    dialog.addChild(titleText);

    // Text nội dung (sẽ được cập nhật động)
    const contentText = new Text({
      text: `Bạn có ${this.player.getCoins()} xu\nGiá: 10 xu cho 100 đạn`,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xffffff,
        align: "center",
      }),
    });
    contentText.anchor.set(0.5);
    contentText.x = screenWidth / 2;
    contentText.y = dialogY + 80;
    dialog.addChild(contentText);

    // Input số đạn cần mua
    const ammoInputContainer = new Container();
    ammoInputContainer.x = screenWidth / 2;
    ammoInputContainer.y = dialogY + 120;

    // Background cho input
    const inputBg = new Graphics();
    inputBg.rect(-60, -15, 120, 30);
    inputBg.fill({ color: 0x444444 });
    inputBg.stroke({ color: 0xffffff, width: 2 });
    ammoInputContainer.addChild(inputBg);

    // Text input
    const ammoInputText = new Text({
      text: "100",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    ammoInputText.anchor.set(0.5);
    ammoInputContainer.addChild(ammoInputText);

    // Text label
    const inputLabel = new Text({
      text: "Số đạn:",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xcccccc,
      }),
    });
    inputLabel.anchor.set(1, 0.5);
    inputLabel.x = -70;
    inputLabel.y = 0;
    ammoInputContainer.addChild(inputLabel);

    dialog.addChild(ammoInputContainer);

    // Biến để lưu số đạn muốn mua
    let ammoToBuy = 100;

    // Nút tăng số đạn
    const increaseButton = new Container();
    increaseButton.x = screenWidth / 2 + 80;
    increaseButton.y = dialogY + 120;

    const increaseButtonBg = new Graphics();
    increaseButtonBg.circle(0, 0, 12);
    increaseButtonBg.fill({ color: 0x4caf50 });
    increaseButtonBg.stroke({ color: 0xffffff, width: 1 });
    increaseButton.addChild(increaseButtonBg);

    const increaseButtonText = new Text({
      text: "+",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    increaseButtonText.anchor.set(0.5);
    increaseButton.addChild(increaseButtonText);

    increaseButton.interactive = true;
    increaseButton.cursor = "pointer";
    increaseButton.on("pointerdown", () => {
      ammoToBuy += 100;
      ammoInputText.text = ammoToBuy.toString();
    });

    dialog.addChild(increaseButton);

    // Nút giảm số đạn
    const decreaseButton = new Container();
    decreaseButton.x = screenWidth / 2 - 80;
    decreaseButton.y = dialogY + 120;

    const decreaseButtonBg = new Graphics();
    decreaseButtonBg.circle(0, 0, 12);
    decreaseButtonBg.fill({ color: 0xf44336 });
    decreaseButtonBg.stroke({ color: 0xffffff, width: 1 });
    decreaseButton.addChild(decreaseButtonBg);

    const decreaseButtonText = new Text({
      text: "-",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    decreaseButtonText.anchor.set(0.5);
    decreaseButton.addChild(decreaseButtonText);

    decreaseButton.interactive = true;
    decreaseButton.cursor = "pointer";
    decreaseButton.on("pointerdown", () => {
      if (ammoToBuy > 100) {
        ammoToBuy -= 100;
        ammoInputText.text = ammoToBuy.toString();
      }
    });

    dialog.addChild(decreaseButton);

    // Nút mua
    const buyButton = new Container();
    buyButton.x = screenWidth / 2 - 50;
    buyButton.y = dialogY + 160;

    const buyButtonBg = new Graphics();
    buyButtonBg.rect(0, 0, 80, 35);
    buyButtonBg.fill({ color: 0x4caf50 });
    buyButtonBg.stroke({ color: 0xffffff, width: 2 });
    buyButton.addChild(buyButtonBg);

    const buyButtonText = new Text({
      text: "Mua",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    buyButtonText.anchor.set(0.5);
    buyButtonText.x = 40;
    buyButtonText.y = 17.5;
    buyButton.addChild(buyButtonText);

    buyButton.interactive = true;
    buyButton.cursor = "pointer";
    buyButton.on("pointerdown", () => {
      const cost = Math.ceil(ammoToBuy / 100) * 10; // Tính giá dựa trên số đạn
      const currentCoins = this.player.getCoins();

      if (this.player && currentCoins >= cost) {
        // Mua thành công
        this.player.coins -= cost;
        this.player.ammo += ammoToBuy;
        this.updateAmmo(this.player.getAmmo(), this.player.getBulletsPerShot());
        this.updateCoins(this.player.getCoins());

        // Cập nhật text nội dung với số xu mới
        contentText.text = `Bạn có ${this.player.getCoins()} xu\nGiá: 10 xu cho 100 đạn`;

        // Hiển thị thông báo mua thành công với hiệu ứng đẹp (không xóa các nút)
        const successContainer = new Container();
        successContainer.x = screenWidth / 2;
        successContainer.y = dialogY + 200; // Đặt thấp hơn để không che nút

        // Background cho thông báo
        const successBg = new Graphics();
        successBg.rect(-120, -30, 240, 60);
        successBg.fill({ color: 0x1b5e20 });
        successBg.stroke({ color: 0x4caf50, width: 3 });
        successContainer.addChild(successBg);

        // Icon checkmark
        const checkIcon = new Graphics();
        checkIcon.circle(0, 0, 20);
        checkIcon.fill({ color: 0x4caf50 });
        checkIcon.stroke({ color: 0xffffff, width: 2 });
        checkIcon.x = -80;
        successContainer.addChild(checkIcon);

        const checkText = new Text({
          text: "✓",
          style: new TextStyle({
            fontFamily: "Arial",
            fontSize: 20,
            fill: 0xffffff,
            fontWeight: "bold",
          }),
        });
        checkText.anchor.set(0.5);
        checkText.x = -80;
        successContainer.addChild(checkText);

        // Text thông báo
        const successText = new Text({
          text: `Mua thành công!\n+${ammoToBuy} đạn\n-${cost} xu`,
          style: new TextStyle({
            fontFamily: "Arial",
            fontSize: 16,
            fill: 0x4caf50,
            fontWeight: "bold",
            align: "center",
          }),
        });
        successText.anchor.set(0.5);
        successText.x = 0;
        successContainer.addChild(successText);

        dialog.addChild(successContainer);

        // Hiệu ứng animation
        successContainer.scale.set(0.5);
        successContainer.alpha = 0;

        // Animation scale và fade in
        const animateIn = () => {
          if (successContainer.scale.x < 1) {
            successContainer.scale.x += 0.1;
            successContainer.scale.y += 0.1;
            successContainer.alpha += 0.1;
            requestAnimationFrame(animateIn);
          }
        };
        animateIn();

        // Phát âm thanh thành công
        SoundManager.getInstance().playHover();

        // Tự động ẩn thông báo thành công sau 2 giây
        setTimeout(() => {
          if (dialog.parent && dialog.parent.children.includes(dialog)) {
            dialog.removeChild(successContainer);
          }
        }, 2000);

        console.log(`Mua đạn thành công! +${ammoToBuy} đạn, -${cost} xu`);
      } else {
        // Không đủ xu - hiển thị thông báo lỗi
        const errorContainer = new Container();
        errorContainer.x = screenWidth / 2;
        errorContainer.y = dialogY + 200;

        // Background cho thông báo lỗi
        const errorBg = new Graphics();
        errorBg.rect(-150, -25, 300, 50);
        errorBg.fill({ color: 0x4a1a1a });
        errorBg.stroke({ color: 0xf44336, width: 3 });
        errorContainer.addChild(errorBg);

        // Icon warning
        const warningIcon = new Graphics();
        warningIcon.circle(0, 0, 18);
        warningIcon.fill({ color: 0xf44336 });
        warningIcon.stroke({ color: 0xffffff, width: 2 });
        warningIcon.x = -120;
        errorContainer.addChild(warningIcon);

        const warningText = new Text({
          text: "!",
          style: new TextStyle({
            fontFamily: "Arial",
            fontSize: 18,
            fill: 0xffffff,
            fontWeight: "bold",
          }),
        });
        warningText.anchor.set(0.5);
        warningText.x = -120;
        errorContainer.addChild(warningText);

        // Text thông báo lỗi
        const errorText = new Text({
          text: `Không đủ xu!\nCần: ${cost} xu\nHiện có: ${currentCoins} xu`,
          style: new TextStyle({
            fontFamily: "Arial",
            fontSize: 14,
            fill: 0xf44336,
            fontWeight: "bold",
            align: "center",
          }),
        });
        errorText.anchor.set(0.5);
        errorText.x = 0;
        errorContainer.addChild(errorText);

        dialog.addChild(errorContainer);

        // Hiệu ứng shake
        let shakeOffset = 0;
        const shake = () => {
          errorContainer.x = screenWidth / 2 + (Math.random() - 0.5) * 10;
          shakeOffset++;
          if (shakeOffset < 20) {
            requestAnimationFrame(shake);
          } else {
            errorContainer.x = screenWidth / 2; // Reset position
          }
        };
        shake();

        // Phát âm thanh lỗi (có thể thay bằng âm thanh lỗi khác)
        SoundManager.getInstance().playHover();

        // Tự động ẩn thông báo lỗi sau 3 giây
        setTimeout(() => {
          if (dialog.parent && dialog.parent.children.includes(dialog)) {
            dialog.removeChild(errorContainer);
          }
        }, 3000);

        console.log(`Không đủ xu! Cần ${cost} xu để mua ${ammoToBuy} đạn`);
      }
    });

    dialog.addChild(buyButton);

    // Nút X để đóng hội thoại
    const closeButton = new Container();
    closeButton.x = dialogX + dialogWidth - 20;
    closeButton.y = dialogY + 20;

    const closeButtonBg = new Graphics();
    closeButtonBg.circle(0, 0, 15);
    closeButtonBg.fill({ color: 0xf44336 });
    closeButtonBg.stroke({ color: 0xffffff, width: 2 });
    closeButton.addChild(closeButtonBg);

    const closeButtonText = new Text({
      text: "X",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 16,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    closeButtonText.anchor.set(0.5);
    closeButton.addChild(closeButtonText);

    closeButton.interactive = true;
    closeButton.cursor = "pointer";
    closeButton.on("pointerdown", () => {
      this.removeChild(dialog);
      // Dừng auto shooting để tránh bắn đạn ngoài ý muốn
      if (this.cannon) {
        this.cannon.stopAutoShooting();
      }
      // Tiếp tục game với delay nhỏ để tránh bắn đạn ngay lập tức
      setTimeout(() => {
        this.resumeGame();
      }, 100); // Delay 100ms
    });

    dialog.addChild(closeButton);

    this.addChild(dialog);

    // Tạm dừng game
    this.pauseGame();
  }

  // Tạm dừng game
  private pauseGame(): void {
    // Emit event để FishingGameScreen tạm dừng
    this.eventEmitter?.emit("pauseGame");
  }

  // Tiếp tục game
  private resumeGame(): void {
    // Emit event để FishingGameScreen tiếp tục
    this.eventEmitter?.emit("resumeGame");
  }

  // Kiểm tra xem click có nằm trong nút điều chỉnh không
  public isClickOnBulletButtons(x: number, y: number): boolean {
    if (!this.increaseBulletsButton || !this.decreaseBulletsButton)
      return false;

    // Kiểm tra nút tăng đạn
    const increaseBounds = this.increaseBulletsButton.getBounds();
    if (
      x >= increaseBounds.x - increaseBounds.width / 2 &&
      x <= increaseBounds.x + increaseBounds.width / 2 &&
      y >= increaseBounds.y - increaseBounds.height / 2 &&
      y <= increaseBounds.y + increaseBounds.height / 2
    ) {
      return true;
    }

    // Kiểm tra nút giảm đạn
    const decreaseBounds = this.decreaseBulletsButton.getBounds();
    if (
      x >= decreaseBounds.x - decreaseBounds.width / 2 &&
      x <= decreaseBounds.x + decreaseBounds.width / 2 &&
      y >= decreaseBounds.y - decreaseBounds.height / 2 &&
      y <= decreaseBounds.y + decreaseBounds.height / 2
    ) {
      return true;
    }

    return false;
  }

  private setupUI(): void {
    const app = engine();
    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    // Thanh UI dưới màn hình (giống như trong ảnh)
    const bottomUIBar = new Graphics();
    bottomUIBar.rect(0, screenHeight - 100, screenWidth, 100);
    bottomUIBar.fill({ color: 0x1a1a1a, alpha: 0.9 });
    bottomUIBar.stroke({ color: 0x333333, width: 2 });
    this.addChild(bottomUIBar);

    // Thanh UI trên màn hình
    const topUIBar = new Graphics();
    topUIBar.rect(0, 0, screenWidth, 80);
    topUIBar.fill({ color: 0x000000, alpha: 0.8 });
    this.addChild(topUIBar);

    // Example style kept here if needed for future reuse
    // const textStyle = new TextStyle({
    //   fontFamily: "Arial",
    //   fontSize: 32,
    //   fill: 0xffffff,
    //   fontWeight: "bold",
    //   stroke: { color: 0x000000, width: 2 },
    // });

    // Text xu (dưới súng, bên trái)
    this.coinsText = new Text({
      text: "Xu: 100",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 20,
        fill: 0xffff00,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 1 },
      }),
    });
    this.coinsText.x = screenWidth / 2 - 100; // Bên trái súng
    this.coinsText.y = screenHeight - 40; // Dưới súng (súng ở y = screenHeight - 80)
    this.addChild(this.coinsText);

    // Text đạn (dưới súng, bên phải)
    this.ammoText = new Text({
      text: "Đạn: 1000",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0x00ff00,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 1 },
      }),
    });
    this.ammoText.x = screenWidth / 2 + 50; // Bên phải súng
    this.ammoText.y = screenHeight - 40; // Dưới súng (súng ở y = screenHeight - 80)
    this.addChild(this.ammoText);

    // Text cấp độ (góc trên phải)
    this.levelText = new Text({
      text: "Cấp: 1",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0x00ff00,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 2 },
      }),
    });
    this.levelText.x = screenWidth - 100;
    this.levelText.y = 20;
    this.addChild(this.levelText);

    // Text cấp đạn (thanh dưới, bên trái)
    this.bulletLevelText = new Text({
      text: "Đạn cấp 1",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 18,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    this.bulletLevelText.x = 20;
    this.bulletLevelText.y = screenHeight - 60;
    this.addChild(this.bulletLevelText);

    // Tạo nút tăng/giảm đạn ở 2 bên súng
    this.setupBulletButtons(screenWidth, screenHeight);
  }

  private setupBulletButtons(screenWidth: number, screenHeight: number): void {
    // Nút tăng đạn (bên phải súng)
    this.increaseBulletsButton = new Container();
    this.increaseBulletsButton.x = screenWidth / 2 + 150;
    this.increaseBulletsButton.y = screenHeight - 80;

    // Vẽ nút tăng
    const increaseButtonBg = new Graphics();
    increaseButtonBg.circle(0, 0, 25);
    increaseButtonBg.fill({ color: 0x4caf50 });
    increaseButtonBg.stroke({ color: 0xffffff, width: 3 });
    this.increaseBulletsButton.addChild(increaseButtonBg);

    // Text dấu +
    const increaseText = new Text({
      text: "+",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    increaseText.anchor.set(0.5);
    this.increaseBulletsButton.addChild(increaseText);

    // Làm nút có thể click
    this.increaseBulletsButton.interactive = true;
    this.increaseBulletsButton.cursor = "pointer";
    this.increaseBulletsButton.on("pointerdown", () => {
      this.onIncreaseBullets();
    });

    this.addChild(this.increaseBulletsButton);

    // Nút giảm đạn (bên trái súng)
    this.decreaseBulletsButton = new Container();
    this.decreaseBulletsButton.x = screenWidth / 2 - 150;
    this.decreaseBulletsButton.y = screenHeight - 80;

    // Vẽ nút giảm
    const decreaseButtonBg = new Graphics();
    decreaseButtonBg.circle(0, 0, 25);
    decreaseButtonBg.fill({ color: 0xf44336 });
    decreaseButtonBg.stroke({ color: 0xffffff, width: 3 });
    this.decreaseBulletsButton.addChild(decreaseButtonBg);

    // Text dấu -
    const decreaseText = new Text({
      text: "-",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: "bold",
      }),
    });
    decreaseText.anchor.set(0.5);
    this.decreaseBulletsButton.addChild(decreaseText);

    // Làm nút có thể click
    this.decreaseBulletsButton.interactive = true;
    this.decreaseBulletsButton.cursor = "pointer";
    this.decreaseBulletsButton.on("pointerdown", () => {
      this.onDecreaseBullets();
    });

    this.addChild(this.decreaseBulletsButton);

    // Hiển thị số đạn bắn ra trên súng
    this.setupBulletCountDisplay(screenWidth, screenHeight);
  }

  private setupBulletCountDisplay(
    screenWidth: number,
    screenHeight: number,
  ): void {
    // Text hiển thị số đạn bắn ra đè lên giữa súng
    this.bulletCountText = new Text({
      text: `${this.bulletsPerShot}`,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: "bold",
        stroke: { color: 0x000000, width: 3 },
        dropShadow: {
          color: 0x000000,
          blur: 4,
          angle: Math.PI / 4,
          distance: 2,
        },
      }),
    });
    this.bulletCountText.anchor.set(0.5);
    this.bulletCountText.x = screenWidth / 2; // Giữa màn hình
    this.bulletCountText.y = screenHeight - 80; // Đè lên giữa súng
    this.addChild(this.bulletCountText);
  }

  private onIncreaseBullets(): void {
    // Tăng số đạn bắn ra 1 lần (không giới hạn)
    this.bulletsPerShot++;
    // Đồng bộ với Player
    if (this.player) {
      this.player.bulletsPerShot = this.bulletsPerShot;
    }
    this.updateBulletLevelText();
    SoundManager.getInstance().playHover();
  }

  private onDecreaseBullets(): void {
    // Giảm số đạn bắn ra 1 lần (tối thiểu 1)
    if (this.bulletsPerShot > 1) {
      this.bulletsPerShot--;
      // Đồng bộ với Player
      if (this.player) {
        this.player.bulletsPerShot = this.bulletsPerShot;
      }
      this.updateBulletLevelText();
      SoundManager.getInstance().playHover();
    }
  }

  private updateBulletLevelText(): void {
    if (this.bulletLevelText) {
      this.bulletLevelText.text = `Sức mạnh: ${this.bulletsPerShot} đạn/lần`;
    }
    // Cập nhật text trên súng
    if (this.bulletCountText) {
      this.bulletCountText.text = `${this.bulletsPerShot}`;
    }
  }

  public updateCoins(coins: number): void {
    if (coins > this.coins) {
      // Hiệu ứng khi tăng xu
      this.coinsText.scale.set(1.2);
      this.coinsText.tint = 0xffdd00;
      setTimeout(() => {
        this.coinsText.scale.set(1);
        this.coinsText.tint = 0xffffff;
      }, 200);
    }
    this.coins = coins;
    this.coinsText.text = `Xu: ${this.coins}`;
  }

  public isSoundEnabled(): boolean {
    return true; // Luôn bật âm thanh
  }

  // Hiệu ứng cộng xu bay vào vị trí hiển thị
  public showCoinGain(amount: number, fromX: number, fromY: number): void {
    // Tạo container cho hiệu ứng xu rơi
    const coinContainer = new Container();
    coinContainer.x = fromX;
    coinContainer.y = fromY;
    this.addChild(coinContainer);

    // Vẽ hình tròn vàng bao bọc xu (giống như xu thật)
    const coinGraphics = new Graphics();
    coinGraphics.circle(0, 0, 20);
    coinGraphics.fill({ color: 0xffdd00 }); // Màu vàng
    coinGraphics.stroke({ color: 0xffaa00, width: 2 }); // Viền vàng đậm
    coinContainer.addChild(coinGraphics);

    // Tạo text xu với dấu +
    const coinText = new Text({
      text: `+${amount}`,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0x000000,
        fontWeight: "bold",
      }),
    });
    coinText.anchor.set(0.5);
    coinContainer.addChild(coinText);

    // Vận tốc ban đầu giống như xu
    let vx = (Math.random() - 0.5) * 100; // Vận tốc ngang ngẫu nhiên
    let vy = -200; // Bay lên trên
    const gravity = 300; // Trọng lực
    let life = 5000; // 5 giây

    const animate = () => {
      // Cập nhật vị trí
      coinContainer.x += vx * 0.016;
      coinContainer.y += vy * 0.016;

      // Áp dụng trọng lực
      vy += gravity * 0.016;

      // Giảm vận tốc ngang
      vx *= 0.98;

      // Giảm thời gian sống
      life -= 16;

      // Kiểm tra thu thập khi gần vị trí xu
      const targetX = this.coinsText.x + 50;
      const targetY = this.coinsText.y + 10;
      const distance = Math.sqrt(
        (coinContainer.x - targetX) ** 2 + (coinContainer.y - targetY) ** 2,
      );

      if (distance < 50) {
        // Thu thập xu
        this.removeChild(coinContainer);
        coinContainer.destroy();
        return;
      }

      // Xóa nếu hết thời gian sống hoặc rơi xuống đáy
      if (life <= 0 || coinContainer.y > 1000) {
        this.removeChild(coinContainer);
        coinContainer.destroy();
        return;
      }

      requestAnimationFrame(animate);
    };
    animate();
  }

  // Hiệu ứng cộng đạn rơi xuống giống như xu
  public showAmmoGain(amount: number, fromX: number, fromY: number): void {
    // Tạo container cho hiệu ứng đạn rơi
    const ammoContainer = new Container();
    ammoContainer.x = fromX;
    ammoContainer.y = fromY;
    this.addChild(ammoContainer);

    // Vẽ hình tròn xanh bao bọc đạn (giống như xu vàng)
    const ammoGraphics = new Graphics();
    ammoGraphics.circle(0, 0, 20);
    ammoGraphics.fill({ color: 0x00dd00 }); // Màu xanh lá
    ammoGraphics.stroke({ color: 0x00aa00, width: 2 }); // Viền xanh đậm
    ammoContainer.addChild(ammoGraphics);

    // Tạo text đạn
    const ammoText = new Text({
      text: `+${amount}`,
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0x000000,
        fontWeight: "bold",
      }),
    });
    ammoText.anchor.set(0.5);
    ammoContainer.addChild(ammoText);

    // Vận tốc ban đầu giống như xu
    let vx = (Math.random() - 0.5) * 100; // Vận tốc ngang ngẫu nhiên
    let vy = -200; // Bay lên trên
    const gravity = 300; // Trọng lực
    let life = 5000; // 5 giây

    const animate = () => {
      // Cập nhật vị trí
      ammoContainer.x += vx * 0.016;
      ammoContainer.y += vy * 0.016;

      // Áp dụng trọng lực
      vy += gravity * 0.016;

      // Giảm vận tốc ngang
      vx *= 0.98;

      // Giảm thời gian sống
      life -= 16;

      // Kiểm tra thu thập khi gần vị trí đạn
      const targetX = this.ammoText.x + 50;
      const targetY = this.ammoText.y + 10;
      const distance = Math.sqrt(
        (ammoContainer.x - targetX) ** 2 + (ammoContainer.y - targetY) ** 2,
      );

      if (distance < 50) {
        // Thu thập đạn
        this.removeChild(ammoContainer);
        ammoContainer.destroy();
        return;
      }

      // Xóa nếu hết thời gian sống hoặc rơi xuống đáy
      if (life <= 0 || ammoContainer.y > 1000) {
        this.removeChild(ammoContainer);
        ammoContainer.destroy();
        return;
      }

      requestAnimationFrame(animate);
    };
    animate();
  }

  public updateLevel(level: number): void {
    this.level = level;
    if (this.levelText) {
      this.levelText.text = `Cấp: ${this.level}`;
    }
  }

  public updateAmmo(ammo: number, bulletsPerShot: number): void {
    this.ammo = ammo;
    this.bulletsPerShot = bulletsPerShot;
    if (this.ammoText) {
      this.ammoText.text = `Đạn: ${this.ammo}`;
    }
    if (this.bulletLevelText) {
      this.bulletLevelText.text = `Sức mạnh: ${this.bulletsPerShot} đạn/lần`;
    }
  }

  public getBulletsPerShot(): number {
    return this.bulletsPerShot;
  }

  public setBulletsPerShot(bulletsPerShot: number): void {
    this.bulletsPerShot = bulletsPerShot;
    this.updateBulletLevelText();
  }
}
