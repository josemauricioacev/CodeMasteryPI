import { NextResponse } from "next/server"
import { getCourses } from "@/lib/db"

export async function GET() {
  try {
    const courses = await getCourses()
    return NextResponse.json(courses)
  } catch (error) {
    console.error("Error al obtener cursos:", error)
    return NextResponse.json({ error: "Error al obtener los cursos" }, { status: 500 })
  }
}

