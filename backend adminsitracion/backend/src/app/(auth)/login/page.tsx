"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ChefHat, ShieldCheck, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Usuarios demo para probar el sistema
const demoUsers = [
  {
    email: "admin@heybox.co",
    password: "admin123",
    role: "admin",
    name: "Administrador General",
    description: "Acceso a todos los restaurantes y módulos de pagos"
  },
  {
    email: "burger@heybox.co",
    password: "rest123",
    role: "restaurant",
    name: "Burger Deluxe",
    description: "Administrador del restaurante Burger Deluxe"
  },
  {
    email: "pizza@heybox.co",
    password: "rest123",
    role: "restaurant",
    name: "Pizza Heaven",
    description: "Administrador del restaurante Pizza Heaven"
  }
]

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showDemoUsers, setShowDemoUsers] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validación básica de credenciales contra usuarios demo
      const user = demoUsers.find(
        u => u.email === email && u.password === password
      )
      
      // Simulamos un pequeño delay para el efecto de carga
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (user) {
        // Guardar el email en localStorage para identificar el restaurante en el dashboard
        localStorage.setItem('userEmail', user.email)
        localStorage.setItem('userName', user.name)
        localStorage.setItem('userRole', user.role)
        
        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido(a) ${user.name}`,
          variant: "default"
        })
        
        // Redirigir según el rol
        if (user.role === "admin") {
          router.push("/admin/dashboard")
        } else {
          router.push("/restaurant/dashboard")
        }
      } else {
        toast({
          title: "Error de autenticación",
          description: "Credenciales incorrectas. Intenta nuevamente.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error de inicio de sesión", error)
      toast({
        title: "Error de inicio de sesión",
        description: "Ocurrió un error al procesar tu solicitud",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDemoLogin = (demoUser: typeof demoUsers[0]) => {
    setEmail(demoUser.email)
    setPassword(demoUser.password)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Panel lateral con imagen y degradado */}
      <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-heybox-primary to-heybox-secondary">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10 p-8">
          <h1 className="text-4xl font-bold mb-4">HeyBox Admin</h1>
          <p className="text-xl max-w-md text-center mb-8">
            Plataforma de administración para restaurantes y delivery
          </p>
          <div className="grid grid-cols-1 gap-4 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <h3 className="font-medium text-lg mb-2">Gestión completa</h3>
              <p className="text-white/80">Administra pedidos, menús y seguimiento en tiempo real</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
              <h3 className="font-medium text-lg mb-2">Métricas y analíticas</h3>
              <p className="text-white/80">Visualiza el rendimiento de tu negocio con datos actualizados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de login */}
      <div className="flex flex-col justify-center p-8 md:p-14 w-full md:w-1/2 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-600">
              Accede al panel de administración de HeyBox
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-heybox-primary focus:border-heybox-primary sm:text-sm"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-heybox-primary focus:border-heybox-primary sm:text-sm pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-heybox-primary focus:ring-heybox-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-heybox-primary hover:text-heybox-secondary">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-heybox-primary to-heybox-secondary hover:from-heybox-primary/90 hover:to-heybox-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-heybox-primary transition-all duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          {/* Sección para usuarios demo */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Accesos de demostración</h3>
              <button 
                type="button" 
                onClick={() => setShowDemoUsers(!showDemoUsers)}
                className="text-xs text-heybox-primary hover:text-heybox-secondary flex items-center"
              >
                {showDemoUsers ? "Ocultar usuarios" : "Mostrar usuarios"}
                <ArrowRight className="h-3 w-3 ml-1" />
              </button>
            </div>
            
            {showDemoUsers && (
              <div className="space-y-3">
                {demoUsers.map((user, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-heybox-primary/50 hover:bg-heybox-primary/5 transition-colors cursor-pointer"
                    onClick={() => handleDemoLogin(user)}
                  >
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-heybox-primary/10 text-heybox-primary mr-3">
                        {user.role === "admin" ? <ShieldCheck className="h-5 w-5" /> : <ChefHat className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <div className="flex items-center mt-1">
                          <p className="text-xs text-gray-500 mr-2">{user.email}</p>
                          <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                            {user.role === "admin" ? "Admin" : "Restaurante"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
