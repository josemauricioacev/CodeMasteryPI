import { NextResponse } from "next/server"
import { getModuleById, getLessonsByModule } from "@/lib/db"

export async function GET(request, context) {
  try {
    const { moduleId } = context.params

    const module = await getModuleById(moduleId)
    if (!module) {
      return NextResponse.json({ error: "Módulo no encontrado" }, { status: 404 })
    }

    const lessons = await getLessonsByModule(moduleId)

    return NextResponse.json({
      ...module,
      lessons,
    })
  } catch (error) {
    console.error("Error al obtener módulo:", error)
    return NextResponse.json({ error: "Error al obtener el módulo" }, { status: 500 })
  }
}
