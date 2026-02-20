// Map each doodle id (1–50) to a Lucide icon name. Uses actual icons instead of custom paths.
const NATURE_ICONS = [
  "Flower2", "Flower", "Leaf", "Sun", "Sprout", "TreePine", "Trees", "Clover", "Bug", "Cherry",
];
export const DOODLE_ICON_NAMES = Array.from(
  { length: 50 },
  (_, i) => NATURE_ICONS[i % NATURE_ICONS.length]
);
