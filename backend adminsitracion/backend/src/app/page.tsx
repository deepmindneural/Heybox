import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-heybox-light to-white">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-heybox-primary">HeyBox</span>
          <span className="text-sm bg-heybox-secondary text-white px-2 py-1 rounded-md">Admin</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-heybox-dark hover:text-heybox-primary transition-colors">
            Acerca de
          </Link>
          <Link href="/features" className="text-heybox-dark hover:text-heybox-primary transition-colors">
            Características
          </Link>
          <Link href="/contact" className="text-heybox-dark hover:text-heybox-primary transition-colors">
            Contacto
          </Link>
          <Link href="/login">
            <Button>Iniciar Sesión</Button>
          </Link>
        </nav>
        <Button variant="outline" size="icon" className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </header>

      <main className="flex-1 container mx-auto flex flex-col lg:flex-row items-center gap-12 py-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-heybox-dark">
            <span className="text-heybox-primary">Gestión</span> inteligente para restaurantes
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            Optimiza el servicio de pedidos y retiros con nuestra plataforma avanzada con geolocalización en tiempo real e inteligencia artificial.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Acceder al Panel <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Ver Demo
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="relative w-full aspect-video md:aspect-square rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-heybox-primary/20 to-heybox-secondary/20"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[80%] h-[80%] bg-white rounded-lg shadow-lg p-4">
                <div className="h-8 bg-gray-100 rounded-md mb-4 flex items-center px-3">
                  <div className="w-3 h-3 rounded-full bg-heybox-primary mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <div className="flex-1 text-center text-sm text-gray-400">HeyBox Dashboard</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-gray-100 rounded-md"></div>
                  <div className="h-20 bg-gray-100 rounded-md"></div>
                  <div className="h-20 bg-gray-100 rounded-md"></div>
                  <div className="h-20 bg-gray-100 rounded-md"></div>
                </div>
                <div className="mt-4 h-40 bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-heybox-primary/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-heybox-primary/40 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-heybox-primary/60 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-heybox-primary"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-heybox-light py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-heybox-dark mb-12">
            Características Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-heybox-primary/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-heybox-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-heybox-dark mb-2">Geolocalización en Tiempo Real</h3>
              <p className="text-gray-600">Seguimiento de clientes con anillos de proximidad para optimizar la entrega de pedidos.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-heybox-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-heybox-secondary">
                  <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                  <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                  <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-heybox-dark mb-2">Notificaciones Inteligentes</h3>
              <p className="text-gray-600">Sistema de alertas automatizadas para personal y clientes con actualizaciones de estado en tiempo real.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-heybox-primary/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-heybox-primary">
                  <path d="M12 2v8" />
                  <path d="m4.93 10.93 1.41 1.41" />
                  <path d="M2 18h2" />
                  <path d="M20 18h2" />
                  <path d="m19.07 10.93-1.41 1.41" />
                  <path d="M22 22H2" />
                  <path d="m16 6-4 4-4-4" />
                  <path d="M16 18a4 4 0 0 0-8 0" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-heybox-dark mb-2">Gestión de Pedidos Avanzada</h3>
              <p className="text-gray-600">Administración eficiente de pedidos con optimización basada en IA para reducir tiempos de espera.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-heybox-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-heybox-secondary">
                  <path d="M3 3v18h18" />
                  <path d="m7 17 4-4 4 4 6-6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-heybox-dark mb-2">Analítica Avanzada</h3>
              <p className="text-gray-600">Informes detallados y estadísticas para optimizar la operación y mejorar la experiencia del cliente.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-heybox-primary/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-heybox-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-heybox-dark mb-2">Seguridad Avanzada</h3>
              <p className="text-gray-600">Protección de datos con OAuth 2.0 y cifrado HTTPS para garantizar la privacidad de los usuarios.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-heybox-secondary/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-heybox-secondary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-heybox-dark mb-2">Multi-Restaurante</h3>
              <p className="text-gray-600">Plataforma diseñada para gestionar múltiples restaurantes con administración independiente para cada uno.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-heybox-dark text-white py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-heybox-primary">Hey</span>
                <span className="text-heybox-secondary">Box</span>
              </h3>
              <p className="text-gray-300 mb-4">
                La solución completa para la gestión de pedidos y retiros en restaurantes con tecnología de vanguardia.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Inicio</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Características</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Precios</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contáctanos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-heybox-primary">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="text-gray-300">+57 300 123 4567</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-heybox-secondary">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="text-gray-300">info@heybox.com</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-heybox-primary">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-gray-300">Bogotá, Colombia</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} HeyBox. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
