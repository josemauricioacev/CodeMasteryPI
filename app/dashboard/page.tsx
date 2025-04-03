"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Code, FileText, PenTool, Terminal, ChevronRight, BookOpen } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useCourses } from "@/lib/hooks/use-courses"
import { useUserProgress } from "@/lib/hooks/use-progress"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)
  const { courses, loading: coursesLoading } = useCourses()
  const { progress, loading: progressLoading } = useUserProgress()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Función para calcular el progreso por curso
  const calculateCourseProgress = (courseId) => {
    if (!progress || progress.length === 0) return 0

    const courseModules = progress.filter((item) => item.course_id === courseId)
    if (courseModules.length === 0) return 0

    const completedModules = courseModules.filter((item) => item.completed).length
    return Math.round((completedModules / courseModules.length) * 100)
  }

  // Función para obtener los módulos de un curso
  const getCourseModules = (courseId) => {
    if (!progress) return []
    return progress.filter((item) => item.course_id === courseId)
  }

  if (!mounted) {
    return null
  }

  if (status === "loading" || coursesLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-muted rounded"></div>
          <div className="h-4 w-96 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-bold mb-2">Bienvenido a tu Dashboard</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Inicia sesión para ver tu progreso y continuar con tus cursos. Puedes usar el usuario "ejemplo" para probar la
          plataforma.
        </p>
        <div className="flex flex-col gap-4 max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle>Explora nuestros cursos</CardTitle>
              <CardDescription>
                Mientras tanto, puedes explorar los cursos disponibles en nuestra plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/courses/html" className="w-full">
                <Button variant="outline" className="w-full flex items-center justify-between">
                  <span>HTML</span>
                  <FileText className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses/css" className="w-full">
                <Button variant="outline" className="w-full flex items-center justify-between">
                  <span>CSS</span>
                  <PenTool className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses/javascript" className="w-full">
                <Button variant="outline" className="w-full flex items-center justify-between">
                  <span>JavaScript</span>
                  <Code className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses/python" className="w-full">
                <Button variant="outline" className="w-full flex items-center justify-between">
                  <span>Python</span>
                  <Terminal className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Mapear los datos de los cursos con sus iconos y colores
  const courseIcons = {
    html: <FileText className="h-8 w-8 text-html" />,
    css: <PenTool className="h-8 w-8 text-css" />,
    javascript: <Code className="h-8 w-8 text-javascript" />,
    python: <Terminal className="h-8 w-8 text-python" />,
  }

  const courseColors = {
    html: "course-card-html",
    css: "course-card-css",
    javascript: "course-card-javascript",
    python: "course-card-python",
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bienvenido, {session?.user?.name?.split(" ")[0] || "Estudiante"}</h1>
        <p className="text-muted-foreground">
          Continúa tu viaje de aprendizaje con nuestros cursos fundamentales de programación.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => {
          const courseProgress = calculateCourseProgress(course.id)
          const modules = getCourseModules(course.id)

          return (
            <Card
              key={course.id}
              className={cn("overflow-hidden transition-all duration-300 hover:shadow-lg", courseColors[course.id])}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                {courseIcons[course.id]}
                <div>
                  <CardTitle>{course.title.split(":")[0]}</CardTitle>
                  <CardDescription className="text-gray-700 dark:text-gray-300">{course.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Progreso</span>
                  <span className="text-sm font-medium">{courseProgress}%</span>
                </div>
                <Progress value={courseProgress} className="h-2" />

                <div className="mt-4 space-y-1">
                  {modules.slice(0, 2).map((module) => (
                    <Link
                      key={module.module_id}
                      href={`/courses/${course.id}/${module.module_id.split("-")[1]}`}
                      className="flex items-center justify-between py-1 px-2 rounded-md text-sm hover:bg-muted/50 transition-colors"
                    >
                      <span className={module.completed ? "text-muted-foreground line-through" : ""}>
                        {module.title}
                      </span>
                      {module.completed ? (
                        <span className="text-green-500 text-xs font-medium">Completado</span>
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Link>
                  ))}
                  {modules.length > 2 && (
                    <div className="text-center pt-1">
                      <Link href={`/courses/${course.id}`} className="text-xs text-primary hover:underline">
                        Ver todos los módulos
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/courses/${course.id}`} className="w-full">
                  <Button className="w-full">Continuar Aprendiendo</Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Actividad Reciente</h2>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {progress && progress.filter((item) => item.completed).length > 0 ? (
                progress
                  .filter((item) => item.completed)
                  .slice(0, 5)
                  .map((item) => {
                    const course = courses.find((c) => c.id === item.course_id)
                    return (
                      <div
                        key={item.module_id}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {courseIcons[item.course_id]}
                        <div className="flex-1">
                          <h3 className="font-medium">{course?.title.split(":")[0]}</h3>
                          <p className="text-sm text-muted-foreground">Módulo completado: {item.title}</p>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/courses/${item.course_id}`}>Continuar</Link>
                        </Button>
                      </div>
                    )
                  })
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No has completado ningún módulo todavía. ¡Comienza tu viaje de aprendizaje ahora!
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/courses/html/intro">Comenzar con HTML</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

