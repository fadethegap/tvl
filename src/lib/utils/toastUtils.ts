// lib/toastUtils.ts

import { toast, ToastOptions, ToastPosition } from "react-toastify"

type ToastType = "success" | "error" | "info" | "warning" | "default"

const defaultToastOptions: ToastOptions = {
  position: "bottom-right" as ToastPosition, // Explicitly typing the position
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

export const showToast = (
  type: ToastType,
  message: string,
  options: ToastOptions = {}
) => {
  const toastOptions = { ...defaultToastOptions, ...options }

  switch (type) {
    case "success":
      toast.success(message, toastOptions)
      break
    case "error":
      toast.error(message, toastOptions)
      break
    case "info":
      toast.info(message, toastOptions)
      break
    case "warning":
      toast.warn(message, toastOptions)
      break
    default:
      toast(message, toastOptions)
      break
  }
}
