"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

// Definimos los tipos para nuestros clientes
export interface Customer {
  id: string;
  name: string;
  orderId: string;
  distance: number;
  eta: string;
  latitude: number;
  longitude: number;
}

interface DeliveryMapProps {
  customers: Customer[];
  restaurantLocation?: [number, number]; // [lat, lng]
}

// Importar los componentes de Leaflet de forma dinámica para evitar errores de SSR
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-100 flex items-center justify-center">
      <div className="text-gray-500 text-center">
        <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-500 opacity-50" />
        <p className="text-lg font-medium">Cargando mapa...</p>
      </div>
    </div>
  ),
});

const DeliveryMap: React.FC<DeliveryMapProps> = ({
  customers,
  restaurantLocation = [4.675, -74.055], // Ubicación predeterminada para Bogotá
}) => {
  return (
    <div className="h-full w-full relative">
      <LeafletMap 
        customers={customers} 
        restaurantLocation={restaurantLocation} 
      />
    </div>
  );
};

export default DeliveryMap;
