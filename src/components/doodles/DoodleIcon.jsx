import {
  Flower2,
  Flower,
  Leaf,
  Sun,
  Sprout,
  TreePine,
  Trees,
  Clover,
  Bug,
  Cherry,
} from "lucide-react";
import { DOODLE_ICON_NAMES } from "@/lib/doodle-icons.js";

const ICON_MAP = {
  Flower2,
  Flower,
  Leaf,
  Sun,
  Sprout,
  TreePine,
  Trees,
  Clover,
  Bug,
  Cherry,
};

export default function DoodleIcon({
  doodleId,
  size = 24,
  className = "",
  color,
  animate = false,
}) {
  const iconName = DOODLE_ICON_NAMES[doodleId - 1];
  const Icon = iconName ? ICON_MAP[iconName] : null;
  if (!Icon) return null;
  const iconColor = color ?? "var(--login-accent)";
  return (
    <span
      className={`doodle-icon ${animate ? "doodle-new" : ""} ${className}`.trim()}
      style={{ display: "inline-flex", color: iconColor }}
    >
      <Icon size={size} color={iconColor} strokeWidth={2} />
    </span>
  );
}
