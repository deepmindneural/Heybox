"use client"

import React, { useEffect } from 'react';
import { Customer, MapProps } from '@/types/map-types';
import 'leaflet/dist/leaflet.css';

const LeafletMap: React.FC<MapProps> = ({ customers = [], restaurantLocation = [4.671, -74.055] }) => {
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

    // Agregar anillos de cobertura (radio en metros)
    const radiusColors = [
      { radius: 500, color: '#10b981', fillColor: '#10b98120', label: '500m - Entrega rápida' },  // Verde
      { radius: 1000, color: '#3b82f6', fillColor: '#3b82f620', label: '1km - Entrega estándar' },  // Azul
      { radius: 2000, color: '#f59e0b', fillColor: '#f59e0b10', label: '2km - Entrega extendida' },  // Naranja
    ];
    
    // Crear una capa de grupo para los círculos
    const radiusGroup = L.layerGroup().addTo(map);
    
    // Agregar los círculos de radio
    radiusColors.forEach(({ radius, color, fillColor, label }) => {
      L.circle(restaurantLocation, {
        radius: radius,
        color: color,
        fillColor: fillColor,
        fillOpacity: 0.5,
        weight: 2,
        dashArray: '5, 5',
      })
      .bindTooltip(label, { permanent: false, direction: 'center' })
      .addTo(radiusGroup);
    });
    
    // Agregar leyenda para los anillos
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
      
      div.innerHTML = '<h4 style="margin:0 0 5px 0;font-size:14px;border-bottom:1px solid #eee;padding-bottom:5px;">Zonas de cobertura</h4>';
      
      radiusColors.forEach(({ radius, color, label }) => {
        div.innerHTML += `
          <div style="display:flex;align-items:center;margin:5px 0;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-right:5px;"></span>
            <span style="font-size:12px;">${label}</span>
          </div>
        `;
      });
      
      return div;
    };
    legend.addTo(map);

    // Agregar marcador del restaurante
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
