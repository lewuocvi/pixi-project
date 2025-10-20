import { Container } from "pixi.js";
import { TargetManager } from "./TargetManager";
import { Target } from "./Target";
import { EventEmitter } from "events";

export class FishManager extends Container {
  private targetManager: TargetManager;
  public eventEmitter: EventEmitter;

  constructor() {
    super();
    this.targetManager = new TargetManager();
    this.eventEmitter = this.targetManager.eventEmitter;
    this.addChild(this.targetManager);
  }

  public async initialize(): Promise<void> {
    await this.targetManager.initialize();
  }

  public update(deltaTime: number): void {
    this.targetManager.update(deltaTime);
  }

  public removeTarget(target: Target): void {
    this.targetManager.removeTarget(target);
  }

  public getTargets(): Target[] {
    return this.targetManager.getTargets();
  }

  public getFishes(): Target[] {
    return this.targetManager.getFishes();
  }

  public getAdvertisements(): Target[] {
    return this.targetManager.getAdvertisements();
  }

  public getBosses(): Target[] {
    return this.targetManager.getBosses();
  }

  public getTargetsByRarity(
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary",
  ): Target[] {
    return this.targetManager.getTargetsByRarity(rarity);
  }

  public setSpawnInterval(interval: number): void {
    this.targetManager.setSpawnInterval(interval);
  }

  public setFishSpawnChance(chance: number): void {
    this.targetManager.setFishSpawnChance(chance);
  }

  public getTargetCount(): number {
    return this.targetManager.getTargetCount();
  }

  public getTargetCountByCategory(category: "fish" | "advertisement"): number {
    return this.targetManager.getTargetCountByCategory(category);
  }

  public getTargetCountByRarity(
    rarity: "common" | "uncommon" | "rare" | "epic" | "legendary",
  ): number {
    return this.targetManager.getTargetCountByRarity(rarity);
  }

  public clearAllTargets(): void {
    this.targetManager.clearAllTargets();
  }

  public spawnSpecificTarget(
    type: string,
    category: "fish" | "advertisement",
  ): Target | null {
    return this.targetManager.spawnSpecificTarget(type, category);
  }

  // Boss management methods
  public getActiveBossTypes(): string[] {
    return this.targetManager.getActiveBossTypes();
  }

  public hasActiveBoss(): boolean {
    return this.targetManager.hasActiveBoss();
  }

  public getActiveBossCount(): number {
    return this.targetManager.getActiveBossCount();
  }
}
