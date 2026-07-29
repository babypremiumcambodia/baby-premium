"use client";

import {
  CheckCircle,
  Circle,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

const steps = [
  {
    key: "pending",
    label: {
      en: "Order Received",
      km: "បានទទួលការបញ្ជាទិញ",
    },
  },
  {
    key: "confirmed",
    label: {
      en: "Confirmed",
      km: "បានបញ្ជាក់",
    },
  },
  {
    key: "packing",
    label: {
      en: "Preparing",
      km: "កំពុងរៀបចំ",
    },
  },
  {
    key: "shipping",
    label: {
      en: "Out for Delivery",
      km: "កំពុងដឹកជញ្ជូន",
    },
  },
  {
    key: "delivered",
    label: {
      en: "Delivered",
      km: "បានដឹកជញ្ជូនរួច",
    },
  },
];

export default function OrderTimeline({
  status,
}: {
  status: string;
}) {
  const { language } = useLanguage();

  const currentIndex = steps.findIndex(
    (step) => step.key === status
  );

  if (status === "cancelled") {
    return (
      <div className="mt-5 flex items-center gap-3">
        <XCircle className="h-5 w-5 shrink-0 text-red-500" />

        <span
          className={`font-semibold text-red-500 ${
            language === "km"
              ? "font-khmer leading-7"
              : ""
          }`}
        >
          {language === "km"
            ? "ការបញ្ជាទិញត្រូវបានបោះបង់"
            : "Order Cancelled"}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-3">
      {steps.map((step, index) => {
        const completed =
          currentIndex >= 0 && index <= currentIndex;

        return (
          <div
            key={step.key}
            className="flex items-center gap-3"
          >
            {completed ? (
              <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-gray-300" />
            )}

            <span
              className={`${
                completed
                  ? "font-semibold text-gray-900"
                  : "text-gray-400"
              } ${
                language === "km"
                  ? "font-khmer leading-7"
                  : ""
              }`}
            >
              {step.label[language]}
            </span>
          </div>
        );
      })}
    </div>
  );
}