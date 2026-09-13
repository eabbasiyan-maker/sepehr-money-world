export type LocalGameState = {
  level1Completed: boolean;
  xp: number;
  coins: number;
};

const KEY = "sepehr-money-world-state";

const defaults: LocalGameState = {
  level1Completed: false,
  xp: 0,
  coins: 0
};

export function loadLocalState(): LocalGameState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

export function saveLocalState(next: Partial<LocalGameState>) {
  const current = loadLocalState();
  localStorage.setItem(KEY, JSON.stringify({ ...current, ...next }));
}
