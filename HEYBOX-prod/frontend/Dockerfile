# Etapa de construcción
FROM node:18-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código
COPY . .

# Construir la aplicación para producción
RUN npm run build:prod

# Etapa de producción
FROM nginx:stable-alpine

# Copiar la configuración personalizada de nginx
# (Se monta en docker-compose.yml desde el directorio raíz)

# Copiar los archivos de compilación desde la etapa de construcción
COPY --from=build /app/build /usr/share/nginx/html

# Exponer los puertos para HTTP y HTTPS
EXPOSE 80
EXPOSE 443

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
