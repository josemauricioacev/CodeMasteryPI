"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import {
  Home,
  LayoutDashboard,
  FileText,
  PenTool,
  Code,
  Terminal,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  LogIn,
  UserPlus,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(true)
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const sidebarClasses = cn("sidebar", collapsed && "sidebar-collapsed", !isOpen && isMobile && "hidden", className)

  return (
    <>
      {/* Overlay para móviles */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={closeSidebar} />}

      {/* Botón de menú para móviles */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      <div className={sidebarClasses}>
        <div className="sidebar-header">
          <Link href="/" className="flex items-center gap-2" onClick={closeSidebar}>
            <Code className="h-6 w-6 text-primary" />
            {!collapsed && <span className="font-bold">CodeMastery</span>}
          </Link>
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
              <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed ? "" : "rotate-180")} />
            </Button>
          )}
        </div>

        <div className="sidebar-content">
          <nav className="space-y-2">
            <Link
              href="/"
              className={cn("sidebar-link", pathname === "/" && "sidebar-link-active")}
              onClick={closeSidebar}
            >
              <Home className="h-5 w-5" />
              {!collapsed && <span>Inicio</span>}
            </Link>
            <Link
              href="/dashboard"
              className={cn("sidebar-link", pathname === "/dashboard" && "sidebar-link-active")}
              onClick={closeSidebar}
            >
              <LayoutDashboard className="h-5 w-5" />
              {!collapsed && <span>Dashboard</span>}
            </Link>

            {!collapsed && (
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cursos</p>
              </div>
            )}

            <Link
              href="/courses/html"
              className={cn(
                "sidebar-link",
                pathname?.startsWith("/courses/html") && "sidebar-link-active",
                pathname?.startsWith("/courses/html") ? "text-html" : "",
              )}
              onClick={closeSidebar}
            >
              <FileText className="h-5 w-5" />
              {!collapsed && <span>HTML</span>}
            </Link>
            <Link
              href="/courses/css"
              className={cn(
                "sidebar-link",
                pathname?.startsWith("/courses/css") && "sidebar-link-active",
                pathname?.startsWith("/courses/css") ? "text-css" : "",
              )}
              onClick={closeSidebar}
            >
              <PenTool className="h-5 w-5" />
              {!collapsed && <span>CSS</span>}
            </Link>
            <Link
              href="/courses/javascript"
              className={cn(
                "sidebar-link",
                pathname?.startsWith("/courses/javascript") && "sidebar-link-active",
                pathname?.startsWith("/courses/javascript") ? "text-javascript" : "",
              )}
              onClick={closeSidebar}
            >
              <Code className="h-5 w-5" />
              {!collapsed && <span>JavaScript</span>}
            </Link>
            <Link
              href="/courses/python"
              className={cn(
                "sidebar-link",
                pathname?.startsWith("/courses/python") && "sidebar-link-active",
                pathname?.startsWith("/courses/python") ? "text-python" : "",
              )}
              onClick={closeSidebar}
            >
              <Terminal className="h-5 w-5" />
              {!collapsed && <span>Python</span>}
            </Link>

            {!collapsed && (
              <div className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Información</p>
              </div>
            )}

            <Link
              href="/about"
              className={cn("sidebar-link", pathname === "/about" && "sidebar-link-active")}
              onClick={closeSidebar}
            >
              <BookOpen className="h-5 w-5" />
              {!collapsed && <span>Acerca de</span>}
            </Link>
          </nav>

          {/* Sección de autenticación */}
          <div className={cn("mt-auto pt-4", collapsed ? "mt-8" : "mt-8")}>
            {status === "authenticated" && session ? (
              <>
                {!collapsed && (
                  <div className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                        <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{session.user?.name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                          {session.user?.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex mt-3 gap-2">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/profile" onClick={closeSidebar}>
                          <User className="h-4 w-4 mr-1" />
                          Perfil
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          closeSidebar()
                          signOut({ callbackUrl: "/" })
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Salir
                      </Button>
                    </div>
                  </div>
                )}
                {collapsed && (
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
                      <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <Link href="/profile" className="sidebar-link p-2" onClick={closeSidebar}>
                      <User className="h-5 w-5" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        closeSidebar()
                        signOut({ callbackUrl: "/" })
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {!collapsed && (
                  <div className="px-3 py-2">
                    <div className="flex flex-col gap-2">
                      <Button variant="default" size="sm" className="w-full" asChild>
                        <Link href="/login" onClick={closeSidebar}>
                          <LogIn className="h-4 w-4 mr-1" />
                          Iniciar Sesión
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href="/register" onClick={closeSidebar}>
                          <UserPlus className="h-4 w-4 mr-1" />
                          Registrarse
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
                {collapsed && (
                  <div className="flex flex-col items-center gap-2">
                    <Link href="/login" className="sidebar-link p-2" onClick={closeSidebar}>
                      <LogIn className="h-5 w-5" />
                    </Link>
                    <Link href="/register" className="sidebar-link p-2" onClick={closeSidebar}>
                      <UserPlus className="h-5 w-5" />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

