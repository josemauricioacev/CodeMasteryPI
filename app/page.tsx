import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, FileText, PenTool, Code, Terminal, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 animate-fade-in">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Domina los Fundamentos de la Programación
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Aprende HTML, CSS, JavaScript y Python con ejercicios prácticos y proyectos reales.
                </p>
              </div>
              <div className="space-x-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90">
                    Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline">Conocer Más</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">Nuestros Cursos</h2>
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "HTML",
                  description: "Estructura el contenido web con el lenguaje de marcado estándar.",
                  href: "/courses/html",
                  icon: <FileText className="h-10 w-10 text-html" />,
                  color: "course-card-html",
                  features: ["Estructura básica", "Elementos HTML", "Formularios", "HTML Semántico"],
                },
                {
                  title: "CSS",
                  description: "Diseña y estiliza tus páginas web con hojas de estilo en cascada.",
                  href: "/courses/css",
                  icon: <PenTool className="h-10 w-10 text-css" />,
                  color: "course-card-css",
                  features: ["Selectores", "Modelo de Caja", "Flexbox y Grid", "Diseño Responsivo"],
                },
                {
                  title: "JavaScript",
                  description: "Añade interactividad y funcionalidad dinámica a tus sitios web.",
                  href: "/courses/javascript",
                  icon: <Code className="h-10 w-10 text-javascript" />,
                  color: "course-card-javascript",
                  features: ["Variables y Tipos", "Funciones", "DOM", "Asincronía"],
                },
                {
                  title: "Python",
                  description: "Desarrolla aplicaciones versátiles con este lenguaje de alto nivel.",
                  href: "/courses/python",
                  icon: <Terminal className="h-10 w-10 text-python" />,
                  color: "course-card-python",
                  features: ["Sintaxis Básica", "Control de Flujo", "Funciones", "Módulos"],
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className={cn("flex flex-col h-full course-card animate-fade-in", item.color)}
                  style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      {item.icon}
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">{item.description}</p>
                    <ul className="space-y-2 mb-6">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-6 pt-0">
                    <Link href={item.href} className="w-full">
                      <Button variant="outline" className="w-full">
                        Explorar Curso
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">¿Por qué elegir CodeMastery?</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Nuestra plataforma está diseñada para ofrecer una experiencia de aprendizaje efectiva y práctica.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-8">
                {[
                  {
                    title: "Enfoque Práctico",
                    description: "Aprende haciendo con ejercicios interactivos y proyectos reales.",
                    icon: <Code className="h-10 w-10 text-primary" />,
                  },
                  {
                    title: "Contenido Conciso",
                    description: "Material directo al punto, sin relleno innecesario.",
                    icon: <FileText className="h-10 w-10 text-primary" />,
                  },
                  {
                    title: "Evaluación Inmediata",
                    description: "Recibe retroalimentación instantánea sobre tu código.",
                    icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
                  },
                ].map((feature, index) => (
                  <div
                    key={feature.title}
                    className="flex flex-col items-center space-y-4 p-6 bg-muted/30 rounded-lg animate-fade-in"
                    style={{ animationDelay: `${0.1 * (index + 1)}s` }}
                  >
                    <div className="p-3 rounded-full bg-primary/10">{feature.icon}</div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-center">{feature.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <Link href="/dashboard">
                  <Button size="lg" className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
                    Comenzar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

