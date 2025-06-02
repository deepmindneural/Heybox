"use client"

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

// Importar el componente Leaflet dinámicamente para evitar problemas de SSR
const DynamicMap = dynamic(() => import('./LeafletMap'), {
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

export default DynamicMap;
