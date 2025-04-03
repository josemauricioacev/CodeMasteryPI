import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { getUserProgress, updateUserProgress } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const progress = await getUserProgress(userId)

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Error al obtener progreso:", error)
    return NextResponse.json({ error: "Error al obtener el progreso" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { moduleId, completed } = await request.json()

    if (!moduleId) {
      return NextResponse.json({ error: "ID de módulo requerido" }, { status: 400 })
    }

    const userId = session.user.id
    await updateUserProgress(userId, moduleId, completed)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar progreso:", error)
    return NextResponse.json({ error: "Error al actualizar el progreso" }, { status: 500 })
  }
}

