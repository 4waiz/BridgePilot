"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ToastItem {
  id: string;
  message: string;
  variant?: "default" | "alert";
}

export function ToastStack({
  toasts,
  onDismiss
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-72 flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "flex items-center justify-between rounded-2xl border border-white/20 bg-pilot-deep px-4 py-3 text-sm shadow-xl",
              toast.variant === "alert" && "border-pilot-coral/70"
            )}
          >
            <span>{toast.message}</span>
            <button
              className="rounded-full p-1 text-white/70 hover:bg-white/10"
              onClick={() => onDismiss(toast.id)}
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
