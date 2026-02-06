import { DoodleId } from "@/types";
import { DOODLE_COUNT } from "@/components/doodles/doodle-data";

export function getRandomUnusedDoodleId(usedIds: DoodleId[]): DoodleId {
  const usedSet = new Set(usedIds);
  const available: DoodleId[] = [];

  for (let i = 1; i <= DOODLE_COUNT; i++) {
    if (!usedSet.has(i)) {
      available.push(i);
    }
  }

  // If all doodles are used, allow repeats (wrap around)
  if (available.length === 0) {
    return Math.floor(Math.random() * DOODLE_COUNT) + 1;
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}
