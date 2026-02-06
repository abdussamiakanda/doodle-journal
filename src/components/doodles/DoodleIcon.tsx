"use client";

import { getDoodleById } from "./doodle-data";

interface DoodleIconProps {
  doodleId: number;
  size?: number;
  className?: string;
  color?: string;
  animate?: boolean;
}

export default function DoodleIcon({
  doodleId,
  size = 24,
  className = "",
  color = "currentColor",
  animate = false,
}: DoodleIconProps) {
  const doodle = getDoodleById(doodleId);
  if (!doodle) return null;

  return (
    <svg
      viewBox={doodle.viewBox}
      width={size}
      height={size}
      className={`${animate ? "doodle-new" : ""} ${className}`}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {doodle.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
