"use client"

import React, { useEffect } from 'react';
import { Customer } from './DeliveryMap';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  customers: Customer[];
  restaurantLocation: [number, number]; // [lat, lng]
}

const LeafletMap: React.FC<LeafletMapProps> = ({ customers, restaurantLocation }) => {
  useEffect(() => {
    // Importar Leaflet dinámicamente para evitar problemas de SSR
    const L = require('leaflet');
    
    // Corregir el problema de los iconos en Leaflet con Next.js
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });

    // Función para crear iconos personalizados con diferentes colores
    const createIcon = (color: string) => {
      return new L.Icon({
        iconUrl: `/${color}-marker.png`,
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    };

    // Inicializar el mapa
    const mapContainer = document.getElementById('leafletmap');
    if (!mapContainer) return;
    
    // Limpiar cualquier mapa anterior
    mapContainer.innerHTML = "";
    
    const map = L.map(mapContainer).setView(restaurantLocation, 14);

    // Agregar capa de mapa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Agregar marcador del restaurante
    const restaurantIcon = new L.Icon({
      iconUrl: '/restaurant-marker.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconSize: [35, 45],
      iconAnchor: [17, 45],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker(restaurantLocation, { icon: restaurantIcon })
      .bindPopup(`
        <div class="text-center">
          <strong>Tu Restaurante</strong>
          <p>Ubicación principal</p>
        </div>
      `)
      .addTo(map);

    // Agregar marcadores de clientes
    customers.forEach(customer => {
      // Determinar el color del icono según la distancia
      let iconColor = 'red';
      if (customer.distance <= 100) iconColor = 'green';
      else if (customer.distance <= 500) iconColor = 'orange';
      
      const customerIcon = createIcon(iconColor);
      
      L.marker([customer.latitude, customer.longitude], { icon: customerIcon })
        .bindPopup(`
          <div>
            <strong>${customer.name}</strong>
            <p>Pedido: ${customer.orderId}</p>
            <p>Distancia: ${customer.distance}m</p>
            <p>ETA: ${customer.eta}</p>
          </div>
        `)
        .addTo(map);
    });

    // Limpiar el mapa cuando el componente se desmonte
    return () => {
      map.remove();
    };
  }, [customers, restaurantLocation]);

  return <div id="leafletmap" className="h-full w-full min-h-[380px]"></div>;
};

export default LeafletMap;
