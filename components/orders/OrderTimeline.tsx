import { CheckCircle, Circle } from "lucide-react";

const steps = [
  { key: "pending", label: "Order Received" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packing", label: "Preparing" },
  { key: "shipping", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];

export default function OrderTimeline({ status }: { status: string }) {
  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="mt-5 space-y-3">
      {steps.map((step, index) => {
        const completed = index <= currentIndex;

        return (
          <div key={step.key} className="flex items-center gap-3">
            {completed ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 text-gray-300" />
            )}

            <span
              className={
                completed ? "font-semibold text-gray-900" : "text-gray-400"
              }
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}