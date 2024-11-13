import { useToast } from "@/hooks/use-toast"

export function useNotifications() {
  const { toast } = useToast()

  const showSuccess = (message: string, title = "Úspěch") => {
    toast({
      title,
      description: message,
      className: "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800",
    })
  }

  const showError = (message: string, title = "Chyba") => {
    toast({
      title,
      description: message,
      variant: "destructive",
    })
  }

  const showWarning = (message: string, title = "Upozornění") => {
    toast({
      title,
      description: message,
      className: "bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800",
    })
  }

  const showInfo = (message: string, title = "Informace") => {
    toast({
      title,
      description: message,
      className: "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800",
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
} 