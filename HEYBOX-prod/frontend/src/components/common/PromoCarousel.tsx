import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaTag, FaPercent } from 'react-icons/fa';

interface Promo {
  id: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  tipoPromo: 'descuento' | 'oferta' | 'envio_gratis' | 'creditos';
  valorDescuento?: number;
  codigoPromo?: string;
  restauranteId?: string;
  fechaInicio: string;
  fechaFin: string;
  enlace?: string;
}

interface PromoCarouselProps {
  promos: Promo[];
  autoPlay?: boolean;
  interval?: number;
  showIndicators?: boolean;
}

const PromoCarousel: React.FC<PromoCarouselProps> = ({
  promos,
  autoPlay = true,
  interval = 5000,
  showIndicators = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === promos.length - 1 ? 0 : prevIndex + 1));
    
    // Resetear la transición después de un breve periodo
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? promos.length - 1 : prevIndex - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  // Gestionar autoplay
  useEffect(() => {
    if (!autoPlay) return;
    
    const play = () => {
      autoPlayRef.current = setTimeout(() => {
        nextSlide();
      }, interval);
    };
    
    play();
    
    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current);
      }
    };
  }, [autoPlay, interval, currentIndex, isTransitioning]);

  // Pausar autoplay en hover
  const pauseAutoPlay = () => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }
  };

  const resumeAutoPlay = () => {
    if (autoPlay && autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
      autoPlayRef.current = setTimeout(() => {
        nextSlide();
      }, interval);
    }
  };

  // Renderizar tipo de promoción
  const renderPromoType = (promo: Promo) => {
    switch (promo.tipoPromo) {
      case 'descuento':
        return (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
            <FaPercent className="mr-1" />
            {promo.valorDescuento}% DESCUENTO
          </div>
        );
      case 'envio_gratis':
        return (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            ENVÍO GRATIS
          </div>
        );
      case 'creditos':
        return (
          <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
            <FaTag className="mr-1" />
            CRÉDITOS EXTRA
          </div>
        );
      default:
        return (
          <div className="absolute top-4 left-4 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            OFERTA ESPECIAL
          </div>
        );
    }
  };

  if (!promos.length) {
    return null;
  }

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl shadow-lg"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out h-[200px] md:h-[300px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {promos.map((promo) => (
          <div key={promo.id} className="w-full flex-shrink-0 relative">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${promo.imagen})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80"></div>
            </div>
            
            {renderPromoType(promo)}
            
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">{promo.titulo}</h3>
              <p className="text-sm md:text-base mb-4 line-clamp-2">{promo.descripcion}</p>
              
              {promo.codigoPromo && (
                <div className="mb-3">
                  <span className="bg-white text-gray-800 px-3 py-1 rounded-md font-mono font-bold">
                    {promo.codigoPromo}
                  </span>
                </div>
              )}
              
              {promo.enlace && (
                <Link 
                  to={promo.enlace} 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
                >
                  Aprovechar
                </Link>
              )}
              
              <div className="text-xs mt-2 opacity-75">
                Válido hasta: {new Date(promo.fechaFin).toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Controles de navegación */}
      {promos.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity focus:outline-none"
            aria-label="Anterior"
          >
            <FaChevronLeft />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity focus:outline-none"
            aria-label="Siguiente"
          >
            <FaChevronRight />
          </button>
        </>
      )}
      
      {/* Indicadores */}
      {showIndicators && promos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {promos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-4' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromoCarousel;
