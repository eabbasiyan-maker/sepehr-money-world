import Phaser from "phaser";
import { loadLevel1State } from "../game/level1State";

export class HomeScene extends Phaser.Scene {
  constructor() {
    super("home");
  }

  preload() {
    this.load.svg("town-bg", "assets/level1/town.svg");
    this.load.svg("sepehr-art", "assets/level1/sepehr.svg");
  }

  create() {
    const { width, height } = this.scale;
    const state = loadLevel1State();

    this.add.image(width / 2, height / 2, "town-bg")
      .setDisplaySize(width, height);

    this.add.rectangle(width / 2, 55, width, 110, 0x102f47, 0.74);
    this.add.text(width / 2, 38, "دنیای پول سپهر", {
      fontFamily: "Tahoma",
      fontSize: "38px",
      color: "#ffffff",
      fontStyle: "bold",
      stroke: "#17324a",
      strokeThickness: 3
    }).setOrigin(0.5);

    this.add.text(width / 2, 78, "یک شهر، چند راه، تصمیم‌های واقعی", {
      fontFamily: "Tahoma",
      fontSize: "17px",
      color: "#dff5ff"
    }).setOrigin(0.5);

    const hero = this.add.image(160, 500, "sepehr-art")
      .setDisplaySize(150, 205)
      .setDepth(5);

    this.tweens.add({
      targets: hero,
      y: 494,
      yoyo: true,
      repeat: -1,
      duration: 1300,
      ease: "Sine.easeInOut"
    });

    this.add.rectangle(1110, 54, 230, 56, 0xfffbef, 0.94)
      .setStrokeStyle(2, 0xffffff, 0.8);
    this.add.text(1110, 54, `تجربه  ${state.xp}`, {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const mission = this.add.container(700, 545).setDepth(6);
    const shadow = this.add.rectangle(8, 10, 700, 190, 0x17324a, 0.2);
    const card = this.add.rectangle(0, 0, 700, 190, 0xfffbef, 0.97)
      .setStrokeStyle(4, state.completed ? 0x45a85b : 0x2f87c7);
    const ribbon = this.add.rectangle(0, -77, 370, 46, state.completed ? 0x45a85b : 0x2f87c7);
    const ribbonText = this.add.text(0, -77, state.completed ? "مرحله ۱ انجام شد" : "ماموریت فعال", {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const title = this.add.text(0, -25, "بازار بدون پول", {
      fontFamily: "Tahoma",
      fontSize: "31px",
      color: "#17324a",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const body = this.add.text(
      0,
      20,
      state.completed
        ? "این بار می‌توانی مسیر دیگری را امتحان کنی."
        : "نانوا به یک توپ نیاز دارد. شهر را بگرد و راه خودت را پیدا کن.",
      {
        fontFamily: "Tahoma",
        fontSize: "19px",
        color: "#425e72",
        align: "center",
        wordWrap: { width: 610 }
      }
    ).setOrigin(0.5);

    const buttonBg = this.add.rectangle(0, 68, 265, 52, 0x2f87c7)
      .setStrokeStyle(2, 0xffffff, 0.8)
      .setInteractive({ useHandCursor: true });
    const buttonText = this.add.text(0, 68, state.completed ? "دوباره بازی کن" : "ورود به بازار", {
      fontFamily: "Tahoma",
      fontSize: "19px",
      color: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    mission.add([shadow, card, ribbon, ribbonText, title, body, buttonBg, buttonText]);

    buttonBg.on("pointerover", () => mission.setScale(1.015));
    buttonBg.on("pointerout", () => mission.setScale(1));
    buttonBg.on("pointerdown", () => this.scene.start("level1"));

    this.add.text(1105, 660, "بانک", {
      fontFamily: "Tahoma",
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
      backgroundColor: "#17324acc",
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5);

    this.add.text(640, 150, "بازار", {
      fontFamily: "Tahoma",
      fontSize: "18px",
      color: "#ffffff",
      fontStyle: "bold",
      backgroundColor: "#17324acc",
      padding: { x: 16, y: 8 }
    }).setOrigin(0.5);
  }
}
