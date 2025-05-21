#!/bin/bash

# Script de despliegue para HEYBOX-prod
# Este script prepara y construye la aplicación para producción

echo "=== Iniciando despliegue de HEYBOX ==="

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "Error: Docker no está instalado. Por favor, instálalo primero."
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose no está instalado. Por favor, instálalo primero."
    exit 1
fi

echo "=== Preparando entorno ==="

# Crear directorio SSL si no existe
mkdir -p ssl

# Verificar si hay certificados SSL, si no, generar autofirmados para desarrollo
if [ ! -f "./ssl/heybox.crt" ] || [ ! -f "./ssl/heybox.key" ]; then
    echo "Generando certificados SSL autofirmados para desarrollo..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ssl/heybox.key -out ./ssl/heybox.crt -subj "/CN=heybox.domain.com"
fi

# Crear archivo .env global si no existe
if [ ! -f "./.env" ]; then
    echo "Creando archivo .env global..."
    cat > ./.env << EOL
MONGO_URI=mongodb://mongo:27017/heybox
MONGO_USERNAME=admin
MONGO_PASSWORD=secretpassword
JWT_SECRET=your_jwt_secret_key_here
EOL
fi

echo "=== Construyendo la aplicación ==="

# Construir las imágenes Docker
docker-compose build

echo "=== Iniciando servicios ==="

# Iniciar los servicios
docker-compose up -d

echo "=== Despliegue completado ==="
echo "Frontend: https://localhost"
echo "Backend API: http://localhost:5001/api"
echo "MongoDB: mongodb://localhost:27017"

echo "=== Registros (logs) ==="
echo "Para ver los registros, ejecuta: docker-compose logs -f"
