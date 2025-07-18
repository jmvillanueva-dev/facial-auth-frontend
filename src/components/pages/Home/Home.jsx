import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../../assets/img/logo.svg";

const Home = () => {
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-2">
                <img src={logo} className="w-8 h-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">
                  Face<span className=" text-indigo-600">Auth</span>
                </span>
              </div>

              <nav className="hidden md:flex space-x-8">
                <a
                  href="#features"
                  className="text-gray-700 hover:text-indigo-600 transition duration-150"
                >
                  Características
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-indigo-600 transition duration-150"
                >
                  Cómo funciona
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-indigo-600 transition duration-150"
                >
                  Precios
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-indigo-600 transition duration-150"
                >
                  Contacto
                </a>
              </nav>

              <div className="flex items-center space-x-4">
                <Link
                  to="/Auth"
                  className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                >
                  <FaUserCircle className="mr-2" />
                  Iniciar Sesión
                </Link>
                <button
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {isMenuOpen ? (
                      <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                      <path d="M3 12h18M3 6h18M3 18h18" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden pb-4">
                <div className="flex flex-col space-y-3 pt-2">
                  <a
                    href="#features"
                    className="text-gray-700 hover:text-indigo-600 transition duration-150 py-1"
                  >
                    Características
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-gray-700 hover:text-indigo-600 transition duration-150 py-1"
                  >
                    Cómo funciona
                  </a>
                  <a
                    href="#pricing"
                    className="text-gray-700 hover:text-indigo-600 transition duration-150 py-1"
                  >
                    Precios
                  </a>
                  <a
                    href="#contact"
                    className="text-gray-700 hover:text-indigo-600 transition duration-150 py-1"
                  >
                    Contacto
                  </a>
                  <Link
                    to="/Auth"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 mt-2"
                  >
                    <FaUserCircle className="mr-2" />
                    Iniciar Sesión
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-indigo-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                  Autenticación Facial Segura para tu Aplicación Web
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Ofrece a tus usuarios una forma rápida y segura de iniciar
                  sesión con su rostro. Integración sencilla con Django.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
                    Prueba Gratuita
                  </button>
                  <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-md shadow-sm border border-indigo-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
                    Ver Documentación
                  </button>
                </div>
              </div>
              <div className="order-1 md:order-2 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-xl transform rotate-2 scale-105">
                  <img
                    src="https://epe.brightspotcdn.com/dims4/default/3440acf/2147483647/strip/true/crop/1695x1150+13+0/resize/840x570!/quality/90/?url=https%3A%2F%2Fepe-brightspot.s3.us-east-1.amazonaws.com%2F53%2Fc9%2F8a96a2eb465e89e9d18fa364a671%2F102023-lead-image-facial-recognition-gt.jpg"
                    alt="Facial authentication interface"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <p className="mt-2 text-white font-medium">
                      Escaneando rostro...
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Características Principales
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Soluciones avanzadas para la autenticación biométrica en tu
                aplicación web
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-600"
                  >
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Reconocimiento Facial Avanzado
                </h3>
                <p className="text-gray-600">
                  Algoritmos de detección facial precisos y optimizados para
                  funcionar en diversos entornos y condiciones de luz.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-600"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Seguridad de Alto Nivel
                </h3>
                <p className="text-gray-600">
                  Encriptación de datos biométricos y protección contra intentos
                  de suplantación mediante técnicas de verificación en 3D.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-md transition duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-600"
                  >
                    <path d="M12 2v10" />
                    <path d="M12 22v-4" />
                    <path d="M4.93 4.93l3.54 3.54" />
                    <path d="M15.54 15.54l3.54 3.54" />
                    <path d="M2 12h20" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Integración Sencilla
                </h3>
                <p className="text-gray-600">
                  API RESTful bien documentada que se integra fácilmente con
                  Django y cualquier otro framework backend o frontend.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Cómo Funciona
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Un proceso simple y seguro para autenticar usuarios con su
                rostro
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div className="bg-white rounded-xl p-6 shadow-sm md:ml-8">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Registro Facial
                  </h3>
                  <p className="text-gray-600">
                    El usuario permite el acceso a la cámara y registra su
                    rostro capturando varias imágenes desde diferentes ángulos.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm md:mx-8">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Procesamiento Biométrico
                  </h3>
                  <p className="text-gray-600">
                    Se extraen las características faciales únicas y se
                    convierten en un modelo matemático encriptado para
                    almacenamiento seguro.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm md:mr-8">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Autenticación Rápida
                  </h3>
                  <p className="text-gray-600">
                    Durante el inicio de sesión, el sistema compara los datos
                    faciales en tiempo real con los datos registrados
                    previamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Lo que Dicen Nuestros Clientes
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Empresas que confían en nuestra tecnología de reconocimiento
                facial
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="font-semibold text-indigo-600">AC</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Ana Castro
                    </h4>
                    <p className="text-sm text-gray-500">CEO, TechStart</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.416 8.279-7.452-3.91-7.453 3.91 1.416-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">
                  "La integración del reconocimiento facial mejoró
                  significativamente la experiencia de nuestros usuarios. ¡Es
                  rápido, seguro y moderno!"
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="font-semibold text-indigo-600">JG</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Javier Gómez
                    </h4>
                    <p className="text-sm text-gray-500">CTO, FinSecure</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.416 8.279-7.452-3.91-7.453 3.91 1.416-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">
                  "Como solución de autenticación adicional, FaceAuth ofrece un
                  nivel de seguridad y comodidad que nuestros clientes valoran
                  mucho."
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="font-semibold text-indigo-600">LM</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Laura Martínez
                    </h4>
                    <p className="text-sm text-gray-500">
                      Desarrolladora, DevHub
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.416 8.279-7.452-3.91-7.453 3.91 1.416-8.279-6.064-5.828 8.332-1.151z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600">
                  "El soporte técnico es excelente y la documentación muy clara.
                  Implementé FaceAuth en mi proyecto Django en menos de un día."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Planes y Precios
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Elije el plan que mejor se ajusta a tus necesidades
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Tier */}
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-lg transition duration-300 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Gratis</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $0
                  </span>
                  <span className="text-gray-500">/mes</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Hasta 100 autenticaciones/mes
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Soporte por correo
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Sin integración empresarial
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Sin análisis detallado
                  </li>
                </ul>
                <button className="mt-auto w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150">
                  Empezar Gratis
                </button>
              </div>

              {/* Pro Tier */}
              <div className="bg-indigo-50 rounded-xl p-8 shadow-lg border-2 border-indigo-200 relative flex flex-col">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MÁS POPULAR
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Profesional
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">
                    $29
                  </span>
                  <span className="text-gray-500">/mes</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Hasta 10,000 autenticaciones/mes
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Soporte prioritario
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Análisis detallado de rendimiento
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Sin personalización avanzada
                  </li>
                </ul>
                <button className="mt-auto w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
                  Empezar Prueba
                </button>
              </div>

              {/* Enterprise Tier */}
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm hover:shadow-lg transition duration-300 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Empresarial
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">
                    Personalizado
                  </span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Autenticaciones ilimitadas
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Soporte 24/7 dedicado
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Integración empresarial
                  </li>
                  <li className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-500 mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Dashboard personalizado
                  </li>
                </ul>
                <button className="mt-auto w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150">
                  Contactar Ventas
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  ¿Tienes preguntas?
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                  Contáctanos y te ayudaremos encantados
                </p>
              </div>

              <form className="bg-white rounded-xl shadow-sm p-8">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="tu@correo.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="¿En qué podemos ayudarte?"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
                  >
                    Enviar mensaje
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <img src={logo} className="w-8 h-8 text-indigo-600" />
                  <span className="text-xl font-bold text-gray-900">
                    Face<span className=" text-indigo-600">Auth</span>
                  </span>
                </div>
                <p className="text-gray-500 text-sm">
                  Soluciones innovadoras en autenticación biométrica para
                  aplicaciones web.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  Productos
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-900 text-sm"
                    >
                      API de Reconocimiento Facial
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-900 text-sm"
                    >
                      SDKs
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-900 text-sm"
                    >
                      Integraciones
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  Recursos
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-900 text-sm"
                    >
                      Documentación
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-900 text-sm"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-900 text-sm"
                    >
                      Guías
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-900 text-sm"
                    >
                      Privacidad
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-900 text-sm"
                    >
                      Términos
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-gray-900 text-sm"
                    >
                      Políticas de Datos
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} FaceAuth. Todos los derechos
                reservados.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );    
}

export default Home;
