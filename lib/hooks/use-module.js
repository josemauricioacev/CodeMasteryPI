"use client"

import { useState, useEffect } from "react"

export function useModule(moduleId) {
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!moduleId) {
      setLoading(false)
      return
    }

    async function fetchModule() {
      try {
        const response = await fetch(`/api/modules/${moduleId}`)
        if (!response.ok) {
          throw new Error("Error al cargar el módulo")
        }
        const data = await response.json()
        setModule(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchModule()
  }, [moduleId])

  return { module, loading, error }
}

