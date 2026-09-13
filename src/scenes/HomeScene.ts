import Phaser from "phaser";
import { loadLevel1State } from "../game/level1State";

export class HomeScene extends Phaser.Scene {
  constructor() {
    super("home");
  }

  create() {
    const { width, height } = this.scale;
    const state = loadLevel1State();

    this.cameras.main.setBackgroundColor("#87ceeb");
    this.add.rectangle(width / 2, height / 2, width, height, 0x8ed0f5);

    const g = this.add.graphics();
    g.fillStyle(0x73b56a, 1);
    g.fillRect(0, 255, width, height - 255);
    g.fillStyle(0xe8d6ae, 1);
    g.fillRoundedRect(70, 290, 1140, 345, 42);

    this.add.text(width / 2, 44, "دنیای پول سپهر", {
      fontFamily: "Tahoma",
      fontSize: "34px",
      color: "#12395d",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(56, 42, `تجربه: ${state.xp}`, {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#17324a",
      fontStyle: "bold"
    });

    this.createPlace(230, 355, "بانک", "قفل", 0xe5e7eb);
    this.createPlace(640, 335, "بازار", state.completed ? "مرحله ۱ انجام شد" : "مرحله ۱ فعال", 0xffdfad);
    this.createPlace(1040, 385, "فروشگاه", "به‌زودی", 0xd8ecff);

    this.add.rectangle(640, 596, 820, 158, 0xfffbef, 0.98)
      .setStrokeStyle(4, state.completed ? 0x2f9d55 : 0x287fb8);

    this.add.text(640, 555, state.completed ? "مرحله ۱: بازار بدون پول — انجام شد" : "مرحله ۱: بازار بدون پول", {
      fontFamily: "Tahoma",
      fontSize: "25px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(
      640,
      600,
      state.completed
        ? "می‌توانی دوباره با مسیر دیگری بازی کنی."
        : "نانوا به یک توپ نیاز دارد. در شهر بگرد و راه خودت را پیدا کن.",
      {
        fontFamily: "Tahoma",
        fontSize: "19px",
        color: "#2a475b",
        align: "center",
        wordWrap: { width: 680 }
      }
    ).setOrigin(0.5);

    const button = this.add.rectangle(640, 654, 280, 52, 0x2b8dd8)
      .setStrokeStyle(3, 0xffffff, 0.7)
      .setInteractive({ useHandCursor: true });

    this.add.text(640, 654, state.completed ? "با همین وضعیت وارد شو" : "ورود به شهر", {
      fontFamily: "Tahoma",
      fontSize: "19px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    button.on("pointerdown", () => this.scene.start("level1"));
  }

  private createPlace(x: number, y: number, title: string, subtitle: string, color: number) {
    this.add.rectangle(x, y, 250, 150, color, 1)
      .setStrokeStyle(4, 0xffffff, 0.8);
    this.add.text(x, y - 18, title, {
      fontFamily: "Tahoma",
      fontSize: "26px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);
    this.add.text(x, y + 24, subtitle, {
      fontFamily: "Tahoma",
      fontSize: "16px",
      color: "#52697c"
    }).setOrigin(0.5);
  }
}
