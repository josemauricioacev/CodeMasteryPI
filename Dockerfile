# Usar una imagen base oficial de Node
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y lock
COPY package*.json ./

# Instalar dependencias ignorando conflictos de peer deps
RUN npm install --legacy-peer-deps

# Copiar el resto del proyecto
COPY . .

# Omitimos la build en esta etapa (ya que MySQL aún no está listo)
# RUN npm run build

# Exponer el puerto estándar de Next.js
EXPOSE 3000

# Arrancamos en modo desarrollo para evitar que se caiga el build por falta de DB
CMD ["npm", "run", "dev"]
