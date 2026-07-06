interface GlassButtonProps {
  title: string;
  onClick?: () => void;
}

export default function GlassButton({
  title,
  onClick,
}: GlassButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
      glass
      w-full
      rounded-full
      py-4
      font-semibold
      text-gold
      hover:scale-[1.02]
      active:scale-95
      transition-all
      duration-300
      "
    >
      {title}
    </button>
  );
}