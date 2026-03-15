"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "error" | "info";
  title?: string;
  description?: string;
  duration?: number;
  onDismiss?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "info", title, description, duration = 3000, onDismiss, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            onDismiss?.();
          }, 300);
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onDismiss]);

    const getToastClasses = () => {
      const baseClasses = "fixed top-4 right-4 z-50 transform transition-all duration-300 backdrop-blur-md border border-white/10 shadow-lg";
      const variantClasses = {
        success: "bg-green-500/95 text-white border-green-400/50",
        error: "bg-red-500/95 text-white border-red-400/50",
        info: "bg-[#c8a34d]/95 text-white border-[#c8a34d]/50",
      };

      return cn(
        baseClasses,
        variantClasses[variant],
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
        className
      );
    };

    return (
      <div
        ref={ref}
        className={getToastClasses()}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        {...props}
      >
        <div className="p-4">
          {title && (
            <div className="font-bold text-sm mb-1 uppercase tracking-wider">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm opacity-90">
              {description}
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              onDismiss?.();
            }, 300);
          }}
          className="absolute top-2 right-2 p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <span className="h-4 w-4 text-white/80">✕</span>
        </button>
      </div>
    );
  }
);

Toast.displayName = "Toast";

interface ToastProviderProps {
  children: React.ReactNode;
}

interface ToastState {
  id: string;
  variant: "success" | "error" | "info";
  title?: string;
  description?: string;
  duration?: number;
}

const ToastContext = React.createContext<{
  toasts: ToastState[];
  addToast: (toast: Omit<ToastState, "id">) => void;
  removeToast: (id: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastState, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed inset-0 pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            duration={toast.duration}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// Convenience functions for common toast types
export const toast = {
  success: (message: string, title?: string) => {
    const context = React.useContext(ToastContext);
    if (context) {
      context.addToast({
        variant: "success",
        title: title || "Success",
        description: message,
        duration: 3000,
      });
    }
  },
  error: (message: string, title?: string) => {
    const context = React.useContext(ToastContext);
    if (context) {
      context.addToast({
        variant: "error",
        title: title || "Error",
        description: message,
        duration: 5000,
      });
    }
  },
  info: (message: string, title?: string) => {
    const context = React.useContext(ToastContext);
    if (context) {
      context.addToast({
        variant: "info",
        title: title || "Info",
        description: message,
        duration: 3000,
      });
    }
  },
};