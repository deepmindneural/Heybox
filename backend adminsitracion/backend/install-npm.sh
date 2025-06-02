#!/bin/bash
# Script para instalar npm en macOS sin depender de Homebrew

echo "Instalando npm para Node.js v18.16.0..."

# Crear directorio temporal
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# Descargar el instalador de npm
curl -L -o npm.zip https://github.com/npm/cli/archive/refs/tags/v9.8.1.zip

# Descomprimir
unzip npm.zip
cd cli-9.8.1

# Instalar usando Node.js
node ./bin/npm-cli.js install -g npm

echo "npm debería estar instalado ahora. Verifica con 'npm -v'"
echo "Si la instalación falla, considera reinstalar Node.js que normalmente incluye npm"
