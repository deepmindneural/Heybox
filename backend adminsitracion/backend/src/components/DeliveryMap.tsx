"use client"

import React from 'react';
import { Customer, MapProps } from '@/types/map-types';
import DynamicMap from './DynamicMap';

interface DeliveryMapProps extends MapProps {}

const DeliveryMap: React.FC<DeliveryMapProps> = ({
  customers = [],
  restaurantLocation = [4.675, -74.055], // Ubicación predeterminada para Bogotá
}) => {
  return (
    <div className="h-full w-full relative">
      <DynamicMap 
        customers={customers} 
        restaurantLocation={restaurantLocation} 
      />
    </div>
  );
};

export default DeliveryMap;
