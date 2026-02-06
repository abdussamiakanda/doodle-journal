"use client";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`card p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}
