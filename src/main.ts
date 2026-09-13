import Phaser from "phaser";
import "./style.css";
import { HomeScene } from "./scenes/HomeScene";
import { ensureAnonymousSession } from "./lib/supabase";

const app = document.querySelector<HTMLDivElement>("#app");
if (app) app.innerHTML = '<div class="loading">در حال آماده‌سازی شهر سپهر…</div>';

ensureAnonymousSession().catch(() => {
  // The visual prototype can run even before Supabase environment variables are configured.
}).finally(() => {
  if (app) app.innerHTML = "";

  new Phaser.Game({
    type: Phaser.AUTO,
    parent: "app",
    width: 1280,
    height: 720,
    backgroundColor: "#8ed0f5",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [HomeScene]
  });
});
