"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type ToastType = "success" | "error";
type ToastItem = { id: string; message: string; type: ToastType; leaving: boolean };

type ToastFn = (message: string, type?: ToastType) => void;
const ToastCtx = createContext<ToastFn>(() => {});
export const useToast = () => useContext(ToastCtx);

const DURATION = 4000;
const LEAVE_MS = 240;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t))
    );
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      LEAVE_MS
    );
  }, []);

  const toast = useCallback<ToastFn>(
    (message, type = "success") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type, leaving: false }]);
      const t = setTimeout(() => dismiss(id), DURATION);
      timers.current.set(id, t);
    },
    [dismiss]
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

const KEYFRAMES = `
  @keyframes toast-in {
    from { opacity: 0; transform: translateX(calc(100% + 2rem)); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes toast-out {
    from { opacity: 1; transform: translateX(0); }
    to   { opacity: 0; transform: translateX(calc(100% + 2rem)); }
  }
`;

function Toaster({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  if (typeof window === "undefined" || toasts.length === 0) return null;

  return createPortal(
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed right-6 top-6 z-9999 flex flex-col gap-2.5"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={onDismiss} />
        ))}
      </div>
    </>,
    document.body
  );
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const isSuccess = item.type === "success";

  return (
    <div
      role="alert"
      className={`flex w-[320px] items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-lg ${
        isSuccess ? "border-green-100" : "border-red-100"
      }`}
      style={{
        animation: item.leaving
          ? "toast-out 0.22s cubic-bezier(0.4,0,1,1) both"
          : "toast-in 0.3s cubic-bezier(0.34,1.2,0.64,1) both",
      }}
    >
      {/* Icon */}
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          isSuccess ? "bg-green-100" : "bg-red-100"
        }`}
      >
        {isSuccess ? (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>

      {/* Message */}
      <p className="flex-1 text-[13px] leading-5 text-gray-800">{item.message}</p>

      {/* Dismiss */}
      <button
        onClick={() => onDismiss(item.id)}
        className="mt-0.5 shrink-0 text-gray-400 transition hover:text-gray-600"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
