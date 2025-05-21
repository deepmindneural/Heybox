import React, { useState } from 'react';
import { FaStar, FaRegStar, FaUser, FaCheck, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { format, formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';

interface Review {
  _id: string;
  usuario: {
    nombre: string;
    apellido?: string;
    imagen?: string;
  };
  calificacion: number;
  comentario: string;
  fecha: string;
  respuesta?: {
    texto: string;
    fecha: string;
  };
}

interface RestaurantReviewsProps {
  restaurantId: string;
  reviews: Review[];
  promedioCalificacion: number;
  totalReviews: number;
  onAddReview: (calificacion: number, comentario: string) => Promise<void>;
  onlyShowReviews?: boolean;
}

const RestaurantReviews: React.FC<RestaurantReviewsProps> = ({
  restaurantId,
  reviews,
  promedioCalificacion,
  totalReviews,
  onAddReview,
  onlyShowReviews = false
}) => {
  const { isAuthenticated, usuario } = useAuth();
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para dejar una reseña');
      return;
    }
    
    if (rating < 1) {
      setError('Por favor, selecciona al menos una estrella');
      return;
    }
    
    if (!comment.trim()) {
      setError('Por favor, escribe un comentario');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await onAddReview(rating, comment);
      
      setSuccess(true);
      setComment('');
      setRating(5);
      
      // Ocultar formulario después de enviar
      setTimeout(() => {
        setShowAddReview(false);
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcular distribución de las estrellas
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(review => Math.round(review.calificacion) === stars).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Opiniones y Calificaciones</h2>
      
      {/* Resumen de calificaciones */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center">
        <div className="md:w-1/3 flex flex-col items-center mb-4 md:mb-0">
          <div className="text-5xl font-bold text-gray-900">{promedioCalificacion.toFixed(1)}</div>
          <div className="flex my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`h-5 w-5 ${
                  star <= promedioCalificacion ? 'text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{totalReviews} calificaciones</div>
        </div>
        
        <div className="md:w-2/3 space-y-2">
          {ratingDistribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center">
              <div className="w-16 flex justify-end mr-2">
                <span className="text-sm text-gray-600">{stars} estrellas</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="w-10 text-sm text-gray-600 ml-2">{count}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botón para agregar reseña */}
      {!onlyShowReviews && isAuthenticated && !showAddReview && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddReview(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Escribir una reseña
          </button>
        </div>
      )}
      
      {/* Formulario para agregar reseña */}
      {showAddReview && (
        <div className="mb-6 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Escribe tu reseña</h3>
          
          {success ? (
            <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
              ¡Gracias por tu reseña! Ha sido enviada correctamente.
            </div>
          ) : (
            <form onSubmit={handleSubmitReview}>
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tu calificación
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      {star <= (hoverRating || rating) ? (
                        <FaStar className="h-8 w-8 text-yellow-400" />
                      ) : (
                        <FaRegStar className="h-8 w-8 text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Tu comentario
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  placeholder="Comparte tu experiencia en el restaurante..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddReview(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {/* Lista de reseñas */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {review.usuario.imagen ? (
                    <img
                      src={review.usuario.imagen}
                      alt={review.usuario.nombre}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/40?text=U';
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {review.usuario.nombre.charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.usuario.nombre} {review.usuario.apellido}
                      </h4>
                      <div className="flex items-center mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.calificacion ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          <FaClock className="inline mr-1" />
                          {format(new Date(review.fecha), "d 'de' MMMM, yyyy", { locale: es })}
                        </span>
                      </div>
                    </div>
                    
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Verificado <FaCheck className="inline ml-1" />
                    </span>
                  </div>
                  
                  <p className="mt-2 text-gray-700">{review.comentario}</p>
                  
                  {/* Respuesta del restaurante */}
                  {review.respuesta && (
                    <div className="mt-3 bg-gray-50 p-3 rounded-md">
                      <p className="text-sm font-medium text-gray-900">Respuesta del restaurante</p>
                      <p className="text-sm text-gray-700 mt-1">{review.respuesta.texto}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistance(new Date(review.respuesta.fecha), new Date(), { 
                          addSuffix: true,
                          locale: es 
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">Aún no hay reseñas para este restaurante.</p>
            {!onlyShowReviews && (
              <p className="text-gray-500 mt-1">
                ¡Sé el primero en compartir tu experiencia!
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Paginación (si hay muchas reseñas) */}
      {totalReviews > 5 && (
        <div className="mt-6 flex justify-center">
          <nav className="inline-flex rounded-md shadow">
            <button className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 border-t border-b border-gray-300 bg-blue-50 text-blue-600 font-medium">
              1
            </button>
            <button className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              Siguiente
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default RestaurantReviews;
