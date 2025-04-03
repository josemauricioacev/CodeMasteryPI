# Usar una imagen base oficial de Node
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar todo el proyecto
COPY . .

# Compilar la app Next.js
RUN npm run build

# Exponer el puerto estándar
EXPOSE 3000

# Iniciar en modo producción
CMD ["npm", "start"]
