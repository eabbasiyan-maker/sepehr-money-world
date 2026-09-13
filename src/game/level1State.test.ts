import { describe, expect, it } from "vitest";
import {
  initialLevel1State,
  trade,
  adjustTrust,
  advanceTime
} from "./level1State";

describe("Level 1 world state", () => {
  it("fast route spends bread and reaches the ball", () => {
    const state = initialLevel1State();
    state.inventory.bread = 1;

    expect(trade(state, { bread: 1 }, { repaired_bike: 1 })).toBe(true);
    expect(trade(state, { repaired_bike: 1 }, { ball: 1 })).toBe(true);

    expect(state.inventory.bread).toBe(0);
    expect(state.inventory.ball).toBe(1);
  });

  it("trust route preserves bread and can still reach the ball", () => {
    const state = initialLevel1State();

    state.inventory.carrot += 2;
    adjustTrust(state, "farmer", 2);
    state.inventory.old_bike += 1;
    adjustTrust(state, "mechanic", 2);

    expect(trade(state, { old_bike: 1 }, { repaired_bike: 1 })).toBe(true);
    expect(trade(state, { repaired_bike: 1 }, { ball: 1 })).toBe(true);

    expect(state.inventory.bread).toBe(0);
    expect(state.inventory.ball).toBe(1);
    expect(state.trust.farmer).toBe(2);
    expect(state.trust.mechanic).toBe(2);
  });

  it("service route can reward a ball without a goods chain", () => {
    const state = initialLevel1State();
    state.flags.ball1Found = true;
    state.flags.ball2Found = true;
    state.flags.ball3Found = true;
    state.flags.ballSellerHelped = true;
    state.inventory.ball += 1;
    adjustTrust(state, "ballSeller", 2);

    expect(state.inventory.ball).toBe(1);
    expect(state.trust.ballSeller).toBe(2);
    expect(state.inventory.repaired_bike).toBe(0);
  });

  it("trade refuses to create negative inventory", () => {
    const state = initialLevel1State();

    expect(trade(state, { bread: 1 }, { old_bike: 1 })).toBe(false);
    expect(state.inventory.bread).toBe(0);
    expect(state.inventory.old_bike).toBe(0);
  });

  it("trust stays inside the 0..3 range", () => {
    const state = initialLevel1State();

    adjustTrust(state, "baker", 10);
    expect(state.trust.baker).toBe(3);

    adjustTrust(state, "baker", -10);
    expect(state.trust.baker).toBe(0);
  });

  it("meaningful actions advance the day gradually", () => {
    const state = initialLevel1State();

    advanceTime(state, 1);
    expect(state.time).toBe("morning");

    advanceTime(state, 1);
    expect(state.time).toBe("noon");

    advanceTime(state, 4);
    expect(["afternoon", "sunset", "next_day"]).toContain(state.time);
  });
});
