import Phaser from "phaser";
import { loadLocalState } from "../lib/localState";

export class HomeScene extends Phaser.Scene {
  constructor() {
    super("home");
  }

  create() {
    const { width, height } = this.scale;
    const state = loadLocalState();

    this.cameras.main.setBackgroundColor("#87ceeb");

    this.add.rectangle(width / 2, height / 2, width, height, 0x8ed0f5);

    const g = this.add.graphics();
    g.fillStyle(0x7cb2d4, 1);
    g.fillTriangle(0, 300, 250, 80, 520, 300);
    g.fillTriangle(420, 300, 730, 60, 980, 300);
    g.fillTriangle(800, 300, 1080, 90, 1280, 300);

    g.fillStyle(0x73b56a, 1);
    g.fillRect(0, 255, width, height - 255);
    g.fillStyle(0xe8d6ae, 1);
    g.fillRoundedRect(70, 290, 1140, 345, 42);

    this.add.circle(640, 450, 90, 0xa9dcff);
    this.add.circle(640, 450, 50, 0xffffff, 0.85);
    this.add.circle(640, 450, 35, 0x4aa9e9);

    this.add.rectangle(145, 55, 250, 78, 0x1f5f91, 0.92)
      .setStrokeStyle(3, 0xffffff, 0.5);
    this.add.circle(52, 54, 30, 0xffddb1);
    this.add.text(52, 53, "🧒🏻", { fontSize: "31px" }).setOrigin(0.5);

    this.add.text(95, 32, "سپهر", {
      fontFamily: "Tahoma",
      fontSize: "22px",
      color: "#ffffff",
      fontStyle: "bold"
    });
    this.add.text(95, 61, "سطح ۱", {
      fontFamily: "Tahoma",
      fontSize: "15px",
      color: "#dceeff"
    });

    this.add.rectangle(555, 50, 150, 56, 0x184d77, 0.92);
    this.add.text(555, 50, `سکه  ${state.coins}`, {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#ffe07a",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.rectangle(735, 50, 150, 56, 0x184d77, 0.92);
    this.add.text(735, 50, `تجربه  ${state.xp}`, {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#fff6c7",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.createPlace(235, 365, "🏦", "بانک", "فعلاً قفل", 0xede3c9);
    this.createPlace(640, 335, "🏪", "فروشگاه", "به‌زودی", 0xffe3c2);
    this.createPlace(1045, 385, "🛒", "بازار", "ماموریت ۱", 0xd9f0d2);

    this.drawSepehr();

    const panel = this.add.rectangle(640, 604, 780, 150, 0xfffbef, 0.98)
      .setStrokeStyle(4, state.level1Completed ? 0x2f9d55 : 0x2587d9);

    this.add.text(640, 560, state.level1Completed ? "ماموریت ۱ انجام شد!" : "ماموریت جدید!", {
      fontFamily: "Tahoma",
      fontSize: "26px",
      color: state.level1Completed ? "#176339" : "#174c75",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(
      640,
      602,
      state.level1Completed
        ? "شهر بدون پول را حل کردی. می‌توانی دوباره بازی کنی یا منتظر مرحله بعد بمانی."
        : "سه نفر در شهر گیر افتاده‌اند چون چیزی که همدیگر می‌خواهند را مستقیم ندارند.",
      {
        fontFamily: "Tahoma",
        fontSize: "19px",
        color: "#2a475b",
        align: "center",
        wordWrap: { width: 640 }
      }
    ).setOrigin(0.5);

    const button = this.add.rectangle(640, 657, 250, 52, 0x2b8dd8, 1)
      .setStrokeStyle(3, 0xffffff, 0.7)
      .setInteractive({ useHandCursor: true });

    this.add.text(640, 657, state.level1Completed ? "دوباره بازی کن" : "شروع ماموریت", {
      fontFamily: "Tahoma",
      fontSize: "19px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    button.on("pointerover", () => button.setScale(1.03));
    button.on("pointerout", () => button.setScale(1));
    button.on("pointerdown", () => this.scene.start("level1"));

    panel.setInteractive();
  }

  private createPlace(x: number, y: number, icon: string, title: string, subtitle: string, body: number) {
    this.add.rectangle(x, y, 245, 160, body, 1)
      .setStrokeStyle(4, 0xffffff, 0.8);
    this.add.text(x, y - 38, icon, { fontSize: "40px" }).setOrigin(0.5);
    this.add.text(x, y + 7, title, {
      fontFamily: "Tahoma",
      fontSize: "25px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);
    this.add.text(x, y + 43, subtitle, {
      fontFamily: "Tahoma",
      fontSize: "16px",
      color: "#52697c"
    }).setOrigin(0.5);
  }

  private drawSepehr() {
    const c = this.add.container(640, 460);
    const shadow = this.add.ellipse(0, 68, 76, 22, 0x000000, 0.18);
    const body = this.add.rectangle(0, 18, 58, 88, 0xf4f7fa).setStrokeStyle(4, 0x315f89);
    const head = this.add.circle(0, -43, 32, 0xf1bf8c).setStrokeStyle(3, 0x8c5a3c);
    const hair = this.add.ellipse(-2, -60, 52, 22, 0x31231c);
    const bag = this.add.rectangle(-36, 20, 20, 56, 0x1f6fb2);
    c.add([shadow, bag, body, head, hair]);
  }
}
