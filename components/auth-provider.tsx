"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { SessionProvider, useSession } from "next-auth/react"

// Componente para simular una sesión con el usuario de ejemplo
function ExampleUserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Verificar si hay una sesión de ejemplo en localStorage
    const exampleSession = localStorage.getItem("exampleSession")

    if (exampleSession && status === "unauthenticated") {
      // Aquí podríamos implementar lógica adicional para simular una sesión
      // pero por ahora dejamos que el componente de login maneje esto
    }
  }, [status])

  if (!mounted) {
    return null
  }

  return children
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ExampleUserProvider>{children}</ExampleUserProvider>
    </SessionProvider>
  )
}

