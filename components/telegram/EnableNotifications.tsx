"use client";

export default function EnableNotifications() {
  return (
    <div className="mt-4 rounded-3xl bg-white/80 p-4 shadow">
      <h3 className="font-bold">🔔 Enable Order Notifications</h3>

      <p className="mt-2 text-sm text-gray-500">
        Get updates when your order is confirmed, prepared, shipped, or delivered.
      </p>

      <a
        href="https://t.me/babypremiumbabybot"
        target="_blank"
        className="mt-4 block rounded-full bg-gold py-3 text-center font-semibold text-white"
      >
        Enable Notifications
      </a>
    </div>
  );
}