export class Player {
  public level: number = 1;
  public ammo: number = 1000; // Số đạn hiện có (không giới hạn)
  public bulletsPerShot: number = 1; // Số đạn bắn ra 1 lần
  public coins: number = 100;

  constructor() {
    // Không cần tính kinh nghiệm nữa
  }

  // Lên cấp khi hoàn thành nhiệm vụ
  public levelUp(): void {
    this.level++;
    // Tăng sức mạnh súng theo cấp (không giới hạn)
    this.bulletsPerShot = this.level; // Không giới hạn số đạn
    // Không hồi đạn khi lên cấp - người chơi phải kiếm đạn
  }

  // Bắn đạn - trừ đạn
  public shoot(): boolean {
    if (this.ammo >= this.bulletsPerShot) {
      this.ammo -= this.bulletsPerShot;
      return true;
    }
    return false;
  }

  // Giết cá - cộng đạn (không giới hạn)
  public addAmmo(amount: number): void {
    this.ammo += amount;
  }

  // Kiểm tra có đủ đạn để bắn không
  public canShoot(): boolean {
    return this.ammo >= this.bulletsPerShot;
  }

  public addCoins(amount: number): void {
    this.coins += amount;
  }

  // Mua đạn bằng xu
  public buyAmmo(): boolean {
    const ammoPrice = 10; // 10 xu
    const ammoAmount = 100; // 100 viên đạn

    if (this.coins >= ammoPrice) {
      this.coins -= ammoPrice;
      this.ammo += ammoAmount;
      return true; // Mua thành công
    }
    return false; // Không đủ xu
  }

  // Kiểm tra có thể mua đạn không
  public canBuyAmmo(): boolean {
    return this.coins >= 10;
  }

  public getCoins(): number {
    return this.coins;
  }

  public getLevel(): number {
    return this.level;
  }

  public getAmmo(): number {
    return this.ammo;
  }

  public getBulletsPerShot(): number {
    return this.bulletsPerShot;
  }
}
