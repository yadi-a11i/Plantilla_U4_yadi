import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [

    { name: "Dashboard", href: "/dashboard" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
              
                <span className="font-bold text-xl text-gray-800">
                  PLANTILLA UNIDAD 4
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? "text-pink-500 border-b-2 border-pink-500"
                      : "text-gray-600 hover:text-pink-500"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-pink-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? "text-pink-500 bg-pink-50 rounded-md"
                        : "text-gray-600 hover:text-pink-500 hover:bg-gray-50 rounded-md"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Logo y descripción */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-3">
               
                <span className="font-bold text-xl text-white">
                 PLANTILLA UNIDAD 4
                </span>
              </div>
              <p className="text-gray-300 mb-3 text-sm">
                Descripción de pie de página
              </p>
              
            </div>

            {/* Enlaces rápidos */}
            <div>
              <h4 className="font-semibold mb-3 text-sm text-white">Enlaces</h4>
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-pink-400 transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-semibold mb-3 text-sm text-white">
                Contacto
              </h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>📧 Correo@crackthecode.la</li>
                <li>💼 @crackthecode</li>
                <li>📚 Github/crackthecode</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600 mt-6 pt-6 text-center">
            <p className="text-gray-300 text-sm">
              © 2025 . Todos los derechos reservados.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              "Es una plantilla de la Unidad 4"
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
