import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

// Función para calcular la distancia entre dos puntos geográficos (usando la fórmula de Haversine)
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371e3; // Radio de la tierra en metros
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distancia en metros
}

// Función para determinar el anillo de proximidad basado en la distancia
export function getProximityRing(distanceInMeters: number): number {
  if (distanceInMeters <= 100) return 0; // Muy cerca (verde)
  if (distanceInMeters <= 500) return 1; // Cercano (amarillo)
  return 2; // Lejos (rojo)
}

// Función para generar un número de pedido único
export function generateOrderNumber(): string {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `HB-${timestamp}${random}`;
}

// Función para estimar el tiempo de llegada basado en la distancia
export function estimateArrivalTime(distanceInMeters: number): Date {
  // Asumimos una velocidad promedio de 30 km/h (8.33 m/s)
  const speed = 8.33;
  const secondsToArrive = distanceInMeters / speed;
  
  const arrivalTime = new Date();
  arrivalTime.setSeconds(arrivalTime.getSeconds() + secondsToArrive);
  
  return arrivalTime;
}
