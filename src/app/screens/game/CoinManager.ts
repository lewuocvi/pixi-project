import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { EventEmitter } from "events";

export class CoinManager extends Container {
  private coins: any[] = [];
  private eventEmitter: EventEmitter;

  constructor() {
    super();
    this.eventEmitter = new EventEmitter();
  }

  public createCoin(x: number, y: number, value: number): void {
    const coin = new Container();

    // Vẽ xu
    const coinGraphics = new Graphics();
    coinGraphics.circle(0, 0, 15);
    coinGraphics.fill({ color: 0xffdd00 });
    coinGraphics.stroke({ color: 0xffaa00, width: 2 });
    coin.addChild(coinGraphics);

    // Thêm text giá trị
    const textStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0x000000,
      fontWeight: "bold",
    });

    const valueText = new Text({
      text: value.toString(),
      style: textStyle,
    });
    valueText.anchor.set(0.5);
    coin.addChild(valueText);

    coin.x = x;
    coin.y = y;

    const coinObj = {
      container: coin,
      value: value,
      vx: (Math.random() - 0.5) * 100, // Vận tốc ngẫu nhiên
      vy: -200, // Bay lên trên
      gravity: 300, // Trọng lực
      life: 5000, // 5 giây
      collected: false,
    };

    this.addChild(coin);
    this.coins.push(coinObj);
  }

  public update(deltaTime: number): void {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const coin = this.coins[i];

      if (coin.collected) {
        this.removeCoin(coin);
        continue;
      }

      // Cập nhật vị trí
      coin.container.x += coin.vx * (deltaTime / 1000);
      coin.container.y += coin.vy * (deltaTime / 1000);

      // Áp dụng trọng lực
      coin.vy += coin.gravity * (deltaTime / 1000);

      // Giảm vận tốc ngang
      coin.vx *= 0.98;

      // Giảm thời gian sống
      coin.life -= deltaTime;

      // Kiểm tra thu thập (click chuột)
      this.checkCollection(coin);

      // Xóa xu nếu hết thời gian sống hoặc rơi xuống đáy
      if (coin.life <= 0 || coin.container.y > 1000) {
        this.removeCoin(coin);
      }
    }
  }

  private checkCollection(coin: any): void {
    // Kiểm tra click chuột trên xu
    coin.container.interactive = true;
    coin.container.cursor = "pointer";

    coin.container.on("pointerdown", () => {
      if (!coin.collected) {
        coin.collected = true;
        this.eventEmitter.emit("coinCollected", coin);

        // Hiệu ứng thu thập
        this.createCollectionEffect(coin.container.x, coin.container.y);
      }
    });
  }

  private createCollectionEffect(x: number, y: number): void {
    // Tạo hiệu ứng thu thập xu
    const effect = new Graphics();
    effect.circle(0, 0, 5);
    effect.fill({ color: 0xffff00, alpha: 0.8 });
    effect.x = x;
    effect.y = y;

    this.addChild(effect);

    // Animation thu nhỏ và biến mất
    const animate = () => {
      effect.scale.x *= 0.9;
      effect.scale.y *= 0.9;
      effect.alpha *= 0.9;

      if (effect.alpha > 0.1) {
        requestAnimationFrame(animate);
      } else {
        this.removeChild(effect);
        effect.destroy();
      }
    };

    animate();
  }

  public removeCoin(coin: any): void {
    const index = this.coins.indexOf(coin);
    if (index > -1) {
      this.coins.splice(index, 1);
      this.removeChild(coin.container);
      coin.container.destroy();
    }
  }

  public addEventListener(
    event: string,
    listener: (...args: any[]) => void,
  ): void {
    this.eventEmitter.on(event, listener);
  }

  public removeEventListener(
    event: string,
    listener: (...args: any[]) => void,
  ): void {
    this.eventEmitter.off(event, listener);
  }
}
