// Tipos compartidos para los componentes de mapas
export interface Customer {
  id: string;
  name: string;
  orderId: string;
  distance: number;
  eta: string;
  latitude: number;
  longitude: number;
}

export interface MapProps {
  customers?: Customer[];
  restaurantLocation?: [number, number]; // [lat, lng]
}
