"use client"

import { useEffect } from "react"
import { useNotifications } from "@/hooks/useNotifications"
import { Activity } from "lucide-react"
import { useSound } from "@/hooks/useSound"

interface GlucoseAlertProps {
  value: number
  timestamp: string
  trend?: "rising" | "falling" | "stable"
}

export function GlucoseAlert({ value, timestamp, trend }: GlucoseAlertProps) {
  const { showWarning, showError, showInfo } = useNotifications()
  const { playAlert } = useSound()

  useEffect(() => {
    const checkGlucose = () => {
      if (value > 13.9) {
        showError(
          `Vysoká glykémie: ${value} mmol/L`,
          "Upozornění na glykémii"
        )
        playAlert("high")
      } else if (value < 3.9) {
        showError(
          `Nízká glykémie: ${value} mmol/L`,
          "Upozornění na glykémii"
        )
        playAlert("low")
      } else if (value > 10) {
        showWarning(
          `Zvýšená glykémie: ${value} mmol/L`,
          "Upozornění na glykémii"
        )
        playAlert("warning")
      } else if (value < 4.5) {
        showWarning(
          `Snížená glykémie: ${value} mmol/L`,
          "Upozornění na glykémii"
        )
        playAlert("warning")
      }

      if (trend === "rising" && value > 8) {
        showInfo(
          "Glykémie rychle stoupá",
          "Trend glykémie"
        )
      } else if (trend === "falling" && value < 6) {
        showInfo(
          "Glykémie rychle klesá",
          "Trend glykémie"
        )
      }
    }

    checkGlucose()
  }, [value, trend, showWarning, showError, showInfo, playAlert])

  return null
} 