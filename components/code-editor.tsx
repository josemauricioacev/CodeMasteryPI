"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, RefreshCw, Play, Copy, CheckCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface CodeEditorProps {
  initialCode: string
  language: "html" | "css" | "javascript" | "python"
  solution: string
  lessonId?: number
  onCheck?: (isCorrect: boolean) => void
}

export function CodeEditor({ initialCode, language, solution, lessonId, onCheck }: CodeEditorProps) {
  const { data: session } = useSession()
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const previewRef = useRef<HTMLIFrameElement>(null)
  const [previewContent, setPreviewContent] = useState("")
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("editor")

  // Función para actualizar la vista previa
  const updatePreview = () => {
    if (language === "html") {
      setPreviewContent(code)
    } else if (language === "css") {
      setPreviewContent(`
        <style>${code}</style>
        <div style="padding: 20px; font-family: system-ui, sans-serif;">
          <h1>Título de Ejemplo</h1>
          <p>Párrafo de ejemplo para mostrar estilos CSS. Este texto se utiliza para demostrar cómo se aplican los estilos CSS que has escrito.</p>
          <button style="padding: 8px 16px; border-radius: 4px; border: 1px solid #ccc; background: #f0f0f0;">Botón de Ejemplo</button>
          <div style="margin-top: 20px; display: flex; gap: 10px;">
            <div style="width: 100px; height: 100px; background-color: #e0e0e0;"></div>
            <div style="width: 100px; height: 100px; background-color: #c0c0c0;"></div>
            <div style="width: 100px; height: 100px; background-color: #a0a0a0;"></div>
          </div>
        </div>
      `)
    } else if (language === "javascript") {
      setPreviewContent(`
        <div style="padding: 20px; font-family: system-ui, sans-serif;">
          <h3>Consola JavaScript</h3>
          <div id="output" style="background-color: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; padding: 10px; font-family: monospace; min-height: 100px; max-height: 300px; overflow-y: auto;"></div>
        </div>
        <script>
          const originalConsoleLog = console.log;
          console.log = function(...args) {
            originalConsoleLog.apply(console, args);
            const output = document.getElementById('output');
            const line = document.createElement('div');
            line.style.borderBottom = '1px solid #eee';
            line.style.padding = '4px 0';
            line.textContent = args.join(' ');
            output.appendChild(line);
          };
          
          try {
            ${code}
          } catch (error) {
            console.log('Error:', error.message);
          }
        </script>
      `)
    } else if (language === "python") {
      // Para Python, no podemos ejecutar en el navegador, así que mostramos un mensaje
      setPreviewContent(`
        <div style="padding: 20px; font-family: system-ui, sans-serif; text-align: center;">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style="margin: 0 auto 16px;">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <h3 style="margin-bottom: 8px;">Vista previa no disponible para Python</h3>
          <p style="color: #666;">Python no se puede ejecutar directamente en el navegador. Utiliza el botón "Verificar" para comprobar tu código.</p>
        </div>
      `)
    }
  }

  // Actualizar la vista previa cuando cambia el código
  useEffect(() => {
    const timer = setTimeout(() => {
      updatePreview()
    }, 500) // Pequeño retraso para evitar actualizaciones constantes mientras se escribe

    return () => clearTimeout(timer)
  }, [code, language])

  // Función para verificar la solución
  const checkSolution = async () => {
    // Normalizar el código para comparación
    const normalizedCode = code.replace(/\s+/g, " ").trim()
    const normalizedSolution = solution.replace(/\s+/g, " ").trim()

    const correct = normalizedCode === normalizedSolution
    setIsCorrect(correct)

    if (correct) {
      setOutput("¡Correcto! Tu solución es válida.")
    } else {
      setOutput("Tu solución aún no es correcta. Sigue intentando.")
    }

    // Guardar el intento en la base de datos si el usuario está autenticado
    if (session?.user?.id && lessonId) {
      try {
        await fetch("/api/exercises/attempt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lessonId,
            code,
            isCorrect: correct,
          }),
        })
      } catch (error) {
        console.error("Error al guardar el intento:", error)
      }
    }

    if (onCheck) {
      onCheck(correct)
    }
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput("")
    setIsCorrect(null)
    setShowSolution(false)
    updatePreview()
  }

  const toggleSolution = () => {
    setShowSolution(!showSolution)
  }

  const runCode = () => {
    updatePreview()
    setActiveTab("preview")
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getLanguageLabel = () => {
    switch (language) {
      case "html":
        return "HTML"
      case "css":
        return "CSS"
      case "javascript":
        return "JavaScript"
      case "python":
        return "Python"
      default:
        return language.toUpperCase()
    }
  }

  const getLanguageColor = () => {
    switch (language) {
      case "html":
        return "bg-html text-white"
      case "css":
        return "bg-css text-white"
      case "javascript":
        return "bg-javascript text-black"
      case "python":
        return "bg-python text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="code-editor-container">
      <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between bg-muted px-2">
          <TabsList className="bg-transparent h-12">
            <TabsTrigger
              value="editor"
              className="data-[state=active]:bg-background rounded-t-md rounded-b-none border-b-2 data-[state=active]:border-primary data-[state=inactive]:border-transparent transition-all"
            >
              Editor
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-background rounded-t-md rounded-b-none border-b-2 data-[state=active]:border-primary data-[state=inactive]:border-transparent transition-all"
            >
              Vista Previa
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center">
            <span className={cn("text-xs font-medium px-2 py-1 rounded", getLanguageColor())}>
              {getLanguageLabel()}
            </span>
          </div>
        </div>
        <TabsContent value="editor" className="m-0 p-0">
          <div className="relative p-4 bg-background">
            <div className="flex items-center justify-end mb-2 gap-2">
              <Button variant="outline" size="sm" onClick={copyCode} className="h-8">
                {copied ? <CheckCheck className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copiado" : "Copiar"}
              </Button>
              <Button variant="outline" size="sm" onClick={resetCode} className="h-8">
                <RefreshCw className="h-4 w-4 mr-1" />
                Reiniciar
              </Button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="code-editor-textarea"
              spellCheck="false"
            />

            <div className="flex justify-between mt-4">
              <div className="space-x-2">
                <Button onClick={checkSolution} variant="default">
                  <Check className="h-4 w-4 mr-2" />
                  Verificar
                </Button>
                <Button onClick={runCode} variant="secondary">
                  <Play className="h-4 w-4 mr-2" />
                  Ejecutar
                </Button>
              </div>
              <Button onClick={toggleSolution} variant="outline">
                {showSolution ? "Ocultar Solución" : "Ver Solución"}
              </Button>
            </div>

            {isCorrect !== null && (
              <Card
                className={cn(
                  "p-4 mt-4 animate-fade-in",
                  isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                )}
              >
                <div className="flex items-center">
                  {isCorrect ? (
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-red-600 dark:bg-red-400 mr-2" />
                  )}
                  <p>{output}</p>
                </div>
              </Card>
            )}

            {showSolution && (
              <div className="mt-4 animate-fade-in">
                <h3 className="text-lg font-semibold mb-2">Solución:</h3>
                <div className="bg-muted/30 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    <code>{solution}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="preview" className="m-0 p-0">
          <div className="p-4 bg-background">
            <div className="code-preview">
              <iframe
                ref={previewRef}
                srcDoc={previewContent}
                title="Vista previa"
                className="w-full h-full"
                sandbox="allow-scripts"
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setActiveTab("editor")}>
                Volver al Editor
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

