import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="glass mt-6 flex items-center gap-3 rounded-full px-5 py-4">
      <Search className="h-5 w-5 text-yellow-600" />

      <input
        type="text"
        placeholder="Search baby products..."
        className="w-full bg-transparent outline-none placeholder:text-gray-500"
      />
    </div>
  );
}