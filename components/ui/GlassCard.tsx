import type {
  HTMLAttributes,
  ReactNode,
} from "react";

interface GlassCardProps
  extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      {...props}
      className={`glass relative rounded-[32px] p-6 shadow-xl touch-manipulation ${className}`}
    >
      {children}
    </div>
  );
}