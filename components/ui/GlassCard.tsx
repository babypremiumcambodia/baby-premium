import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        glass
        rounded-[32px]
        p-6
        shadow-xl
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}