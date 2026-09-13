export type TimePhase = "morning" | "noon" | "afternoon" | "sunset" | "next_day";
export type ItemKey = "bread" | "carrot" | "wood" | "old_bike" | "repaired_bike" | "ball";
export type NpcKey = "baker" | "farmer" | "carpenter" | "mechanic" | "ballSeller";

export type Level1State = {
  version: 2;
  time: TimePhase;
  actionCount: number;
  inventory: Record<ItemKey, number>;
  trust: Record<NpcKey, number>;
  knowledge: string[];
  flags: Record<string, boolean>;
  xp: number;
  completed: boolean;
  route?: "trade" | "trust" | "service" | "mixed";
  log: string[];
};

const KEY = "sepehr-money-world-level1-v2";

export const initialLevel1State = (): Level1State => ({
  version: 2,
  time: "morning",
  actionCount: 0,
  inventory: {
    bread: 0,
    carrot: 0,
    wood: 0,
    old_bike: 0,
    repaired_bike: 0,
    ball: 0
  },
  trust: {
    baker: 0,
    farmer: 0,
    carpenter: 0,
    mechanic: 0,
    ballSeller: 0
  },
  knowledge: [],
  flags: {
    bakeryBreadTaken: false,
    farmerBoxesHelped: false,
    farmerBikeTraded: false,
    bikeRepaired: false,
    ballSellerHelped: false,
    ballsTaskActive: false,
    ball1Found: false,
    ball2Found: false,
    ball3Found: false,
    optionalStorageFound: false,
    marketClosed: false,
    levelSolved: false
  },
  xp: 0,
  completed: false,
  log: []
});

export function loadLevel1State(): Level1State {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialLevel1State();
    const parsed = JSON.parse(raw) as Level1State;
    if (parsed.version !== 2) return initialLevel1State();
    return parsed;
  } catch {
    return initialLevel1State();
  }
}

export function saveLevel1State(state: Level1State) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetLevel1State() {
  const next = initialLevel1State();
  saveLevel1State(next);
  return next;
}

export function hasItem(state: Level1State, item: ItemKey, count = 1) {
  return state.inventory[item] >= count;
}

export function addKnowledge(state: Level1State, clue: string) {
  if (!state.knowledge.includes(clue)) state.knowledge.push(clue);
}

export function addLog(state: Level1State, entry: string) {
  state.log.push(entry);
  if (state.log.length > 30) state.log.shift();
}

export function advanceTime(state: Level1State, steps = 1) {
  const phases: TimePhase[] = ["morning", "noon", "afternoon", "sunset", "next_day"];
  for (let i = 0; i < steps; i += 1) {
    state.actionCount += 1;
    if (state.actionCount % 2 !== 0) continue;
    const current = phases.indexOf(state.time);
    state.time = phases[Math.min(current + 1, phases.length - 1)];
  }
  state.flags.marketClosed = state.time === "sunset" || state.time === "next_day";
}

export function adjustTrust(state: Level1State, npc: NpcKey, delta: number) {
  state.trust[npc] = Math.max(0, Math.min(3, state.trust[npc] + delta));
}

export function trade(
  state: Level1State,
  give: Partial<Record<ItemKey, number>>,
  receive: Partial<Record<ItemKey, number>>
) {
  for (const [key, amount] of Object.entries(give) as [ItemKey, number][]) {
    if (state.inventory[key] < amount) return false;
  }
  for (const [key, amount] of Object.entries(give) as [ItemKey, number][]) {
    state.inventory[key] -= amount;
  }
  for (const [key, amount] of Object.entries(receive) as [ItemKey, number][]) {
    state.inventory[key] += amount;
  }
  return true;
}
