"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export function useUserProgress() {
  const { data: session, status } = useSession()
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      setLoading(false)
      return
    }

    async function fetchProgress() {
      try {
        const response = await fetch("/api/progress")
        if (!response.ok) {
          throw new Error("Error al cargar el progreso")
        }
        const data = await response.json()
        setProgress(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [status])

  const updateProgress = async (moduleId, completed) => {
    if (status !== "authenticated") return false

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moduleId, completed }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el progreso")
      }

      // Actualizar el estado local
      setProgress((prev) => prev.map((item) => (item.module_id === moduleId ? { ...item, completed } : item)))

      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }

  return { progress, loading, error, updateProgress }
}

