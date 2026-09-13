import Phaser from "phaser";

export class HomeScene extends Phaser.Scene {
  constructor() {
    super("home");
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor("#87ceeb");

    this.add.rectangle(width / 2, height / 2, width, height, 0x8ed0f5);
    this.add.circle(width * 0.18, height * 0.18, 90, 0xffdf6c);

    this.add.text(width / 2, 52, "دنیای پول سپهر", {
      fontFamily: "Tahoma",
      fontSize: "34px",
      color: "#12395d",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(width - 40, 40, "🪙 ۱۲۵   ⭐ ۳۴۰", {
      fontFamily: "Tahoma",
      fontSize: "24px",
      color: "#17334f"
    }).setOrigin(1, 0);

    const cards = [
      { x: 0.22, y: 0.42, title: "🏦 بانک", subtitle: "پس‌انداز • برنامه‌ریزی" },
      { x: 0.50, y: 0.38, title: "🏪 فروشگاه", subtitle: "خرید • مقایسه • انتخاب" },
      { x: 0.78, y: 0.48, title: "🛒 بازار", subtitle: "کشف فرصت‌ها" }
    ];

    for (const card of cards) {
      const cx = width * card.x;
      const cy = height * card.y;
      this.add.rectangle(cx, cy, 240, 110, 0xffffff, 0.92).setStrokeStyle(3, 0x2c78b8);
      this.add.text(cx, cy - 18, card.title, {
        fontFamily: "Tahoma",
        fontSize: "28px",
        color: "#163c66",
        fontStyle: "bold"
      }).setOrigin(0.5);
      this.add.text(cx, cy + 22, card.subtitle, {
        fontFamily: "Tahoma",
        fontSize: "17px",
        color: "#425d72"
      }).setOrigin(0.5);
    }

    const quest = this.add.rectangle(width / 2, height * 0.76, Math.min(720, width * 0.82), 150, 0xfffbef, 0.97)
      .setStrokeStyle(4, 0x38a34a);
    quest.setInteractive({ useHandCursor: true });

    this.add.text(width / 2, height * 0.72, "ماموریت جدید!", {
      fontFamily: "Tahoma",
      fontSize: "26px",
      color: "#1d4f2d",
      fontStyle: "bold"
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.77, "به روباه کمک کن یک انتخاب هوشمندانه داشته باشد.", {
      fontFamily: "Tahoma",
      fontSize: "20px",
      color: "#294456"
    }).setOrigin(0.5);

    const status = this.add.text(width / 2, height * 0.83, "برای شروع لمس کن", {
      fontFamily: "Tahoma",
      fontSize: "18px",
      color: "#15732d"
    }).setOrigin(0.5);

    quest.on("pointerdown", () => {
      status.setText("ماموریت ۱ در Vertical Slice بعدی فعال می‌شود");
      this.tweens.add({ targets: quest, scaleX: 1.03, scaleY: 1.03, yoyo: true, duration: 120 });
    });
  }
}
