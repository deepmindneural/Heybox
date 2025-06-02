"use client"

import React, { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Definimos los tipos para nuestros clientes
interface Customer {
  id: string;
  name: string;
  orderId: string;
  distance: number;
  eta: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  customers: Customer[];
  restaurantLocation: [number, number]; // [lat, lng]
}

// Función para crear iconos personalizados con diferentes colores
const createIcon = (color: string, size: [number, number] = [25, 41]) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: size,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Componente para el icono del restaurante
const RestaurantIcon = createIcon('blue', [35, 45]);

// Iconos para los clientes según su distancia
const getNearbyIcon = (distance: number) => {
  if (distance <= 100) return createIcon('green');
  if (distance <= 500) return createIcon('orange');
  return createIcon('red');
};

// Componente para fijar la vista del mapa
const SetViewOnLoad = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 14);
  }, [center, map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ customers, restaurantLocation }) => {
  // Corregimos el problema de los iconos de Leaflet en Next.js
  useEffect(() => {
    // Soluciona el problema de los iconos en Leaflet con Next.js
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  return (
    <MapContainer 
      style={{ height: '100%', width: '100%', minHeight: '380px', zIndex: 5 }}
      zoom={14}
      center={restaurantLocation}
      scrollWheelZoom={false}
    >
      <SetViewOnLoad center={restaurantLocation} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Marcador del restaurante */}
      <Marker position={restaurantLocation} icon={RestaurantIcon}>
        <Popup>
          <div className="text-center">
            <strong>Tu Restaurante</strong>
            <p>Ubicación principal</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Marcadores de clientes */}
      {customers.map((customer) => (
        <Marker
          key={customer.id}
          position={[customer.latitude, customer.longitude]}
          icon={getNearbyIcon(customer.distance)}
        >
          <Popup>
            <div>
              <strong>{customer.name}</strong>
              <p>Pedido: {customer.orderId}</p>
              <p>Distancia: {customer.distance}m</p>
              <p>ETA: {customer.eta}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
