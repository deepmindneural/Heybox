// Script para iniciar Next.js sin depender de npm
const { spawn } = require('child_process');
const path = require('path');

// Obtener la ruta a next
const nextBinPath = path.resolve(__dirname, 'node_modules', '.bin', 'next');

console.log('Intentando iniciar Next.js en modo desarrollo...');
console.log('Ruta de Next.js:', nextBinPath);

try {
  // Iniciar Next.js directamente
  const nextProcess = spawn('node', [nextBinPath, 'dev'], {
    stdio: 'inherit',
    shell: true
  });

  nextProcess.on('error', (err) => {
    console.error('Error al iniciar Next.js:', err);
  });

  nextProcess.on('close', (code) => {
    console.log(`Next.js se cerró con código: ${code}`);
  });
} catch (error) {
  console.error('Error al iniciar el servidor:', error);
}
