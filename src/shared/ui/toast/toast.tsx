import { useEffect, useState, useCallback } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastStyles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const Icon = toastIcons[toast.type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, 3000)

    return () => clearTimeout(timer)
  }, [toast.id, onRemove])

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg ${toastStyles[toast.type]} animate-in slide-in-from-right`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-sm">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 hover:bg-black/10 rounded-full transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

let toastListeners: ((toast: Toast) => void)[] = []

export const toast = {
  success: (message: string) => {
    const newToast: Toast = { id: crypto.randomUUID(), type: "success", message }
    toastListeners.forEach((listener) => listener(newToast))
  },
  error: (message: string) => {
    const newToast: Toast = { id: crypto.randomUUID(), type: "error", message }
    toastListeners.forEach((listener) => listener(newToast))
  },
  info: (message: string) => {
    const newToast: Toast = { id: crypto.randomUUID(), type: "info", message }
    toastListeners.forEach((listener) => listener(newToast))
  },
  warning: (message: string) => {
    const newToast: Toast = { id: crypto.randomUUID(), type: "warning", message }
    toastListeners.forEach((listener) => listener(newToast))
  },
}

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToast: Toast) => {
      setToasts((prev) => [...prev, newToast])
    }

    toastListeners.push(listener)

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  )
}
