"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaGoogle } from "react-icons/fa"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }

    // Verificar si viene de registro exitoso
    const registered = searchParams.get("registered")
    if (registered === "true") {
      setSuccess("Registro exitoso. Por favor, inicia sesión con tus credenciales.")
    }
  }, [status, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Verificar si es el usuario de ejemplo
    if (email.toLowerCase() === "ejemplo" || email.toLowerCase() === "ejemplo@ejemplo.com") {
      // Simular inicio de sesión exitoso
      try {
        // Crear una sesión simulada
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password: "cualquier-contraseña", // La contraseña no importa para el usuario ejemplo
        })

        if (result?.error) {
          // Si hay un error con el proveedor de credenciales, usamos una simulación manual
          setSuccess("Iniciando sesión como usuario de ejemplo...")

          // Simular un retraso antes de redirigir
          setTimeout(() => {
            // Aquí normalmente usaríamos signIn, pero como es una simulación, redirigimos directamente
            router.push("/dashboard")
            router.refresh()
          }, 1500)
        } else {
          router.push("/dashboard")
          router.refresh()
        }
      } catch (error) {
        setError("Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.")
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Proceso normal de inicio de sesión
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Credenciales inválidas. Por favor, intenta de nuevo.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      setError("Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  if (status === "loading") {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded mx-auto"></div>
          <div className="h-4 w-96 bg-muted rounded mx-auto"></div>
          <div className="h-64 w-96 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta o usa "ejemplo" como usuario para probar la plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="mb-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-300">{success}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico o Usuario</Label>
              <Input
                id="email"
                type="text"
                placeholder="tu@email.com o 'ejemplo'"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Para el usuario "ejemplo", cualquier contraseña funcionará.
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
            </div>
          </div>
          <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn}>
            <FaGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

