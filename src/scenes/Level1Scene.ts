import Phaser from "phaser";
import {
  Level1State,
  NpcKey,
  ItemKey,
  loadLevel1State,
  saveLevel1State,
  resetLevel1State,
  hasItem,
  addKnowledge,
  addLog,
  advanceTime,
  adjustTrust,
  trade
} from "../game/level1State";

type Point = { x: number; y: number };
type Action = {
  label: string;
  enabled?: boolean;
  run: () => void;
};

const NPC_POS: Record<NpcKey, Point> = {
  baker: { x: 180, y: 280 },
  farmer: { x: 330, y: 500 },
  carpenter: { x: 1020, y: 500 },
  mechanic: { x: 920, y: 270 },
  ballSeller: { x: 650, y: 210 }
};

const ITEM_LABEL: Record<ItemKey, string> = {
  bread: "نان",
  carrot: "هویج",
  wood: "چوب",
  old_bike: "دوچرخه خراب",
  repaired_bike: "دوچرخه سالم",
  ball: "توپ"
};

export class Level1Scene extends Phaser.Scene {
  private state!: Level1State;
  private player!: Phaser.GameObjects.Container;
  private hudText!: Phaser.GameObjects.Text;
  private inventoryText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private modal?: Phaser.GameObjects.Container;
  private moving = false;
  private pickupObjects: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super("level1");
  }

  preload() {
    this.load.svg("town-bg", "assets/level1/town.svg");
    this.load.svg("sepehr-art", "assets/level1/sepehr.svg");
    this.load.svg("baker-art", "assets/level1/baker.svg");
    this.load.svg("farmer-art", "assets/level1/farmer.svg");
    this.load.svg("mechanic-art", "assets/level1/mechanic.svg");
    this.load.svg("carpenter-art", "assets/level1/carpenter.svg");
    this.load.svg("ball-seller-art", "assets/level1/ball-seller.svg");
  }

  create() {
    this.state = loadLevel1State();
    this.drawWorld();
    this.drawPlayer();
    this.drawHud();
    this.refreshWorld();
    this.showIntroIfNeeded();
  }

  private drawWorld() {
    this.cameras.main.setBackgroundColor("#79c8ed");

    this.add.image(640, 360, "town-bg")
      .setDisplaySize(1280, 720)
      .setDepth(0);

    this.add.rectangle(640, 52, 1280, 104, 0x0f3048, 0.73).setDepth(10);

    const questPill = this.add.container(640, 108).setDepth(12);
    const qBg = this.add.rectangle(0, 0, 610, 48, 0xfffbef, 0.96)
      .setStrokeStyle(3, 0xffffff, 0.8);
    const qText = this.add.text(0, 0, "ماموریت: راهی پیدا کن تا توپ به نانوا برسد", {
      fontFamily: "Tahoma",
      fontSize: "19px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);
    questPill.add([qBg, qText]);

    const walkZone = this.add.zone(640, 410, 1180, 510).setInteractive();
    walkZone.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.modal || this.moving) return;
      this.movePlayerTo(pointer.worldX, pointer.worldY);
    });

    this.createNpc("baker", "نانوا", 0xd96d4c);
    this.createNpc("farmer", "کشاورز", 0x59a85b);
    this.createNpc("carpenter", "نجار", 0x9d7047);
    this.createNpc("mechanic", "تعمیرکار", 0x4f78b7);
    this.createNpc("ballSeller", "توپ‌فروش", 0xe49b2f);

    const hidden = this.add.zone(810, 565, 92, 92)
      .setInteractive({ useHandCursor: true })
      .setDepth(4);
    hidden.on("pointerdown", () => {
      if (this.modal || this.moving) return;
      this.movePlayerTo(810, 560, () => this.discoverStorage());
    });
  }

  private placeBuilding(x: number, y: number, w: number, h: number, color: number, label: string) {
    const g = this.add.graphics();
    g.fillStyle(color, 1);
    g.fillRoundedRect(x, y, w, h, 12);
    g.fillStyle(0xffffff, 0.35);
    g.fillTriangle(x - 8, y + 5, x + w / 2, y - 48, x + w + 8, y + 5);
    this.add.text(x + w / 2, y + 20, label, {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#18374d",
      fontStyle: "bold"
    }).setOrigin(0.5);
  }

  private createNpc(key: NpcKey, label: string, _color: number) {
    const pos = NPC_POS[key];
    const texture: Record<NpcKey, string> = {
      baker: "baker-art",
      farmer: "farmer-art",
      carpenter: "carpenter-art",
      mechanic: "mechanic-art",
      ballSeller: "ball-seller-art"
    };

    const c = this.add.container(pos.x, pos.y).setDepth(6);
    const glow = this.add.circle(0, 28, 58, 0xffffff, 0.18);
    const art = this.add.image(0, -8, texture[key]).setDisplaySize(86, 116);
    const nameBg = this.add.rectangle(0, 60, 100, 29, 0x17324a, 0.88)
      .setStrokeStyle(2, 0xffffff, 0.7);
    const text = this.add.text(0, 60, label, {
      fontFamily: "Tahoma",
      fontSize: "14px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);
    const marker = this.add.circle(36, -52, 13, 0xffd85a)
      .setStrokeStyle(3, 0xffffff, 0.9);
    const markerText = this.add.text(36, -53, "!", {
      fontFamily: "Tahoma",
      fontSize: "17px",
      color: "#684b00",
      fontStyle: "bold"
    }).setOrigin(0.5);
    const zone = this.add.zone(0, 0, 112, 145).setInteractive({ useHandCursor: true });
    c.add([glow, art, nameBg, text, marker, markerText, zone]);

    this.tweens.add({
      targets: marker,
      scaleX: 1.15,
      scaleY: 1.15,
      yoyo: true,
      repeat: -1,
      duration: 850
    });

    zone.on("pointerdown", () => {
      if (this.modal || this.moving) return;
      this.movePlayerTo(pos.x, pos.y + 72, () => this.openNpc(key));
    });
  }

  private drawPlayer() {
    this.player = this.add.container(640, 590).setDepth(9);
    const shadow = this.add.ellipse(0, 50, 68, 20, 0x17324a, 0.2);
    const art = this.add.image(0, 0, "sepehr-art").setDisplaySize(88, 120);
    this.player.add([shadow, art]);

    this.tweens.add({
      targets: art,
      y: -4,
      yoyo: true,
      repeat: -1,
      duration: 1100,
      ease: "Sine.easeInOut"
    });
  }

  private drawHud() {
    const profile = this.add.container(118, 50).setDepth(21);
    const pBg = this.add.rectangle(0, 0, 196, 62, 0xfffbef, 0.96)
      .setStrokeStyle(2, 0xffffff, 0.8);
    const portrait = this.add.image(-66, 0, "sepehr-art").setDisplaySize(42, 57);
    const name = this.add.text(5, -13, "سپهر", {
      fontFamily: "Tahoma",
      fontSize: "18px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);
    const level = this.add.text(5, 13, "مرحله ۱", {
      fontFamily: "Tahoma",
      fontSize: "13px",
      color: "#587184"
    }).setOrigin(0.5);
    profile.add([pBg, portrait, name, level]);

    const timeCard = this.add.rectangle(410, 50, 190, 54, 0x17324a, 0.9)
      .setStrokeStyle(2, 0xffffff, 0.65)
      .setDepth(20);
    this.hudText = this.add.text(410, 50, "", {
      fontFamily: "Tahoma",
      fontSize: "17px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(21);
    timeCard.setData("role", "time");

    const bagCard = this.add.rectangle(1045, 50, 420, 54, 0xfffbef, 0.94)
      .setStrokeStyle(2, 0xffffff, 0.75)
      .setDepth(20);
    this.inventoryText = this.add.text(1045, 50, "", {
      fontFamily: "Tahoma",
      fontSize: "15px",
      color: "#17324a",
      align: "center",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(21);
    bagCard.setData("role", "bag");

    this.statusText = this.add.text(640, 662, "", {
      fontFamily: "Tahoma",
      fontSize: "16px",
      color: "#17324a",
      backgroundColor: "#fff8dfdd",
      padding: { x: 16, y: 8 },
      align: "center"
    }).setOrigin(0.5).setDepth(15);

    const reset = this.add.text(1190, 670, "شروع دوباره", {
      fontFamily: "Tahoma",
      fontSize: "13px",
      color: "#ffffff",
      backgroundColor: "#9a4c48dd",
      padding: { x: 10, y: 7 }
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true }).setDepth(20);
    reset.on("pointerdown", () => {
      this.state = resetLevel1State();
      this.scene.restart();
    });

    this.refreshHud("شهر را بگرد؛ لازم نیست از مسیر مشخصی بروی.");
  }

  private movePlayerTo(x: number, y: number, done?: () => void) {
    const nx = Phaser.Math.Clamp(x, 90, 1190);
    const ny = Phaser.Math.Clamp(y, 170, 610);
    this.moving = true;
    this.tweens.add({
      targets: this.player,
      x: nx,
      y: ny,
      duration: Phaser.Math.Distance.Between(this.player.x, this.player.y, nx, ny) * 2.1,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.moving = false;
        done?.();
      }
    });
  }

  private openNpc(key: NpcKey) {
    switch (key) {
      case "baker":
        this.openBaker();
        break;
      case "farmer":
        this.openFarmer();
        break;
      case "carpenter":
        this.openCarpenter();
        break;
      case "mechanic":
        this.openMechanic();
        break;
      case "ballSeller":
        this.openBallSeller();
        break;
    }
  }

  private openBaker() {
    if (hasItem(this.state, "ball")) {
      this.openPanel(
        "نانوا",
        "توپ را پیدا کردی! می‌خواهی همین حالا تحویلش بدهی؟",
        [{
          label: "توپ را تحویل بده",
          run: () => this.finishLevel()
        }]
      );
      return;
    }

    const actions: Action[] = [];

    if (!this.state.flags.bakeryBreadTaken) {
      actions.push({
        label: "یک نان برای معامله بگیر",
        run: () => {
          this.state.inventory.bread += 1;
          this.state.flags.bakeryBreadTaken = true;
          adjustTrust(this.state, "baker", 1);
          addKnowledge(this.state, "farmer_wants_bread");
          addLog(this.state, "نانوا یک نان برای پیدا کردن توپ در اختیار سپهر گذاشت.");
          this.persist("نان گرفتی. حالا ببین چه کسی برای نان ارزش قائل است.");
        }
      });
    }

    actions.push({
      label: "فقط یک سرنخ بگیر",
      run: () => {
        addKnowledge(this.state, "farmer_wants_bread");
        this.state.xp += 1;
        addLog(this.state, "سرنخ: کشاورز امروز دنبال نان است.");
        this.persist("نانوا گفت کشاورز امروز دنبال نان است.");
      }
    });

    this.openPanel(
      "نانوا",
      "برای فرزندم یک توپ می‌خواهم، اما پولی در شهر نیست. من نان دارم؛ شاید به کارت بیاید.",
      actions
    );
  }

  private openFarmer() {
    const actions: Action[] = [];

    if (hasItem(this.state, "bread") && !this.state.flags.farmerBikeTraded) {
      actions.push({
        label: "نان را با دوچرخه سالم عوض کن",
        run: () => {
          trade(this.state, { bread: 1 }, { repaired_bike: 1 });
          this.state.flags.farmerBikeTraded = true;
          adjustTrust(this.state, "farmer", 1);
          this.state.flags.bikeRepaired = true;
          addLog(this.state, "نان با دوچرخه سالم معاوضه شد.");
          this.persist("مسیر سریع را انتخاب کردی؛ نان خرج شد و دوچرخه سالم گرفتی.");
        }
      });
    }

    if (!this.state.flags.farmerBoxesHelped) {
      actions.push({
        label: "به جابه‌جایی جعبه‌ها کمک کن",
        run: () => {
          this.state.flags.farmerBoxesHelped = true;
          this.state.inventory.carrot += 2;
          adjustTrust(this.state, "farmer", 2);
          advanceTime(this.state, 1);
          addKnowledge(this.state, "carpenter_wants_carrot");
          this.state.xp += 2;
          addLog(this.state, "سپهر برای کشاورز کار کرد و دو هویج گرفت.");
          this.persist("دو هویج گرفتی، ولی زمان هم گذشت.");
        }
      });
    }

    actions.push({
      label: "بپرس چه چیزی لازم دارد",
      run: () => {
        addKnowledge(this.state, "farmer_wants_bread");
        addKnowledge(this.state, "carpenter_wants_carrot");
        this.state.xp += 1;
        this.persist("کشاورز نان می‌خواهد و می‌گوید نجار هویج دوست دارد.");
      }
    });

    this.openPanel(
      "کشاورز",
      "یک دوچرخه سالم دارم که با نان عوض می‌کنم؛ اگر هم کمکم کنی، راه دیگری برای جبران پیدا می‌کنم.",
      actions
    );
  }

  private openCarpenter() {
    const actions: Action[] = [];

    if (hasItem(this.state, "carrot")) {
      actions.push({
        label: "یک هویج را با چوب عوض کن",
        run: () => {
          trade(this.state, { carrot: 1 }, { wood: 1 });
          adjustTrust(this.state, "carpenter", 1);
          addKnowledge(this.state, "storage_shortcut_known");
          addLog(this.state, "هویج با چوب معاوضه شد.");
          this.persist("چوب گرفتی. نجار همچنین از یک انبار کوچک کنار رودخانه گفت.");
        }
      });
    }

    actions.push({
      label: "درباره شهر سؤال کن",
      run: () => {
        addKnowledge(this.state, "storage_shortcut_known");
        this.state.xp += 1;
        this.persist("نجار گفت کنار رودخانه یک انبار کوچک هست که خیلی‌ها حواسشان به آن نیست.");
      }
    });

    this.openPanel(
      "نجار",
      "برای کارم چوب دارم. اگر هویج داشته باشی، می‌توانیم معامله کنیم.",
      actions
    );
  }

  private openMechanic() {
    const actions: Action[] = [];

    if (hasItem(this.state, "old_bike")) {
      if (hasItem(this.state, "wood")) {
        actions.push({
          label: "چوب بده و دوچرخه را تعمیر کن",
          run: () => {
            trade(this.state, { old_bike: 1, wood: 1 }, { repaired_bike: 1 });
            this.state.flags.bikeRepaired = true;
            adjustTrust(this.state, "mechanic", 1);
            addLog(this.state, "دوچرخه با استفاده از چوب تعمیر شد.");
            this.persist("دوچرخه سالم شد.");
          }
        });
      }

      if (this.state.trust.mechanic >= 2) {
        actions.push({
          label: "از اعتمادت استفاده کن و تعمیر بخواه",
          run: () => {
            trade(this.state, { old_bike: 1 }, { repaired_bike: 1 });
            this.state.flags.bikeRepaired = true;
            addLog(this.state, "تعمیرکار به‌خاطر اعتماد شکل‌گرفته، دوچرخه را بدون کالا تعمیر کرد.");
            this.persist("اعتماد قبلی جواب داد؛ دوچرخه سالم شد.");
          }
        });
      }
    }

    if (!this.state.flags.mechanicHelped) {
      actions.push({
        label: "در کارگاه کمک کن",
        run: () => {
          this.state.flags.mechanicHelped = true;
          adjustTrust(this.state, "mechanic", 2);
          advanceTime(this.state, 1);
          this.state.xp += 2;
          addKnowledge(this.state, "mechanic_can_repair_bike");
          addLog(this.state, "سپهر در کارگاه کمک کرد و اعتماد تعمیرکار بالا رفت.");
          this.persist("تعمیرکار حالا بهت اعتماد دارد، اما زمان گذشت.");
        }
      });
    }

    actions.push({
      label: "بپرس چه چیزی تعمیر می‌کند",
      run: () => {
        addKnowledge(this.state, "mechanic_can_repair_bike");
        this.state.xp += 1;
        this.persist("تعمیرکار می‌تواند دوچرخه خراب را درست کند؛ با چوب یا اعتماد کافی.");
      }
    });

    this.openPanel(
      "تعمیرکار",
      "من دوچرخه تعمیر می‌کنم. اگر مواد لازم داشته باشی یا قبلاً به من کمک کرده باشی، راهی پیدا می‌کنیم.",
      actions
    );
  }

  private openBallSeller() {
    if (this.state.flags.marketClosed && this.state.time !== "next_day") {
      this.openPanel(
        "فروشگاه توپ",
        "مغازه برای امروز بسته شده. می‌توانی تا فردا صبر کنی؛ فقط پاداش سرعت را از دست می‌دهی.",
        [{
          label: "تا فردا صبر کن",
          run: () => {
            this.state.time = "next_day";
            this.state.flags.marketClosed = false;
            addLog(this.state, "سپهر تا روز بعد صبر کرد.");
            this.persist("روز بعد شد. فروشگاه دوباره باز است.");
          }
        }]
      );
      return;
    }

    const actions: Action[] = [];

    if (hasItem(this.state, "repaired_bike")) {
      actions.push({
        label: "دوچرخه سالم را با توپ عوض کن",
        run: () => {
          trade(this.state, { repaired_bike: 1 }, { ball: 1 });
          adjustTrust(this.state, "ballSeller", 1);
          addLog(this.state, "دوچرخه سالم با توپ معاوضه شد.");
          this.persist("توپ را گرفتی. حالا باید به نانوا برگردی.");
        }
      });
    }

    if (hasItem(this.state, "old_bike") && !hasItem(this.state, "repaired_bike")) {
      actions.push({
        label: "دوچرخه خراب را پیشنهاد بده",
        run: () => {
          addKnowledge(this.state, "ball_seller_wants_repaired_bike");
          this.state.xp += 1;
          addLog(this.state, "توپ‌فروش دوچرخه خراب را نپذیرفت و سرنخ تعمیر داد.");
          this.persist("توپ‌فروش گفت دوچرخه خراب برایش ارزشی ندارد؛ اگر سالم باشد، قبول می‌کند.");
        }
      });
    }

    if (!this.state.flags.ballsTaskActive && !this.state.flags.ballSellerHelped) {
      actions.push({
        label: "بپرس راه دیگری برای گرفتن توپ هست؟",
        run: () => {
          this.state.flags.ballsTaskActive = true;
          addKnowledge(this.state, "ball_seller_side_task_known");
          this.state.xp += 1;
          this.persist("سه توپ از مغازه بیرون افتاده. اگر پیدایشان کنی، می‌توانی بدون معامله کالا یک توپ بگیری.");
        }
      });
    }

    const foundCount = ["ball1Found", "ball2Found", "ball3Found"]
      .filter((flag) => this.state.flags[flag]).length;

    if (this.state.flags.ballsTaskActive && foundCount === 3 && !this.state.flags.ballSellerHelped) {
      actions.push({
        label: "سه توپ پیدا شده را تحویل بده",
        run: () => {
          this.state.flags.ballSellerHelped = true;
          this.state.inventory.ball += 1;
          adjustTrust(this.state, "ballSeller", 2);
          advanceTime(this.state, 1);
          this.state.xp += 3;
          addLog(this.state, "خدمت مستقیم برای توپ‌فروش انجام شد و توپ به‌عنوان پاداش داده شد.");
          this.persist("توپ‌فروش به‌خاطر کمکت یک توپ داد. مسیر خدمت جواب داد.");
        }
      });
    }

    this.openPanel(
      "توپ‌فروش",
      "یک توپ دارم. دوچرخه سالم برایم ارزشمند است، ولی شاید راه دیگری هم برای کمک به هم پیدا کنیم.",
      actions
    );
  }

  private discoverStorage() {
    if (this.state.flags.optionalStorageFound) {
      this.refreshHud("این انبار را قبلاً پیدا کرده‌ای.");
      return;
    }

    if (!this.state.knowledge.includes("storage_shortcut_known")) {
      this.refreshHud("چیزی اینجاست، ولی فعلاً نمی‌دانی باید دنبال چه بگردی.");
      return;
    }

    this.state.flags.optionalStorageFound = true;
    this.state.xp += 2;
    addLog(this.state, "انبار مخفی کنار رودخانه پیدا شد.");
    this.state.inventory.wood += 1;
    this.persist("یک تکه چوب قابل‌استفاده در انبار پیدا کردی. این کشف اختیاری بود.");
  }

  private refreshWorld() {
    this.pickupObjects.forEach((o) => o.destroy());
    this.pickupObjects = [];

    if (this.state.flags.ballsTaskActive && !this.state.flags.ballSellerHelped) {
      const spots = [
        { flag: "ball1Found", x: 455, y: 330 },
        { flag: "ball2Found", x: 790, y: 515 },
        { flag: "ball3Found", x: 1110, y: 365 }
      ];

      spots.forEach((spot, index) => {
        if (this.state.flags[spot.flag]) return;
        const ball = this.add.circle(spot.x, spot.y, 18, 0x3d80d9)
          .setStrokeStyle(4, 0xffffff)
          .setInteractive({ useHandCursor: true })
          .setDepth(5);
        const label = this.add.text(spot.x, spot.y + 30, `توپ ${index + 1}`, {
          fontFamily: "Tahoma",
          fontSize: "13px",
          color: "#17324a"
        }).setOrigin(0.5).setDepth(5);

        ball.on("pointerdown", () => {
          if (this.modal || this.moving) return;
          this.movePlayerTo(spot.x, spot.y + 45, () => {
            this.state.flags[spot.flag] = true;
            this.state.xp += 1;
            addLog(this.state, `توپ افتاده شماره ${index + 1} پیدا شد.`);
            this.persist("یک توپ افتاده پیدا کردی.");
          });
        });

        this.pickupObjects.push(ball, label);
      });
    }
  }

  private openPanel(title: string, body: string, actions: Action[]) {
    this.closeModal();

    const portraitTexture: Record<string, string> = {
      "نانوا": "baker-art",
      "کشاورز": "farmer-art",
      "نجار": "carpenter-art",
      "تعمیرکار": "mechanic-art",
      "فروشگاه توپ": "ball-seller-art",
      "توپ‌فروش": "ball-seller-art",
      "بازار بدون پول": "sepehr-art",
      "ماموریت انجام شد": "sepehr-art"
    };

    const container = this.add.container(640, 382).setDepth(50);
    const shade = this.add.rectangle(0, 0, 1280, 720, 0x102537, 0.58)
      .setInteractive();

    const shadow = this.add.rectangle(8, 10, 930, 446, 0x0b2233, 0.28);
    const panel = this.add.rectangle(0, 0, 930, 446, 0xfffbef, 0.99)
      .setStrokeStyle(5, 0xffffff, 0.9);

    const portraitCard = this.add.rectangle(-335, -20, 205, 315, 0xdff2fb, 1)
      .setStrokeStyle(3, 0x9bcfe8, 1);
    const portrait = this.add.image(-335, -28, portraitTexture[title] ?? "sepehr-art")
      .setDisplaySize(150, 202);

    const titleText = this.add.text(130, -165, title, {
      fontFamily: "Tahoma",
      fontSize: "31px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const bodyText = this.add.text(130, -95, body, {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#29485f",
      align: "right",
      rtl: true,
      wordWrap: { width: 545 },
      lineSpacing: 8
    }).setOrigin(0.5);

    container.add([shade, shadow, panel, portraitCard, portrait, titleText, bodyText]);

    const usableActions = actions.filter((a) => a.enabled !== false);
    usableActions.slice(0, 4).forEach((action, index) => {
      const y = 15 + index * 66;
      const button = this.makeButton(130, y, 525, 52, action.label, index === 0 ? 0x2f9d55 : 0x2f87c7, () => {
        this.closeModal();
        action.run();
      });
      container.add(button);
    });

    const close = this.makeButton(-335, 173, 170, 42, "فعلاً نه", 0x71808a, () => this.closeModal());
    container.add(close);

    this.modal = container;
  }

  private makeButton(x: number, y: number, w: number, h: number, label: string, color: number, onClick: () => void) {
    const c = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, w, h, color, 1)
      .setStrokeStyle(2, 0xffffff, 0.7)
      .setInteractive({ useHandCursor: true });
    const text = this.add.text(0, 0, label, {
      fontFamily: "Tahoma",
      fontSize: "17px",
      color: "#ffffff",
      fontStyle: "bold",
      align: "center",
      wordWrap: { width: w - 20 }
    }).setOrigin(0.5);
    bg.on("pointerover", () => c.setScale(1.02));
    bg.on("pointerout", () => c.setScale(1));
    bg.on("pointerdown", onClick);
    c.add([bg, text]);
    return c;
  }

  private closeModal() {
    this.modal?.destroy(true);
    this.modal = undefined;
  }

  private persist(message: string) {
    saveLevel1State(this.state);
    this.closeModal();
    this.refreshHud(message);
    this.refreshWorld();
  }

  private refreshHud(message?: string) {
    const timeLabel: Record<string, string> = {
      morning: "صبح",
      noon: "ظهر",
      afternoon: "بعدازظهر",
      sunset: "غروب",
      next_day: "روز بعد"
    };

    this.hudText.setText(`${timeLabel[this.state.time]}   •   تجربه ${this.state.xp}`);

    const entries = (Object.entries(this.state.inventory) as [ItemKey, number][])
      .filter(([, count]) => count > 0)
      .map(([item, count]) => `${ITEM_LABEL[item]} ×${count}`);

    this.inventoryText.setText(entries.length ? `کیف من:  ${entries.join("   |   ")}` : "کیف من: خالی");
    if (message) this.statusText.setText(message);
  }

  private finishLevel() {
    this.state.inventory.ball = Math.max(0, this.state.inventory.ball - 1);
    this.state.flags.levelSolved = true;
    this.state.completed = true;
    adjustTrust(this.state, "baker", this.state.time === "sunset" || this.state.time === "next_day" ? 1 : 2);

    if (this.state.flags.ballSellerHelped) {
      this.state.route = "service";
    } else if (this.state.flags.farmerBoxesHelped || this.state.flags.mechanicHelped) {
      this.state.route = this.state.flags.farmerBikeTraded ? "mixed" : "trust";
    } else {
      this.state.route = "trade";
    }

    const beforeSunset = this.state.time !== "sunset" && this.state.time !== "next_day";
    this.state.xp += beforeSunset ? 6 : 3;
    addLog(this.state, "توپ به نانوا رسید و مرحله حل شد.");
    saveLevel1State(this.state);
    this.closeModal();

    const routeText: Record<string, string> = {
      trade: "راه سریع را انتخاب کردی و بیشتر با کالاها معامله کردی.",
      trust: "با کمک‌کردن و ساختن اعتماد به نتیجه رسیدی.",
      service: "به‌جای زنجیره کالا، از خدمت و همکاری برای رسیدن به توپ استفاده کردی.",
      mixed: "مسیرت را در راه تغییر دادی و چند روش را با هم ترکیب کردی."
    };

    this.openPanel(
      "ماموریت انجام شد",
      `${routeText[this.state.route ?? "mixed"]}\n\nبرای رساندن یک توپ، چند نفر باید خواسته‌های متفاوتشان را با هم هماهنگ می‌کردند. اگر چیزی وجود داشت که همه حاضر بودند آن را قبول کنند، چه چیزی در این شهر ساده‌تر می‌شد؟`,
      [{
        label: "برگشت به شهر",
        run: () => this.scene.start("home")
      }]
    );
  }

  private showIntroIfNeeded() {
    if (this.state.log.length > 0) {
      this.refreshHud("بازی از آخرین تصمیمت ادامه پیدا کرد.");
      return;
    }

    this.openPanel(
      "بازار بدون پول",
      "نانوا برای فرزندش یک توپ می‌خواهد. در این شهر پول وجود ندارد. شهر را بگرد، با آدم‌ها حرف بزن و راه خودت را پیدا کن. هیچ مسیر واحدی وجود ندارد.",
      [{
        label: "شروع جست‌وجو",
        run: () => {
          addLog(this.state, "سپهر وارد بازار بدون پول شد.");
          saveLevel1State(this.state);
          this.refreshHud("اول تصمیم بگیر کجا می‌خواهی بروی.");
        }
      }]
    );
  }
}
