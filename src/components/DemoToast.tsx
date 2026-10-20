"use client";

import { useEffect, useState } from "react";

export function useDemoToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3200);
    return () => clearTimeout(t);
  }, [message]);

  return {
    message,
    show: (msg: string) => setMessage(msg),
    Toast: message ? (
      <div
        role="status"
        className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-emerald-200/90 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-900 shadow-elevated"
      >
        {message}
      </div>
    ) : null,
  };
}
