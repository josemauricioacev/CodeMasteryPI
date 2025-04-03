-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS codemastery;
USE codemastery;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    google_id VARCHAR(255),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de cursos
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color_class VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de módulos
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(50) PRIMARY KEY,
    course_id VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Tabla de lecciones
CREATE TABLE IF NOT EXISTS lessons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_id VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    theory TEXT NOT NULL,
    practice_instructions TEXT NOT NULL,
    practice_initial_code TEXT NOT NULL,
    practice_solution TEXT NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
);

-- Tabla de progreso del usuario
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    module_id VARCHAR(50) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE KEY user_module (user_id, module_id)
);

-- Tabla de intentos de ejercicios
CREATE TABLE IF NOT EXISTS exercise_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    code_submitted TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id INT,
    expires TIMESTAMP NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    access_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de cuentas (para autenticación con proveedores externos como Google)
CREATE TABLE IF NOT EXISTS accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    provider VARCHAR(255) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INT,
    token_type VARCHAR(255),
    scope VARCHAR(255),
    id_token TEXT,
    session_state VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY provider_account_id (provider, provider_account_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertar datos de ejemplo

-- Usuarios
INSERT INTO users (name, email, password, image) VALUES
('Usuario Ejemplo', 'ejemplo@ejemplo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '/placeholder.svg?height=32&width=32'),
('Ana García', 'ana@ejemplo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '/placeholder.svg?height=32&width=32'),
('Juan Pérez', 'juan@ejemplo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '/placeholder.svg?height=32&width=32');

-- Cursos
INSERT INTO courses (id, title, description, icon, color_class) VALUES
('html', 'HTML: Fundamentos de la Web', 'Aprende a estructurar contenido web con HTML, el lenguaje de marcado estándar para crear páginas web.', 'FileText', 'course-card-html'),
('css', 'CSS: Estilizando la Web', 'Domina CSS para diseñar y dar estilo a tus páginas web, creando interfaces atractivas y responsivas.', 'PenTool', 'course-card-css'),
('javascript', 'JavaScript: Programación Web', 'Aprende JavaScript para añadir interactividad y funcionalidad dinámica a tus sitios web.', 'Code', 'course-card-javascript'),
('python', 'Python: Programación Versátil', 'Domina Python, un lenguaje de programación de alto nivel, versátil y potente para diversas aplicaciones.', 'Terminal', 'course-card-python');

-- Módulos
INSERT INTO modules (id, course_id, title, description, position) VALUES
-- HTML Modules
('html-intro', 'html', 'Introducción a HTML', 'Conceptos básicos y estructura de documentos HTML', 1),
('html-elements', 'html', 'Elementos HTML', 'Etiquetas y atributos fundamentales', 2),
('html-forms', 'html', 'Formularios', 'Creación y validación de formularios', 3),
('html-semantic', 'html', 'HTML Semántico', 'Uso de elementos semánticos para mejorar la accesibilidad', 4),

-- CSS Modules
('css-intro', 'css', 'Introducción a CSS', 'Sintaxis y selectores básicos', 1),
('css-box-model', 'css', 'Modelo de Caja', 'Padding, margin, border y dimensiones', 2),
('css-layout', 'css', 'Diseño y Layout', 'Flexbox, Grid y posicionamiento', 3),
('css-responsive', 'css', 'Diseño Responsivo', 'Media queries y estrategias adaptativas', 4),

-- JavaScript Modules
('js-intro', 'javascript', 'Introducción a JavaScript', 'Sintaxis básica y tipos de datos', 1),
('js-functions', 'javascript', 'Funciones', 'Declaración, expresiones y funciones flecha', 2),
('js-dom', 'javascript', 'Manipulación del DOM', 'Selección y modificación de elementos HTML', 3),
('js-async', 'javascript', 'JavaScript Asíncrono', 'Promesas, async/await y fetch API', 4),

-- Python Modules
('py-intro', 'python', 'Introducción a Python', 'Sintaxis básica y tipos de datos', 1),
('py-control-flow', 'python', 'Control de Flujo', 'Condicionales y bucles', 2),
('py-functions', 'python', 'Funciones', 'Definición y uso de funciones', 3),
('py-modules', 'python', 'Módulos y Paquetes', 'Organización de código y uso de bibliotecas', 4);

-- Lecciones (solo para el primer módulo de HTML como ejemplo)
INSERT INTO lessons (module_id, title, theory, practice_instructions, practice_initial_code, practice_solution, position) VALUES
('html-intro', 'Estructura básica de HTML',
'<h2>¿Qué es HTML?</h2>
<p>HTML (HyperText Markup Language) es el lenguaje estándar para crear páginas web. Define la estructura y el contenido de una página web mediante una serie de elementos que le dicen al navegador cómo mostrar el contenido.</p>
<h2>Estructura básica de un documento HTML</h2>
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  &lt;title&gt;Título de la página&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Mi primer título&lt;/h1&gt;
  &lt;p&gt;Mi primer párrafo.&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>',
'Crea un documento HTML básico con un título, un encabezado y un párrafo.',
'<!DOCTYPE html>
<html>
<head>
  <title></title>
</head>
<body>
  <!-- Añade un encabezado h1 y un párrafo p aquí -->
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Mi primera página</title>
</head>
<body>
  <h1>Bienvenido a HTML</h1>
  <p>Este es mi primer párrafo en HTML.</p>
</body>
</html>',
1),

('html-intro', 'Elementos de texto',
'<h2>Elementos de texto en HTML</h2>
<p>HTML proporciona varios elementos para formatear texto, como encabezados, párrafos, listas y más.</p>
<h2>Encabezados</h2>
<pre><code>&lt;h1&gt;Encabezado 1&lt;/h1&gt;
&lt;h2&gt;Encabezado 2&lt;/h2&gt;
&lt;h3&gt;Encabezado 3&lt;/h3&gt;</code></pre>
<h2>Párrafos y formato</h2>
<pre><code>&lt;p&gt;Este es un párrafo.&lt;/p&gt;
&lt;strong&gt;Texto en negrita&lt;/strong&gt;
&lt;em&gt;Texto en cursiva&lt;/em&gt;</code></pre>',
'Crea una página HTML con diferentes niveles de encabezados y párrafos con formato.',
'<!DOCTYPE html>
<html>
<head>
  <title>Elementos de texto</title>
</head>
<body>
  <!-- Añade encabezados h1, h2 y párrafos con formato -->
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Elementos de texto</title>
</head>
<body>
  <h1>Encabezado Principal</h1>
  <p>Este es un párrafo normal.</p>
  <h2>Encabezado Secundario</h2>
  <p>Este texto tiene <strong>palabras en negrita</strong> y <em>palabras en cursiva</em>.</p>
</body>
</html>',
2),

('html-elements', 'Etiquetas comunes',
'<h2>Etiquetas comunes en HTML</h2>
<p>HTML usa etiquetas como <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code>, <code>&lt;a&gt;</code>, etc., para estructurar el contenido.</p>
<h2>Ejemplo de uso</h2>
<pre><code>&lt;p&gt;Este es un párrafo.&lt;/p&gt;
&lt;a href="https://www.ejemplo.com"&gt;Este es un enlace&lt;/a&gt;</code></pre>',
'Agrega un párrafo con el texto "Hola mundo".',
'<!DOCTYPE html>
<html>
<head>
  <title>Etiquetas comunes</title>
</head>
<body>
  <!-- Agrega un párrafo aquí -->
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Etiquetas comunes</title>
</head>
<body>
  <p>Hola mundo</p>
</body>
</html>',
1),

('html-elements', 'Listas en HTML',
'<h2>Listas en HTML</h2>
<p>HTML permite crear listas ordenadas y desordenadas.</p>
<h2>Ejemplo de listas</h2>
<pre><code>&lt;ul&gt;
  &lt;li&gt;Elemento 1&lt;/li&gt;
  &lt;li&gt;Elemento 2&lt;/li&gt;
&lt;/ul&gt;
&lt;ol&gt;
  &lt;li&gt;Elemento 1&lt;/li&gt;
  &lt;li&gt;Elemento 2&lt;/li&gt;
&lt;/ol&gt;</code></pre>',
'Crea una lista desordenada con tres elementos.',
'<!DOCTYPE html>
<html>
<head>
  <title>Listas en HTML</title>
</head>
<body>
  <!-- Crea una lista desordenada aquí -->
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Listas en HTML</title>
</head>
<body>
  <ul>
    <li>Elemento 1</li>
    <li>Elemento 2</li>
    <li>Elemento 3</li>
  </ul>
</body>
</html>',
2),

('html-forms', 'Formularios en HTML',
'<h2>Formularios en HTML</h2>
<p>Puedes usar etiquetas como <code>&lt;form&gt;</code>, <code>&lt;input&gt;</code>, <code>&lt;label&gt;</code>, etc., para crear formularios interactivos.</p>
<h2>Ejemplo de formulario</h2>
<pre><code>&lt;form&gt;
  &lt;label for="nombre"&gt;Nombre:&lt;/label&gt;
  &lt;input type="text" id="nombre" name="nombre"&gt;
  &lt;button type="submit"&gt;Enviar&lt;/button&gt;
&lt;/form&gt;</code></pre>',
'Crea un formulario con un campo de texto y un botón enviar.',
'<!DOCTYPE html>
<html>
<head>
  <title>Formularios en HTML</title>
</head>
<body>
  <!-- Crea un formulario aquí -->
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Formularios en HTML</title>
</head>
<body>
  <form>
    <input type="text" />
    <button>Enviar</button>
  </form>
</body>
</html>',
1),

('html-forms', 'Tipos de entrada en formularios',
'<h2>Tipos de entrada en formularios</h2>
<p>HTML ofrece varios tipos de entrada como texto, correo electrónico, contraseña, etc.</p>
<h2>Ejemplo de tipos de entrada</h2>
<pre><code>&lt;input type="email" placeholder="Correo electrónico"&gt;
&lt;input type="password" placeholder="Contraseña"&gt;</code></pre>',
'Crea un formulario con un campo de correo electrónico y un campo de contraseña.',
'<!DOCTYPE html>
<html>
<head>
  <title>Tipos de entrada en formularios</title>
</head>
<body>
  <!-- Crea un formulario aquí -->
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Tipos de entrada en formularios</title>
</head>
<body>
  <form>
    <input type="email" placeholder="Correo electrónico" />
    <input type="password" placeholder="Contraseña" />
    <button>Enviar</button>
  </form>
</body>
</html>',
2),

('html-semantic', 'HTML Semántico',
'<h2>HTML Semántico</h2>
<p>Etiquetas como <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;nav&gt;</code> mejoran la accesibilidad y el SEO de tu sitio web.</p>
<h2>Ejemplo de uso</h2>
<pre><code>&lt;section&gt;
  &lt;h2&gt;Sección de contenido&lt;/h2&gt;
  &lt;p&gt;Contenido dentro de una sección.&lt;/p&gt;
&lt;/section&gt;</code></pre>',
'Usa <code>&lt;section&gt;</code> para agrupar contenido.',
'<!DOCTYPE html>
<html>
<head>
  <title>HTML Semántico</title>
</head>
<body>
  <!-- Usa <section> aquí -->
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>HTML Semántico</title>
</head>
<body>
  <section>
    <p>Contenido dentro de sección</p>
  </section>
</body>
</html>',
1),

('html-semantic', 'Etiquetas semánticas avanzadas',
'<h2>Etiquetas semánticas avanzadas</h2>
<p>Etiquetas como <code>&lt;header&gt;</code>, <code>&lt;footer&gt;</code>, <code>&lt;main&gt;</code> y <code>&lt;aside&gt;</code> también mejoran la estructura del documento.</p>
<h2>Ejemplo de uso</h2>
<pre><code>&lt;header&gt;
  &lt;h1&gt;Encabezado principal&lt;/h1&gt;
&lt;/header&gt;
&lt;footer&gt;
  &lt;p&gt;Pie de página&lt;/p&gt;
&lt;/footer&gt;</code></pre>',
'Usa <code>&lt;header&gt;</code> y <code>&lt;footer&gt;</code> en tu documento.',
'<!DOCTYPE html>
<html>
<head>
  <title>Etiquetas semánticas avanzadas</title>
</head>
<body>
  <!-- Usa <header> y <footer> aquí -->
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Etiquetas semánticas avanzadas</title>
</head>
<body>
  <header>
    <h1>Encabezado principal</h1>
  </header>
  <footer>
    <p>Pie de página</p>
  </footer>
</body>
</html>',
2),

-- Lecciones para CSS
('css-intro', 'Selectores Básicos',
'<h2>Selectores Básicos en CSS</h2>
<p>CSS permite seleccionar elementos HTML y aplicarles estilo.</p>
<h2>Ejemplo de selector</h2>
<pre><code>p {
  color: red;
}</code></pre>',
'Aplica color rojo al texto de un párrafo.',
'<!DOCTYPE html>
<html>
<head>
  <title>Selectores Básicos</title>
</head>
<body>
  <p>Texto</p>
  <style>
    /* Añade el estilo aquí */
  </style>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Selectores Básicos</title>
</head>
<body>
  <p>Texto</p>
  <style>
    p {
      color: red;
    }
  </style>
</body>
</html>',
1),

('css-intro', 'Selectores de Clase y ID',
'<h2>Selectores de Clase y ID en CSS</h2>
<p>Puedes seleccionar elementos por su clase o ID.</p>
<h2>Ejemplo de selectores</h2>
<pre><code>.clase {
  color: blue;
}
#id {
  font-size: 20px;
}</code></pre>',
'Aplica estilo a elementos con una clase e ID específicos.',
'<!DOCTYPE html>
<html>
<head>
  <title>Selectores de Clase y ID</title>
</head>
<body>
  <p class="clase">Texto con clase</p>
  <p id="id">Texto con ID</p>
  <style>
    /* Añade el estilo aquí */
  </style>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Selectores de Clase y ID</title>
</head>
<body>
  <p class="clase">Texto con clase</p>
  <p id="id">Texto con ID</p>
  <style>
    .clase {
      color: blue;
    }
    #id {
      font-size: 20px;
    }
  </style>
</body>
</html>',
2),

('css-box-model', 'Modelo de Caja',
'<h2>Modelo de Caja en CSS</h2>
<p>Cada elemento tiene margin, border, padding y contenido.</p>
<h2>Ejemplo de Modelo de Caja</h2>
<pre><code>div {
  padding: 10px;
  border: 1px solid black;
}</code></pre>',
'Agrega padding y border a un div.',
'<!DOCTYPE html>
<html>
<head>
  <title>Modelo de Caja</title>
</head>
<body>
  <div>Contenido</div>
  <style>
    /* Añade el estilo aquí */
  </style>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Modelo de Caja</title>
</head>
<body>
  <div>Contenido</div>
  <style>
    div {
      padding: 10px;
      border: 1px solid black;
    }
  </style>
</body>
</html>',
1),

('css-box-model', 'Márgenes y Bordes',
'<h2>Márgenes y Bordes en CSS</h2>
<p>Puedes controlar los márgenes y bordes de los elementos.</p>
<h2>Ejemplo de márgenes y bordes</h2>
<pre><code>div {
  margin: 20px;
  border: 2px dashed red;
}</code></pre>',
'Agrega márgenes y bordes a un div.',
'<!DOCTYPE html>
<html>
<head>
  <title>Márgenes y Bordes</title>
</head>
<body>
  <div>Contenido</div>
  <style>
    /* Añade el estilo aquí */
  </style>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Márgenes y Bordes</title>
</head>
<body>
  <div>Contenido</div>
  <style>
    div {
      margin: 20px;
      border: 2px dashed red;
    }
  </style>
</body>
</html>',
2),

('css-layout', 'Flexbox',
'<h2>Flexbox en CSS</h2>
<p>Flexbox facilita el diseño de interfaces.</p>
<h2>Ejemplo de Flexbox</h2>
<pre><code>.container {
  display: flex;
}</code></pre>',
'Alinea dos divs horizontalmente con Flexbox.',
'<!DOCTYPE html>
<html>
<head>
  <title>Flexbox</title>
</head>
<body>
  <div class="container">
    <div>1</div>
    <div>2</div>
  </div>
  <style>
    /* Añade el estilo aquí */
  </style>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Flexbox</title>
</head>
<body>
  <div class="container">
    <div>1</div>
    <div>2</div>
  </div>
  <style>
    .container {
      display: flex;
    }
  </style>
</body>
</html>',
1),

('css-layout', 'Grid Layout',
'<h2>Grid Layout en CSS</h2>
<p>CSS Grid permite crear diseños complejos de manera sencilla.</p>
<h2>Ejemplo de Grid Layout</h2>
<pre><code>.container {
  display: grid;
  grid-template-columns: auto auto;
}</code></pre>',
'Crea un diseño de cuadrícula con dos columnas.',
'<!DOCTYPE html>
<html>
<head>
  <title>Grid Layout</title>
</head>
<body>
  <div class="container">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
  </div>
  <style>
    /* Añade el estilo aquí */
  </style>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Grid Layout</title>
</head>
<body>
  <div class="container">
    <div>1</div>
    <div>2</div>
    <div>3</div>
    <div>4</div>
  </div>
  <style>
    .container {
      display: grid;
      grid-template-columns: auto auto;
    }
  </style>
</body>
</html>',
2),

('css-responsive', 'Media Queries',
'<h2>Media Queries en CSS</h2>
<p>Permiten adaptar estilos a distintos tamaños de pantalla.</p>
<h2>Ejemplo de Media Query</h2>
<pre><code>@media (max-width: 600px) {
  body {
    background: lightblue;
  }
}</code></pre>',
'Cambia el color de fondo en pantallas pequeñas.',
'<!DOCTYPE html>
<html>
<head>
  <title>Media Queries</title>
  <style>
    /* Añade el estilo aquí */
  </style>
</head>
<body>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Media Queries</title>
  <style>
    @media (max-width: 600px) {
      body {
        background: lightblue;
      }
    }
  </style>
</head>
<body>
</body>
</html>',
1),

('css-responsive', 'Diseño Adaptativo',
'<h2>Diseño Adaptativo en CSS</h2>
<p>Adapta el diseño de tu sitio web a diferentes dispositivos.</p>
<h2>Ejemplo de diseño adaptativo</h2>
<pre><code>@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}</code></pre>',
'Cambia la dirección de un contenedor flexible en pantallas grandes.',
'<!DOCTYPE html>
<html>
<head>
  <title>Diseño Adaptativo</title>
  <style>
    .container {
      display: flex;
      flex-direction: column;
    }
    /* Añade el estilo aquí */
  </style>
</head>
<body>
  <div class="container">
    <div>1</div>
    <div>2</div>
  </div>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Diseño Adaptativo</title>
  <style>
    .container {
      display: flex;
      flex-direction: column;
    }
    @media (min-width: 768px) {
      .container {
        flex-direction: row;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div>1</div>
    <div>2</div>
  </div>
</body>
</html>',
2),

-- Lecciones para JavaScript
('js-intro', 'Variables en JS',
'<h2>Variables en JavaScript</h2>
<p>Puedes declarar variables con <code>let</code>, <code>const</code> o <code>var</code>.</p>
<h2>Ejemplo de declaración de variable</h2>
<pre><code>let nombre = "TuNombre";</code></pre>',
'Declara una variable llamada nombre y asígnale tu nombre.',
'<!DOCTYPE html>
<html>
<head>
  <title>Variables en JS</title>
</head>
<body>
  <script>
    // Declara la variable aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Variables en JS</title>
</head>
<body>
  <script>
    let nombre = "TuNombre";
  </script>
</body>
</html>',
1),

('js-functions', 'Funciones',
'<h2>Funciones en JavaScript</h2>
<p>Una función es un bloque reutilizable de código.</p>
<h2>Ejemplo de función</h2>
<pre><code>function sumar(a, b) {
  return a + b;
}</code></pre>',
'Crea una función que sume dos números.',
'<!DOCTYPE html>
<html>
<head>
  <title>Funciones</title>
</head>
<body>
  <script>
    // Crea la función aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Funciones</title>
</head>
<body>
  <script>
    function sumar(a, b) {
      return a + b;
    }
  </script>
</body>
</html>',
1),

('js-functions', 'Funciones Flecha',
'<h2>Funciones Flecha en JavaScript</h2>
<p>Las funciones flecha son una sintaxis más corta para escribir funciones.</p>
<h2>Ejemplo de función flecha</h2>
<pre><code>const sumar = (a, b) => a + b;</code></pre>',
'Crea una función flecha que sume dos números.',
'<!DOCTYPE html>
<html>
<head>
  <title>Funciones Flecha</title>
</head>
<body>
  <script>
    // Crea la función flecha aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Funciones Flecha</title>
</head>
<body>
  <script>
    const sumar = (a, b) => a + b;
  </script>
</body>
</html>',
2),

('js-dom', 'DOM Manipulation',
'<h2>Manipulación del DOM</h2>
<p>Puedes acceder y modificar el DOM con JavaScript.</p>
<h2>Ejemplo de manipulación del DOM</h2>
<pre><code>document.getElementById("demo").textContent = "Nuevo texto";</code></pre>',
'Cambia el texto de un elemento con id "demo".',
'<!DOCTYPE html>
<html>
<head>
  <title>DOM Manipulation</title>
</head>
<body>
  <p id="demo">Texto</p>
  <script>
    // Cambia el texto aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>DOM Manipulation</title>
</head>
<body>
  <p id="demo">Texto</p>
  <script>
    document.getElementById("demo").textContent = "Nuevo texto";
  </script>
</body>
</html>',
1),

('js-dom', 'Eventos en el DOM',
'<h2>Eventos en el DOM</h2>
<p>Puedes manejar eventos como clics, teclas presionadas, etc.</p>
<h2>Ejemplo de manejo de eventos</h2>
<pre><code>document.getElementById("boton").addEventListener("click", function() {
  alert("Botón clickeado");
});</code></pre>',
'Agrega un evento de clic a un botón.',
'<!DOCTYPE html>
<html>
<head>
  <title>Eventos en el DOM</title>
</head>
<body>
  <button id="boton">Haz clic</button>
  <script>
    // Agrega el evento aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Eventos en el DOM</title>
</head>
<body>
  <button id="boton">Haz clic</button>
  <script>
    document.getElementById("boton").addEventListener("click", function() {
      alert("Botón clickeado");
    });
  </script>
</body>
</html>',
2),

('js-async', 'Promesas y async/await',
'<h2>Promesas y async/await</h2>
<p>Permiten manejar operaciones asíncronas.</p>
<h2>Ejemplo de función async</h2>
<pre><code>async function esperar() {
  await new Promise(r => setTimeout(r, 1000));
}</code></pre>',
'Crea una función async que espere 1 segundo.',
'<!DOCTYPE html>
<html>
<head>
  <title>Promesas y async/await</title>
</head>
<body>
  <script>
    // Crea la función aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Promesas y async/await</title>
</head>
<body>
  <script>
    async function esperar() {
      await new Promise(r => setTimeout(r, 1000));
    }
  </script>
</body>
</html>',
1),

('js-async', 'Fetch API',
'<h2>Fetch API en JavaScript</h2>
<p>Permite realizar solicitudes de red y manejar las respuestas.</p>
<h2>Ejemplo de uso de Fetch API</h2>
<pre><code>fetch("https://api.ejemplo.com/datos")
  .then(response => response.json())
  .then(data => console.log(data));</code></pre>',
'Realiza una solicitud de red usando Fetch API.',
'<!DOCTYPE html>
<html>
<head>
  <title>Fetch API</title>
</head>
<body>
  <script>
    // Realiza la solicitud aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Fetch API</title>
</head>
<body>
  <script>
    fetch("https://api.ejemplo.com/datos")
      .then(response => response.json())
      .then(data => console.log(data));
  </script>
</body>
</html>',
2),

-- Lecciones para Python
('py-intro', 'Variables en Python',
'<h2>Variables en Python</h2>
<p>Se declaran sin tipo explícito.</p>
<h2>Ejemplo de declaración de variable</h2>
<pre><code>nombre = "TuNombre"</code></pre>',
'Declara una variable llamada nombre.',
'<!DOCTYPE html>
<html>
<head>
  <title>Variables en Python</title>
</head>
<body>
  <script>
    // Declara la variable aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Variables en Python</title>
</head>
<body>
  <script>
    nombre = "TuNombre"
  </script>
</body>
</html>',
1),

('py-control-flow', 'Condicionales y bucles',
'<h2>Condicionales y bucles en Python</h2>
<p>Usamos <code>if</code>, <code>else</code>, <code>for</code>, <code>while</code>.</p>
<h2>Ejemplo de bucle for</h2>
<pre><code>for i in range(1, 6):
  print(i)</code></pre>',
'Imprime los números del 1 al 5.',
'<!DOCTYPE html>
<html>
<head>
  <title>Condicionales y bucles</title>
</head>
<body>
  <script>
    // Imprime los números aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Condicionales y bucles</title>
</head>
<body>
  <script>
    for i in range(1, 6):
      print(i)
  </script>
</body>
</html>',
1),

('py-control-flow', 'Condicionales',
'<h2>Condicionales en Python</h2>
<p>Usamos <code>if</code>, <code>elif</code>, y <code>else</code> para controlar el flujo del programa.</p>
<h2>Ejemplo de condicionales</h2>
<pre><code>edad = 18
if edad >= 18:
  print("Eres mayor de edad")
else:
  print("Eres menor de edad")</code></pre>',
'Escribe un programa que verifique si una persona es mayor de edad.',
'<!DOCTYPE html>
<html>
<head>
  <title>Condicionales</title>
</head>
<body>
  <script>
    // Escribe el programa aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Condicionales</title>
</head>
<body>
  <script>
    edad = 18
    if edad >= 18:
      print("Eres mayor de edad")
    else:
      print("Eres menor de edad")
  </script>
</body>
</html>',
2),

('py-functions', 'Definición de funciones',
'<h2>Definición de funciones en Python</h2>
<p>Se usa la palabra clave <code>def</code>.</p>
<h2>Ejemplo de función</h2>
<pre><code>def multiplicar(a, b):
  return a * b</code></pre>',
'Crea una función que multiplique dos números.',
'<!DOCTYPE html>
<html>
<head>
  <title>Definición de funciones</title>
</head>
<body>
  <script>
    // Crea la función aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Definición de funciones</title>
</head>
<body>
  <script>
    def multiplicar(a, b):
      return a * b
  </script>
</body>
</html>',
1),

('py-functions', 'Argumentos y parámetros',
'<h2>Argumentos y parámetros en funciones</h2>
<p>Puedes pasar argumentos a las funciones y usar parámetros por defecto.</p>
<h2>Ejemplo de argumentos y parámetros</h2>
<pre><code>def saludar(nombre, saludo="Hola"):
  print(f"{saludo}, {nombre}!")</code></pre>',
'Crea una función que salude a una persona con un mensaje personalizado.',
'<!DOCTYPE html>
<html>
<head>
  <title>Argumentos y parámetros</title>
</head>
<body>
  <script>
    // Crea la función aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Argumentos y parámetros</title>
</head>
<body>
  <script>
    def saludar(nombre, saludo="Hola"):
      print(f"{saludo}, {nombre}!")
  </script>
</body>
</html>',
2),

('py-modules', 'Importar módulos',
'<h2>Importar módulos en Python</h2>
<p>Puedes usar <code>import</code> para reutilizar código.</p>
<h2>Ejemplo de importación de módulo</h2>
<pre><code>import math
print(math.sqrt(9))</code></pre>',
'Importa el módulo math y usa sqrt.',
'<!DOCTYPE html>
<html>
<head>
  <title>Importar módulos</title>
</head>
<body>
  <script>
    // Importa el módulo y usa sqrt aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Importar módulos</title>
</head>
<body>
  <script>
    import math
    print(math.sqrt(9))
  </script>
</body>
</html>',
1),

('py-modules', 'Crear un módulo',
'<h2>Crear un módulo en Python</h2>
<p>Puedes crear tus propios módulos para organizar el código.</p>
<h2>Ejemplo de creación de un módulo</h2>
<pre><code># mi_modulo.py
def saludar():
  print("Hola desde mi_modulo")</code></pre>',
'Crea un módulo llamado mi_modulo.py con una función saludar.',
'<!DOCTYPE html>
<html>
<head>
  <title>Crear un módulo</title>
</head>
<body>
  <script>
    # Crea el módulo aquí
  </script>
</body>
</html>',
'<!DOCTYPE html>
<html>
<head>
  <title>Crear un módulo</title>
</head>
<body>
  <script>
    # mi_modulo.py
    def saludar():
      print("Hola desde mi_modulo")
  </script>
</body>
</html>',
2);

-- Progreso de usuario (para el usuario ejemplo)
INSERT INTO user_progress (user_id, module_id, completed, completion_date) VALUES
(1, 'html-intro', TRUE, NOW()),
(1, 'css-intro', TRUE, NOW());

-- Intentos de ejercicios
INSERT INTO exercise_attempts (user_id, lesson_id, code_submitted, is_correct, attempt_date) VALUES
(1, 1, '<!DOCTYPE html>
<html>
<head>
  <title>Mi primera página</title>
</head>
<body>
  <h1>Bienvenido a HTML</h1>
  <p>Este es mi primer párrafo en HTML.</p>
</body>
</html>', TRUE, NOW() - INTERVAL 2 DAY),
(1, 2, '<!DOCTYPE html>
<html>
<head>
  <title>Elementos de texto</title>
</head>
<body>
  <h1>Encabezado Principal</h1>
  <p>Este es un párrafo normal.</p>
  <h2>Encabezado Secundario</h2>
  <p>Este texto tiene <strong>palabras en negrita</strong> y <em>palabras en cursiva</em>.</p>
</body>
</html>', TRUE, NOW() - INTERVAL 1 DAY);
