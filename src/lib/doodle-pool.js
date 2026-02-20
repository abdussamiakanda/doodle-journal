import { DOODLE_COUNT } from "./doodle-data.js";

export function getRandomUnusedDoodleId(usedIds) {
  const usedSet = new Set(usedIds);
  const available = [];
  for (let i = 1; i <= DOODLE_COUNT; i++) {
    if (!usedSet.has(i)) available.push(i);
  }
  if (available.length === 0) {
    return Math.floor(Math.random() * DOODLE_COUNT) + 1;
  }
  return available[Math.floor(Math.random() * available.length)];
}
