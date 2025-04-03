import mysql from "mysql2/promise"

export async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Por defecto en XAMPP no hay contraseña
    database: "codemastery",
  })

  return connection
}

// Funciones de utilidad para interactuar con la base de datos

// Usuarios
export async function getUserById(id) {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute("SELECT id, name, email, image FROM users WHERE id = ?", [id])
    return rows[0]
  } finally {
    connection.end()
  }
}

export async function getUserByEmail(email) {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email])
    return rows[0]
  } finally {
    connection.end()
  }
}

export async function createUser(userData) {
  const connection = await connectToDatabase()
  try {
    const [result] = await connection.execute("INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)", [
      userData.name,
      userData.email,
      userData.password,
      userData.image || null,
    ])
    return result.insertId
  } finally {
    connection.end()
  }
}

export async function createUserIfNotExists(userData) {
  const connection = await connectToDatabase();
  try {
    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [userData.email]);

    if (rows.length === 0) {
      await connection.execute(
        "INSERT INTO users (name, email, image, google_id) VALUES (?, ?, ?, ?)",
        [userData.name, userData.email, userData.image || null, userData.googleId || null]
      );
    }
  } finally {
    connection.end();
  }
}

// Cursos
export async function getCourses() {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute("SELECT * FROM courses ORDER BY id")
    return rows
  } finally {
    connection.end()
  }
}

export async function getCourseById(id) {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute("SELECT * FROM courses WHERE id = ?", [id])
    return rows[0]
  } finally {
    connection.end()
  }
}

// Módulos
export async function getModulesByCourse(courseId) {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute("SELECT * FROM modules WHERE course_id = ? ORDER BY position", [courseId])
    return rows
  } finally {
    connection.end()
  }
}

export async function getModuleById(id) {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute("SELECT * FROM modules WHERE id = ?", [id])
    return rows[0]
  } finally {
    connection.end()
  }
}

// Lecciones
export async function getLessonsByModule(moduleId) {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute("SELECT * FROM lessons WHERE module_id = ? ORDER BY position", [moduleId])
    return rows
  } finally {
    connection.end()
  }
}

export async function getLessonById(id) {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute("SELECT * FROM lessons WHERE id = ?", [id])
    return rows[0]
  } finally {
    connection.end()
  }
}

// Progreso del usuario
export async function getUserProgress(userId) {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute(
      `SELECT m.course_id, m.id as module_id, m.title, up.completed 
       FROM modules m
       LEFT JOIN user_progress up ON m.id = up.module_id AND up.user_id = ?
       ORDER BY m.course_id, m.position`,
      [userId],
    )
    return rows
  } finally {
    connection.end()
  }
}

export async function updateUserProgress(userId, moduleId, completed) {
  const connection = await connectToDatabase()
  try {
    // Verificar si ya existe un registro
    const [existingRows] = await connection.execute("SELECT * FROM user_progress WHERE user_id = ? AND module_id = ?", [
      userId,
      moduleId,
    ])

    if (existingRows.length > 0) {
      // Actualizar registro existente
      await connection.execute(
        "UPDATE user_progress SET completed = ?, completion_date = ? WHERE user_id = ? AND module_id = ?",
        [completed, completed ? new Date() : null, userId, moduleId],
      )
    } else {
      // Crear nuevo registro
      await connection.execute(
        "INSERT INTO user_progress (user_id, module_id, completed, completion_date) VALUES (?, ?, ?, ?)",
        [userId, moduleId, completed, completed ? new Date() : null],
      )
    }

    return true
  } finally {
    connection.end()
  }
}

// Intentos de ejercicios
export async function saveExerciseAttempt(userId, lessonId, codeSubmitted, isCorrect) {
  const connection = await connectToDatabase()
  try {
    const [result] = await connection.execute(
      "INSERT INTO exercise_attempts (user_id, lesson_id, code_submitted, is_correct) VALUES (?, ?, ?, ?)",
      [userId, lessonId, codeSubmitted, isCorrect],
    )
    return result.insertId
  } finally {
    connection.end()
  }
}

export async function getExerciseAttempts(userId, lessonId) {
  const connection = await connectToDatabase()
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM exercise_attempts WHERE user_id = ? AND lesson_id = ? ORDER BY attempt_date DESC",
      [userId, lessonId],
    )
    return rows
  } finally {
    connection.end()
  }
}

