"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, BookOpen, CodeIcon, FileText, PenTool, Terminal } from "lucide-react"
import { CodeEditor } from "@/components/code-editor"
import { cn } from "@/lib/utils"
import { useModule } from "@/lib/hooks/use-module"
import { useCourse } from "@/lib/hooks/use-courses"
import { useUserProgress } from "@/lib/hooks/use-progress"
import { useSession } from "next-auth/react"

// Iconos para cada curso
const courseIcons = {
  html: <FileText className="h-6 w-6 text-html" />,
  css: <PenTool className="h-6 w-6 text-css" />,
  javascript: <CodeIcon className="h-6 w-6 text-javascript" />,
  python: <Terminal className="h-6 w-6 text-python" />,
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

export default function ModulePage({ params }: { params: { courseId: string; moduleId: string } }) {
  const { courseId, moduleId } = params
  const router = useRouter()
  const { data: session } = useSession()
  const { course, loading: courseLoading } = useCourse(courseId)
  const { module, loading: moduleLoading } = useModule(`${courseId}-${moduleId}`)
  const { progress, updateProgress } = useUserProgress()
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)

  // Verificar si el curso y el módulo existen
  useEffect(() => {
    if (!courseLoading && !course) {
      notFound()
    }
    if (!moduleLoading && !module) {
      notFound()
    }
  }, [course, courseLoading, module, moduleLoading])

  if (courseLoading || moduleLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 bg-muted rounded"></div>
        <div className="h-4 w-96 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded-lg mt-8"></div>
      </div>
    )
  }

  if (!course || !module) {
    return notFound()
  }

  const lessons = module.lessons || []
  const currentLesson = lessons[currentLessonIndex] || {}

  const courseIcon = courseIcons[courseId]
  const courseColor = courseColors[courseId]

  // Obtener índice del módulo actual para navegación
  const modules = course.modules || []
  const currentModuleIndex = modules.findIndex((m) => m.id === module.id)
  const prevModule = currentModuleIndex > 0 ? modules[currentModuleIndex - 1] : null
  const nextModule = currentModuleIndex < modules.length - 1 ? modules[currentModuleIndex + 1] : null

  // Manejar la verificación del ejercicio
  const handleCheckExercise = async (isCorrect) => {
    if (isCorrect && session) {
      // Si es la última lección del módulo, marcar el módulo como completado
      if (currentLessonIndex === lessons.length - 1) {
        await updateProgress(module.id, true)
      }
    }
  }

  // Navegar a la siguiente lección
  const goToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    } else if (nextModule) {
      router.push(`/courses/${courseId}/${nextModule.id.split("-")[1]}`)
    }
  }

  // Navegar a la lección anterior
  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    } else if (prevModule) {
      router.push(`/courses/${courseId}/${prevModule.id.split("-")[1]}`)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href={`/courses/${courseId}`}
              className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-md hover:bg-muted transition-colors",
                courseColor.text,
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Volver al curso</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {courseIcon}
            <span className={cn("font-medium", courseColor.text)}>{courseId.toUpperCase()}</span>
          </div>
        </div>
        <h1 className={cn("text-3xl font-bold mt-4", courseColor.text)}>{module.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Módulo {currentModuleIndex + 1} de {modules.length}
          </span>
        </div>

        {lessons.length > 1 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">
              Lección {currentLessonIndex + 1} de {lessons.length}
            </span>
            <div className="flex gap-1 ml-2">
              {lessons.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    index === currentLessonIndex ? courseColor.text : "bg-muted hover:bg-muted-foreground/50",
                  )}
                  onClick={() => setCurrentLessonIndex(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="theory" className="w-full">
        <TabsList className="mb-4 w-full md:w-auto">
          <TabsTrigger value="theory" className="flex-1 md:flex-none">
            <BookOpen className="h-4 w-4 mr-2" />
            Teoría
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex-1 md:flex-none">
            <CodeIcon className="h-4 w-4 mr-2" />
            Práctica
          </TabsTrigger>
        </TabsList>
        <TabsContent value="theory">
          <Card className={cn("border", courseColor.border)}>
            <CardContent className="p-6">
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: currentLesson.theory }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="practice">
          <Card className={cn("border", courseColor.border)}>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Ejercicio Práctico</h2>
              <p className="mb-6 text-muted-foreground">{currentLesson.practice_instructions}</p>

              <CodeEditor
                initialCode={currentLesson.practice_initial_code}
                language={courseId as "html" | "css" | "javascript" | "python"}
                solution={currentLesson.practice_solution}
                lessonId={currentLesson.id}
                onCheck={handleCheckExercise}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
        <Button
          variant="outline"
          className="flex items-center justify-start"
          onClick={goToPrevLesson}
          disabled={currentLessonIndex === 0 && !prevModule}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          <div className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Anterior</span>
            <span className="text-sm font-medium">
              {currentLessonIndex > 0
                ? lessons[currentLessonIndex - 1]?.title
                : prevModule?.title || "Inicio del curso"}
            </span>
          </div>
        </Button>

        <Button
          className={cn("flex items-center justify-end", courseColor.text)}
          onClick={goToNextLesson}
          disabled={currentLessonIndex === lessons.length - 1 && !nextModule}
        >
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Siguiente</span>
            <span className="text-sm font-medium">
              {currentLessonIndex < lessons.length - 1
                ? lessons[currentLessonIndex + 1]?.title
                : nextModule?.title || "Fin del curso"}
            </span>
          </div>
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

