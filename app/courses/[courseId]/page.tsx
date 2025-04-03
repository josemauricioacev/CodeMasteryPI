"use client"

import { useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText, PenTool, Code, Terminal, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCourse } from "@/lib/hooks/use-courses"
import { useUserProgress } from "@/lib/hooks/use-progress"
import { useSession } from "next-auth/react"

// Iconos para cada curso
const courseIcons = {
  html: <FileText className="h-12 w-12 text-html" />,
  css: <PenTool className="h-12 w-12 text-css" />,
  javascript: <Code className="h-12 w-12 text-javascript" />,
  python: <Terminal className="h-12 w-12 text-python" />,
}

// Colores para cada curso
const courseColors = {
  html: {
    text: "text-html",
    bg: "bg-html-light",
    border: "border-html",
  },
  css: {
    text: "text-css",
    bg: "bg-css-light",
    border: "border-css",
  },
  javascript: {
    text: "text-javascript",
    bg: "bg-javascript-light",
    border: "border-javascript",
  },
  python: {
    text: "text-python",
    bg: "bg-python-light",
    border: "border-python",
  },
}

export default function CoursePage({ params }: { params: { courseId: string } }) {
  const { courseId } = params
  const router = useRouter()
  const { data: session } = useSession()
  const { course, loading: courseLoading, error: courseError } = useCourse(courseId)
  const { progress, loading: progressLoading } = useUserProgress()

  // Verificar si el curso existe
  useEffect(() => {
    if (!courseLoading && !course && !courseError) {
      notFound()
    }
  }, [course, courseLoading, courseError])

  if (courseLoading || progressLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-8 w-64 bg-muted rounded"></div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!course) {
    return notFound()
  }

  const modules = course.modules || []
  const courseInfo = {
    icon: courseIcons[courseId],
    ...courseColors[courseId],
  }

  // Calcular el progreso del curso
  const getModuleProgress = (moduleId) => {
    if (!progress || !session) return false
    const moduleProgress = progress.find((p) => p.module_id === moduleId)
    return moduleProgress?.completed || false
  }

  const completedModules = modules.filter((module) => getModuleProgress(module.id)).length
  const totalModules = modules.length
  const progressPercentage = Math.round((completedModules / totalModules) * 100) || 0

  return (
    <div className="animate-fade-in">
      <div className={cn("p-6 rounded-lg mb-8", courseInfo.bg, courseInfo.border)}>
        <div className="flex items-center gap-4 mb-4">
          {courseInfo.icon}
          <div>
            <h1 className={cn("text-3xl font-bold", courseInfo.text)}>{course.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl">{course.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="bg-background rounded-full px-4 py-1 text-sm font-medium">
            {completedModules} de {totalModules} módulos completados
          </div>
          <div className="bg-background rounded-full px-4 py-1 text-sm font-medium">
            {progressPercentage}% completado
          </div>
          <div className="flex-1"></div>
          <Button asChild>
            <Link href={`/courses/${courseId}/${modules[0]?.id.split("-")[1] || "intro"}`}>Comenzar Curso</Link>
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Módulos del Curso</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module, index) => {
          const isCompleted = getModuleProgress(module.id)
          return (
            <Card
              key={module.id}
              className={cn(
                "overflow-hidden transition-all duration-300 hover:shadow-lg",
                isCompleted ? "border-green-200 dark:border-green-800" : "",
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm",
                        isCompleted ? "bg-green-500" : courseInfo.text,
                      )}
                    >
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : index + 1}
                    </div>
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                  </div>
                  {isCompleted && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                      Completado
                    </span>
                  )}
                </div>
                <CardDescription className="ml-10">{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="ml-10">
                  <p className="text-sm text-muted-foreground">
                    Este módulo te enseñará los conceptos fundamentales que necesitas dominar.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/courses/${courseId}/${module.id.split("-")[1]}`} className="w-full">
                  <Button
                    className={cn(
                      "w-full flex items-center justify-between",
                      isCompleted ? "bg-green-500 hover:bg-green-600" : "",
                    )}
                  >
                    <span>{isCompleted ? "Repasar Módulo" : "Comenzar Módulo"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

