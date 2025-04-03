import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, FileText, PenTool, Terminal } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Sobre CodeMastery</h1>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="lead">
            CodeMastery es una plataforma educativa diseñada para ayudarte a dominar los fundamentos de la programación
            web y más allá.
          </p>

          <p>
            Nuestra misión es proporcionar una experiencia de aprendizaje concisa, práctica y efectiva que te permita
            adquirir habilidades de programación reales en el menor tiempo posible.
          </p>

          <h2>Nuestra Filosofía</h2>

          <p>
            Creemos que la mejor manera de aprender a programar es a través de la práctica constante y la aplicación
            inmediata de los conceptos. Por eso, cada lección en CodeMastery incluye:
          </p>

          <ul>
            <li>Explicaciones claras y concisas de los conceptos</li>
            <li>Ejemplos prácticos que ilustran los conceptos en acción</li>
            <li>Ejercicios interactivos para poner a prueba tu comprensión</li>
            <li>Proyectos reales que te permiten aplicar lo aprendido</li>
          </ul>

          <h2>Nuestro Enfoque</h2>

          <p>Nos centramos en cuatro lenguajes fundamentales que forman la base de la programación web moderna:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="h-8 w-8 text-orange-500" />
              <div>
                <CardTitle>HTML</CardTitle>
                <CardDescription>El lenguaje de marcado estándar para la web</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Aprende a estructurar el contenido web con HTML, desde los elementos básicos hasta las técnicas
                avanzadas de marcado semántico.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <PenTool className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle>CSS</CardTitle>
                <CardDescription>El lenguaje de estilo para la web</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Domina CSS para diseñar interfaces atractivas y responsivas, desde los conceptos básicos hasta técnicas
                avanzadas de layout.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Code className="h-8 w-8 text-yellow-500" />
              <div>
                <CardTitle>JavaScript</CardTitle>
                <CardDescription>El lenguaje de programación de la web</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Aprende JavaScript para añadir interactividad y funcionalidad dinámica a tus sitios web, desde lo básico
                hasta conceptos avanzados.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Terminal className="h-8 w-8 text-green-500" />
              <div>
                <CardTitle>Python</CardTitle>
                <CardDescription>Un lenguaje versátil y potente</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>
                Domina Python, un lenguaje de programación de alto nivel utilizado en desarrollo web, ciencia de datos,
                IA y más.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2>Nuestro Compromiso</h2>

          <p>En CodeMastery, nos comprometemos a:</p>

          <ul>
            <li>Mantener nuestro contenido actualizado con las últimas prácticas y tecnologías</li>
            <li>Proporcionar una experiencia de aprendizaje accesible para todos</li>
            <li>Escuchar los comentarios de nuestros estudiantes y mejorar constantemente</li>
            <li>Fomentar un ambiente de aprendizaje inclusivo y colaborativo</li>
          </ul>

          <p>
            Comienza tu viaje de aprendizaje con CodeMastery hoy y da el primer paso hacia el dominio de la
            programación.
          </p>
        </div>
      </div>
    </div>
  )
}

