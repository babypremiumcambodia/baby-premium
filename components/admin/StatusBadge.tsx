const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  packing: "bg-purple-100 text-purple-800",
  shipping: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
        statusStyles[status] ?? "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}