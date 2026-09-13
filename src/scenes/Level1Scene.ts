import Phaser from "phaser";
import { loadLocalState, saveLocalState } from "../lib/localState";

type NpcConfig = {
  key: string;
  x: number;
  y: number;
  name: string;
  item: string;
  wants: string;
  accent: number;
  portrait: string;
};

export class Level1Scene extends Phaser.Scene {
  private visited = new Set<string>();
  private npcContainers = new Map<string, Phaser.GameObjects.Container>();
  private statusText!: Phaser.GameObjects.Text;
  private actionPanel?: Phaser.GameObjects.Container;
  private tradeStep = 0;

  constructor() {
    super("level1");
  }

  create() {
    this.drawWorld();
    this.drawHud();

    const npcs: NpcConfig[] = [
      {
        key: "baker",
        x: 250,
        y: 315,
        name: "نانوا",
        item: "🍞 نان",
        wants: "⚽ توپ",
        accent: 0xe98b43,
        portrait: "👨🏻‍🍳"
      },
      {
        key: "ballSeller",
        x: 640,
        y: 290,
        name: "توپ‌فروش",
        item: "⚽ توپ",
        wants: "🚲 دوچرخه",
        accent: 0x3b82f6,
        portrait: "🧔🏻"
      },
      {
        key: "bikeMaker",
        x: 1030,
        y: 320,
        name: "دوچرخه‌ساز",
        item: "🚲 دوچرخه",
        wants: "🍞 نان",
        accent: 0x22a06b,
        portrait: "👨🏻‍🔧"
      }
    ];

    npcs.forEach((npc) => this.createNpc(npc));

    this.drawSepehr();

    this.statusText = this.add.text(640, 632, "سه نفر در شهر نمی‌توانند معامله کنند. با هر سه صحبت کن.", {
      fontFamily: "Tahoma",
      fontSize: "21px",
      color: "#17324a",
      align: "center",
      wordWrap: { width: 900 }
    }).setOrigin(0.5).setDepth(12);

    this.showIntro();
  }

  private drawWorld() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor("#8fd5ff");

    this.add.rectangle(width / 2, 160, width, 320, 0x93d9ff);

    const g = this.add.graphics();
    g.fillStyle(0x7bb2d6, 1);
    g.fillTriangle(0, 290, 260, 75, 510, 290);
    g.fillTriangle(300, 290, 600, 95, 850, 290);
    g.fillTriangle(720, 290, 1010, 70, 1280, 290);

    g.fillStyle(0x6faa69, 1);
    g.fillRect(0, 250, 1280, 470);

    g.fillStyle(0xeed6a8, 1);
    g.fillRoundedRect(60, 250, 1160, 365, 34);

    g.fillStyle(0xb7ddff, 1);
    g.fillCircle(640, 430, 82);
    g.fillStyle(0xffffff, 0.85);
    g.fillCircle(640, 430, 52);
    g.fillStyle(0x4aa9e9, 1);
    g.fillCircle(640, 430, 36);

    this.createBuilding(110, 165, 245, 170, 0xffe1a6, 0xd86845, "نانوایی");
    this.createBuilding(520, 145, 245, 160, 0xfff4cc, 0xd85c53, "بازار");
    this.createBuilding(920, 170, 250, 165, 0xd9ecff, 0x4c77b6, "کارگاه");

    for (let i = 0; i < 14; i++) {
      const x = 55 + i * 92;
      this.add.circle(x, 560 + (i % 2) * 12, 18, i % 2 ? 0x77b95e : 0x5da94b);
    }
  }

  private createBuilding(x: number, y: number, w: number, h: number, body: number, roof: number, label: string) {
    const g = this.add.graphics();
    g.fillStyle(body, 1);
    g.fillRoundedRect(x, y, w, h, 12);
    g.fillStyle(roof, 1);
    g.fillTriangle(x - 14, y + 10, x + w / 2, y - 58, x + w + 14, y + 10);

    this.add.text(x + w / 2, y + 24, label, {
      fontFamily: "Tahoma",
      fontSize: "23px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);
  }

  private drawHud() {
    const state = loadLocalState();

    const profile = this.add.rectangle(145, 54, 250, 78, 0x1f5f91, 0.9)
      .setStrokeStyle(3, 0xffffff, 0.55)
      .setDepth(20);
    profile.setOrigin(0.5);

    this.add.circle(52, 54, 30, 0xffddb1).setDepth(21);
    this.add.text(52, 53, "🧒🏻", { fontSize: "31px" }).setOrigin(0.5).setDepth(22);

    this.add.text(95, 35, "سپهر", {
      fontFamily: "Tahoma",
      fontSize: "21px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setDepth(22);
    this.add.text(95, 61, "سطح ۱", {
      fontFamily: "Tahoma",
      fontSize: "15px",
      color: "#dceeff"
    }).setDepth(22);

    this.add.rectangle(600, 50, 150, 56, 0x184d77, 0.92).setDepth(20);
    this.add.text(600, 50, `سکه  ${state.coins}`, {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#ffe07a",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(21);

    this.add.rectangle(780, 50, 150, 56, 0x184d77, 0.92).setDepth(20);
    this.add.text(780, 50, `تجربه  ${state.xp}`, {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#fff6c7",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(21);

    this.add.text(1215, 48, "مرحله ۱", {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(1, 0.5).setDepth(20);
  }

  private drawSepehr() {
    const c = this.add.container(640, 520).setDepth(8);
    const shadow = this.add.ellipse(0, 55, 74, 22, 0x000000, 0.18);
    const body = this.add.rectangle(0, 15, 58, 82, 0xf0f5fb).setStrokeStyle(4, 0x315f89);
    const head = this.add.circle(0, -42, 31, 0xf1bf8c).setStrokeStyle(3, 0x8c5a3c);
    const hair = this.add.ellipse(-2, -59, 50, 22, 0x31231c);
    const bag = this.add.rectangle(-35, 18, 20, 52, 0x1f6fb2);
    c.add([shadow, bag, body, head, hair]);

    this.add.text(640, 590, "سپهر", {
      fontFamily: "Tahoma",
      fontSize: "18px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(10);
  }

  private createNpc(npc: NpcConfig) {
    const card = this.add.container(npc.x, npc.y).setDepth(9);

    const shadow = this.add.ellipse(0, 70, 126, 28, 0x000000, 0.16);
    const body = this.add.rectangle(0, 20, 94, 112, npc.accent, 1)
      .setStrokeStyle(4, 0xffffff, 0.78);
    const head = this.add.circle(0, -50, 42, 0xf2c28f)
      .setStrokeStyle(4, 0xffffff, 0.78);
    const portrait = this.add.text(0, -50, npc.portrait, { fontSize: "42px" }).setOrigin(0.5);

    const badge = this.add.rectangle(0, 103, 190, 58, 0xffffff, 0.96)
      .setStrokeStyle(3, npc.accent);
    const name = this.add.text(0, 90, npc.name, {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#16324f",
      fontStyle: "bold"
    }).setOrigin(0.5);
    const hint = this.add.text(0, 115, "برای گفتگو لمس کن", {
      fontFamily: "Tahoma",
      fontSize: "14px",
      color: "#52697c"
    }).setOrigin(0.5);

    const zone = this.add.zone(0, 20, 205, 230).setInteractive({ useHandCursor: true });
    card.add([shadow, body, head, portrait, badge, name, hint, zone]);

    zone.on("pointerdown", () => {
      this.tweens.add({ targets: card, scaleX: 1.05, scaleY: 1.05, yoyo: true, duration: 120 });
      this.openNpcDialog(npc);
    });

    this.npcContainers.set(npc.key, card);
  }

  private openNpcDialog(npc: NpcConfig) {
    this.visited.add(npc.key);

    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x102537, 0.48)
      .setDepth(50)
      .setInteractive();

    const panel = this.add.rectangle(640, 375, 720, 365, 0xfffbf0, 0.99)
      .setStrokeStyle(5, npc.accent)
      .setDepth(51);

    this.add.text(640, 250, npc.name, {
      fontFamily: "Tahoma",
      fontSize: "30px",
      color: "#18354f",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(52);

    this.add.text(640, 322, `من ${npc.item} دارم، اما چیزی که می‌خواهم ${npc.wants} است.`, {
      fontFamily: "Tahoma",
      fontSize: "24px",
      color: "#29485f",
      align: "center",
      wordWrap: { width: 610 }
    }).setOrigin(0.5).setDepth(52);

    this.add.text(640, 393, `دارم:  ${npc.item}\nمی‌خواهم:  ${npc.wants}`, {
      fontFamily: "Tahoma",
      fontSize: "22px",
      color: "#17324a",
      align: "center",
      lineSpacing: 12
    }).setOrigin(0.5).setDepth(52);

    const close = this.makeButton(640, 505, 220, 58, "فهمیدم", 0x2f9d55, () => {
      [overlay, panel, close.container].forEach((o) => o.destroy());
      this.children.list
        .filter((o) => (o as Phaser.GameObjects.GameObject & { depth?: number }).depth === 52)
        .forEach((o) => o.destroy());

      if (this.visited.size === 3) {
        this.statusText.setText("حالا نیاز هر سه نفر را می‌دانی. یک زنجیره معامله بساز.");
        this.time.delayedCall(250, () => this.showTradeChoice());
      } else {
        this.statusText.setText(`خوب! هنوز با ${3 - this.visited.size} نفر دیگر صحبت کن.`);
      }
    }, 52);
  }

  private showTradeChoice() {
    this.actionPanel?.destroy(true);

    const container = this.add.container(640, 605).setDepth(30);
    const bg = this.add.rectangle(0, 0, 980, 180, 0xfffbef, 0.98)
      .setStrokeStyle(4, 0x2b6f9f);

    const title = this.add.text(0, -58, "اولین معامله را از کجا شروع کنیم؟", {
      fontFamily: "Tahoma",
      fontSize: "24px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const a = this.makeButton(-300, 20, 265, 62, "🍞 نان → دوچرخه‌ساز", 0x2f9d55, () => {
      container.destroy(true);
      this.beginTradeChain();
    }, 31);

    const b = this.makeButton(0, 20, 265, 62, "🍞 نان → توپ‌فروش", 0xc76d3a, () => {
      this.wrongTrade("توپ‌فروش نان نمی‌خواهد؛ او دوچرخه می‌خواهد.", b.container);
    }, 31);

    const c = this.makeButton(300, 20, 265, 62, "⚽ توپ → دوچرخه‌ساز", 0xc76d3a, () => {
      this.wrongTrade("دوچرخه‌ساز توپ نمی‌خواهد؛ او نان می‌خواهد.", c.container);
    }, 31);

    container.add([bg, title, a.container, b.container, c.container]);
    this.actionPanel = container;
  }

  private wrongTrade(message: string, target: Phaser.GameObjects.Container) {
    this.statusText.setText(message);
    this.tweens.add({ targets: target, x: target.x - 8, yoyo: true, repeat: 3, duration: 60 });
  }

  private beginTradeChain() {
    this.tradeStep = 0;
    this.statusText.setText("آفرین! حالا زنجیره را کامل کن.");
    this.showNextTradeButton();
  }

  private showNextTradeButton() {
    this.actionPanel?.destroy(true);

    const steps = [
      {
        label: "معامله ۱: نان را به دوچرخه‌ساز بده",
        from: { x: 250, y: 315 },
        to: { x: 1030, y: 320 },
        item: "🍞",
        result: "دوچرخه‌ساز نان گرفت و دوچرخه را برای ادامه زنجیره داد."
      },
      {
        label: "معامله ۲: دوچرخه را به توپ‌فروش بده",
        from: { x: 1030, y: 320 },
        to: { x: 640, y: 290 },
        item: "🚲",
        result: "توپ‌فروش دوچرخه گرفت و توپ را داد."
      },
      {
        label: "معامله ۳: توپ را به نانوا بده",
        from: { x: 640, y: 290 },
        to: { x: 250, y: 315 },
        item: "⚽",
        result: "نانوا توپ گرفت. حالا هر سه نفر چیزی را که می‌خواستند دارند!"
      }
    ];

    if (this.tradeStep >= steps.length) {
      this.completeLevel();
      return;
    }

    const step = steps[this.tradeStep];

    const container = this.add.container(640, 613).setDepth(30);
    const bg = this.add.rectangle(0, 0, 770, 112, 0xfffbef, 0.98)
      .setStrokeStyle(4, 0x2f9d55);
    const text = this.add.text(-155, 0, step.label, {
      fontFamily: "Tahoma",
      fontSize: "21px",
      color: "#17324a",
      fontStyle: "bold",
      align: "right"
    }).setOrigin(0.5);
    const button = this.makeButton(260, 0, 190, 56, "انجام معامله", 0x2f9d55, () => {
      container.destroy(true);
      this.animateTrade(step.from, step.to, step.item, () => {
        this.statusText.setText(step.result);
        this.tradeStep += 1;
        this.time.delayedCall(900, () => this.showNextTradeButton());
      });
    }, 31);

    container.add([bg, text, button.container]);
    this.actionPanel = container;
  }

  private animateTrade(
    from: { x: number; y: number },
    to: { x: number; y: number },
    item: string,
    onComplete: () => void
  ) {
    const tokenBg = this.add.circle(from.x, from.y - 130, 34, 0xffffff)
      .setStrokeStyle(4, 0xf3c54a)
      .setDepth(40);
    const token = this.add.text(from.x, from.y - 130, item, { fontSize: "35px" })
      .setOrigin(0.5)
      .setDepth(41);

    this.tweens.add({
      targets: [tokenBg, token],
      x: to.x,
      y: to.y - 130,
      duration: 900,
      ease: "Sine.easeInOut",
      onComplete: () => {
        this.tweens.add({
          targets: [tokenBg, token],
          scaleX: 1.35,
          scaleY: 1.35,
          alpha: 0,
          duration: 260,
          onComplete: () => {
            tokenBg.destroy();
            token.destroy();
            onComplete();
          }
        });
      }
    });
  }

  private completeLevel() {
    const current = loadLocalState();
    saveLocalState({
      level1Completed: true,
      xp: Math.max(current.xp, 10),
      coins: Math.max(current.coins, 5)
    });

    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x102537, 0.62)
      .setDepth(70)
      .setInteractive();

    const panel = this.add.rectangle(640, 365, 720, 470, 0xfffbef, 1)
      .setStrokeStyle(6, 0x2f9d55)
      .setDepth(71);

    this.add.text(640, 190, "ماموریت انجام شد!", {
      fontFamily: "Tahoma",
      fontSize: "36px",
      color: "#176339",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(72);

    this.add.text(640, 280, "هر سه نفر بالاخره معامله کردند؛ اما برای رسیدن به نتیجه، سه معامله لازم شد.", {
      fontFamily: "Tahoma",
      fontSize: "23px",
      color: "#25485e",
      align: "center",
      wordWrap: { width: 610 }
    }).setOrigin(0.5).setDepth(72);

    this.add.text(640, 365, "اگر همه یک چیز مشترک را برای معامله قبول می‌کردند، کار خیلی ساده‌تر می‌شد.", {
      fontFamily: "Tahoma",
      fontSize: "22px",
      color: "#17324a",
      align: "center",
      fontStyle: "bold",
      wordWrap: { width: 590 }
    }).setOrigin(0.5).setDepth(72);

    this.add.text(640, 435, "+۱۰ تجربه      +۵ سکه", {
      fontFamily: "Tahoma",
      fontSize: "24px",
      color: "#b17600",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(72);

    const next = this.makeButton(640, 525, 260, 64, "ادامه", 0x2587d9, () => {
      overlay.destroy();
      panel.destroy();
      this.scene.start("home");
    }, 73);

    this.add.existing(next.container);
  }

  private showIntro() {
    const overlay = this.add.rectangle(640, 360, 1280, 720, 0x102537, 0.5)
      .setInteractive()
      .setDepth(80);
    const panel = this.add.rectangle(640, 350, 700, 380, 0xfffbef, 1)
      .setStrokeStyle(6, 0x2b74ae)
      .setDepth(81);

    this.add.text(640, 240, "سطح ۱", {
      fontFamily: "Tahoma",
      fontSize: "22px",
      color: "#35729f"
    }).setOrigin(0.5).setDepth(82);

    this.add.text(640, 300, "شهری بدون پول", {
      fontFamily: "Tahoma",
      fontSize: "40px",
      color: "#153b64",
      fontStyle: "bold"
    }).setOrigin(0.5).setDepth(82);

    this.add.text(640, 370, "وقتی پول نباشد، چطور چیزهایی را که می‌خواهیم به دست می‌آوریم؟", {
      fontFamily: "Tahoma",
      fontSize: "23px",
      color: "#304f64",
      align: "center",
      wordWrap: { width: 580 }
    }).setOrigin(0.5).setDepth(82);

    const start = this.makeButton(640, 470, 240, 64, "شروع", 0x2587d9, () => {
      overlay.destroy();
      panel.destroy();
      start.container.destroy();
      this.children.list
        .filter((o) => (o as Phaser.GameObjects.GameObject & { depth?: number }).depth === 82)
        .forEach((o) => o.destroy());
    }, 83);
  }

  private makeButton(
    x: number,
    y: number,
    width: number,
    height: number,
    label: string,
    color: number,
    onClick: () => void,
    depth = 10
  ) {
    const container = this.add.container(x, y).setDepth(depth);
    const bg = this.add.rectangle(0, 0, width, height, color, 1)
      .setStrokeStyle(3, 0xffffff, 0.65)
      .setInteractive({ useHandCursor: true });
    const text = this.add.text(0, 0, label, {
      fontFamily: "Tahoma",
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
      align: "center",
      wordWrap: { width: width - 20 }
    }).setOrigin(0.5);

    bg.on("pointerover", () => container.setScale(1.025));
    bg.on("pointerout", () => container.setScale(1));
    bg.on("pointerdown", onClick);

    container.add([bg, text]);
    return { container, bg, text };
  }
}
