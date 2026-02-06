"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const base =
    "px-6 py-3 rounded-xl font-display text-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-garden-accent text-white hover:bg-garden-accent-light active:scale-95 shadow-md",
    secondary:
      "bg-garden-cream text-garden-ink hover:bg-garden-cream-dark active:scale-95 shadow-md",
    ghost:
      "bg-transparent text-garden-ink/60 hover:text-garden-ink hover:bg-garden-ink/5 active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
