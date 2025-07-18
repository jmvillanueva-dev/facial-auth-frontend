import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaRegChartBar,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaCopy,
} from "react-icons/fa";

import logo from "../../../assets/img/logo.svg";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
    
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/auth");
      }
    } else {
      navigate("/auth");
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return `<p class="text-red-500">No se pudo cargar el usuario. Por favor, inicia sesión nuevamente.</p>`;
  }

  const apps = [
    { id: 1, name: "Mi App 1", token: "tkn_7x9sAqR2fL" },
    { id: 2, name: "Negocio en Línea", token: "tkn_XyZ5kLmP8r" },
  ];

  const users = [
    { id: 1, name: "María López", role: "Administrador", lastLogin: "Hoy" },
    { id: 2, name: "Javier Gómez", role: "Usuario", lastLogin: "Ayer" },
    { id: 3, name: "Laura Torres", role: "Usuario", lastLogin: "Hace 3 días" },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Token copiado al portapapeles");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <img src={logo} className="w-8 h-8 text-indigo-600" />
            <span className="font-semibold text-lg">FaceAuth</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-500 focus:outline-none"
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
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab("perfil")}
            className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
              activeTab === "perfil"
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`}
          >
            <FaUserCircle className="mr-3" /> Mi Perfil
          </button>
          <button
            onClick={() => setActiveTab("usuarios")}
            className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
              activeTab === "usuarios"
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`}
          >
            <FaUsers className="mr-3" /> Usuarios
          </button>
          <button
            onClick={() => setActiveTab("configuracion")}
            className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
              activeTab === "configuracion"
                ? "bg-indigo-100 text-indigo-700"
                : "hover:bg-gray-100"
            }`}
          >
            <FaCog className="mr-3" /> Configuración
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <FaSignOutAlt className="mr-3" /> Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow md:hidden">
          <h1 className="text-xl font-bold">FaceAuth</h1>
          <button onClick={() => setSidebarOpen(true)}>
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
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </header>

        <div className="container mx-auto p-6">
          {/* Tab: Perfil */}
          {activeTab === "perfil" && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <img
                    src="https://picsum.photos/200/300?random=1"
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold">{user.full_name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Miembro desde {user.joinedDate}
                    </p>
                  </div>
                </div>
                <hr className="my-6" />
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      type="text"
                      defaultValue={user.full_name}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                  <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150">
                    Guardar Cambios
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* Tab: Usuarios */}
          {activeTab === "usuarios" && (
            <section>
              <h2 className="text-2xl font-bold mb-6">
                Usuarios de mi Aplicación
              </h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Último acceso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.lastLogin}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Tab: Configuración */}
          {activeTab === "configuracion" && (
            <section>
              <h2 className="text-2xl font-bold mb-6">Tus Aplicaciones</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {apps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-lg shadow p-4 relative"
                  >
                    <h3 className="font-semibold text-lg">{app.name}</h3>
                    <div className="mt-2 text-sm text-gray-600 font-mono truncate">
                      {app.token}
                    </div>
                    <button
                      onClick={() => copyToClipboard(app.token)}
                      className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
                    >
                      Copiar Token
                    </button>
                  </div>
                ))}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    + Agregar nueva aplicación
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
