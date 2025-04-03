"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Code, Home, Info, LayoutDashboard } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Code className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">CodeMastery</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/" ? "text-foreground" : "text-foreground/60",
          )}
        >
          <div className="flex items-center gap-1">
            <Home className="h-4 w-4" />
            <span>Inicio</span>
          </div>
        </Link>
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/dashboard") ? "text-foreground" : "text-foreground/60",
          )}
        >
          <div className="flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link
          href="/about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname?.startsWith("/about") ? "text-foreground" : "text-foreground/60",
          )}
        >
          <div className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>Acerca de</span>
          </div>
        </Link>
      </nav>
    </div>
  )
}

