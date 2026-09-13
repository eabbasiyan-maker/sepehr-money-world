import Phaser from "phaser";
import "./style.css";
import { HomeScene } from "./scenes/HomeScene";
import { Level1Scene } from "./scenes/Level1Scene";
import { ensureAnonymousSession } from "./lib/supabase";

const app = document.querySelector<HTMLDivElement>("#app");

const rotateGate = document.createElement("div");
rotateGate.id = "rotate-gate";
rotateGate.innerHTML = `
  <div class="rotate-card" dir="rtl">
    <div class="phone-icon">↻</div>
    <div class="rotate-title">گوشی را افقی کن</div>
    <div class="rotate-subtitle">بازی برای حالت افقی طراحی شده تا شهر را کامل ببینی.</div>
  </div>
`;
document.body.appendChild(rotateGate);

if (app) app.innerHTML = '<div class="loading">در حال آماده‌سازی شهر سپهر…</div>';

ensureAnonymousSession().catch(() => {
  // MVP gameplay remains fully playable without AI or a live backend session.
}).finally(() => {
  if (app) app.innerHTML = "";

  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "app",
    width: 1280,
    height: 720,
    transparent: false,
    backgroundColor: "#7cc8ef",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720
    },
    render: {
      antialias: true,
      roundPixels: false
    },
    scene: [HomeScene, Level1Scene]
  });
});
