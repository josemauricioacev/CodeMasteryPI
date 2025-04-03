import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { saveExerciseAttempt } from "@/lib/db"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { lessonId, code, isCorrect } = await request.json()

    if (!lessonId || !code) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const userId = session.user.id
    await saveExerciseAttempt(userId, lessonId, code, isCorrect)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al guardar intento:", error)
    return NextResponse.json({ error: "Error al guardar el intento" }, { status: 500 })
  }
}

