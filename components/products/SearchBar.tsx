"use client";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search baby formula, diapers..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-full bg-white/70 px-5 py-4 outline-none placeholder:text-gray-400"
    />
  );
}