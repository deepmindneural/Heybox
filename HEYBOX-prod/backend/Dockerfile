FROM node:18-alpine

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto del código
COPY . .

# Crear directorio para datos si se usa SQLite para desarrollo/testing
RUN mkdir -p /app/data

# Exponer el puerto
EXPOSE 5001

# Comando para iniciar el servidor
CMD ["node", "server.js"]
