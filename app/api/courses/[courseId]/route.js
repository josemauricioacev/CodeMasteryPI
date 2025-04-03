import { NextResponse } from "next/server"
import { getCourseById, getModulesByCourse } from "@/lib/db"

export async function GET(request, context) {
  try {
    const { courseId } = context.params

    const course = await getCourseById(courseId)
    if (!course) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 })
    }

    const modules = await getModulesByCourse(courseId)

    return NextResponse.json({
      ...course,
      modules,
    })
  } catch (error) {
    console.error("Error al obtener curso:", error)
    return NextResponse.json({ error: "Error al obtener el curso" }, { status: 500 })
  }
}
