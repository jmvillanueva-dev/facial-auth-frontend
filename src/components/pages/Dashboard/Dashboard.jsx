import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  getApps,
  createApp,
  updateApp,
  deleteApp,
} from "../../../services/appService.js";
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

  const [apps, setApps] = useState([]);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    strictness: 0.6,
  });

  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp < Date.now() / 1000;
    } catch (e) {
      console.error("Error decoding token:", e);
      return true;
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !userData) {
      navigate("/auth");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (token && isTokenExpired(token)) {
        setShowExpiredModal(true);
        localStorage.clear();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/auth"), 2000);
        return;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/auth");
    }
    setIsLoading(false);
  }, [navigate]);

  // Cargar las apps cuando se selecciona la pestaña
  useEffect(() => {
    if (activeTab === "configuracion") {
      fetchApps();
    }
  }, [activeTab]);

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

  // Apps data fetching
  // Función para cargar las aplicaciones
  const fetchApps = async () => {
    setIsLoadingApps(true);
    try {
      const appsData = await getApps();
      setApps(appsData);
    } catch (error) {
      console.error("Error loading apps:", error);
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentApp) {
        await updateApp(currentApp.id, formData);
        toast.success("Aplicación actualizada correctamente");
      } else {
        await createApp(formData);
        toast.success("Aplicación creada correctamente");
      }
      fetchApps();
      setIsModalOpen(false);
      setCurrentApp(null);
      setFormData({ name: "", description: "", strictness: 0.6 });
      console.log(setFormData);
    } catch (error) {
      toast.error("Error al guardar la aplicación");
      console.error("Error saving app:", error);
    }
  };

  // Función para editar una app
  const handleEdit = (app) => {
    setCurrentApp(app);
    setFormData({
      name: app.name,
      description: app.description,
      strictness: app.strictness,
    });
    setIsModalOpen(true);
  };

  // Función para eliminar una app
  const handleDelete = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta aplicación?")
    ) {
      try {
        await deleteApp(id);
        toast.success("Aplicación eliminada correctamente");
        fetchApps();
      } catch (error) {
        toast.error("Error al eliminar la aplicación");
        console.error("Error deleting app:", error);
      }
    }
  };

  const users = [
    { id: 1, name: "María López", role: "Administrador", lastLogin: "Hoy" },
    { id: 2, name: "Javier Gómez", role: "Usuario", lastLogin: "Ayer" },
    { id: 3, name: "Laura Torres", role: "Usuario", lastLogin: "Hace 3 días" },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.info("Token copiado al portapapeles");
      })
      .catch((err) => {
        toast.error("No se pudo copiar el token");
        console.error("Error al copiar al portapapeles:", err);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      <ToastContainer />

      {showExpiredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Sesión Expirada</h3>
            <p className="text-gray-600 mb-6">
              Tu sesión ha terminado por seguridad. Vuelve a iniciar sesión para
              continuar.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Ir al Login
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <img src={logo} className="w-8 h-8 text-indigo-600" />
            <span className="font-semibold text-lg">
              Face<span className=" text-indigo-600">Auth</span>
            </span>
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
            <FaCog className="mr-3" /> Aplicaciones
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
          <h1 className="flex text-xl font-bold">
            <img src={logo} className="w-6 h-6 mr-1 text-indigo-600" />
            Face<span className=" text-indigo-600">Auth</span>
          </h1>
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
              <h2 className="text-2xl font-bold mb-6 ">Mi Perfil</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <img
                    src="https://picsum.photos/200/300?random=1"
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-semibold">{user.full_name}</h3>
                    <p className="text-gray-600">{user.username}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Miembro desde:
                      {format(
                        parseISO(user.date_joined),
                        " dd 'de' MMMM yyyy",
                        { locale: es }
                      )}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre de usuario
                    </label>
                    <input
                      type="text"
                      defaultValue={user.username}
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  Registro de tus Aplicaciones
                </h2>
                <button
                  onClick={() => {
                    setCurrentApp(null);
                    setFormData({ name: "", description: "", strictness: 0.6 });
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150"
                >
                  + Nueva Aplicación
                </button>
              </div>
              <p className="mb-5">
                Solicita y consulta una API Key para integrar los servicios de
                FaceAuth en tus aplicaciones
              </p>

              {isLoadingApps ? (
                <div className="flex justify-center items-center h-40">
                  <p>Cargando aplicaciones...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-lg shadow p-4 relative hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-lg">{app.name}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {app.description || "Sin descripción"}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          Nivel: {app.strictness.toFixed(1)}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(app)}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Token:</span>
                          <button
                            onClick={() => copyToClipboard(app.token)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 hover:cursor-pointer flex items-center"
                          >
                            <FaCopy className="mr-1" /> Copiar
                          </button>
                        </div>
                        <div className="text-xs font-mono text-gray-700 truncate mt-1">
                          {app.token}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Creada: {format(parseISO(app.created_at), "dd/MM/yyyy")}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal para crear/editar aplicaciones */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4">
                      {currentApp ? "Editar Aplicación" : "Nueva Aplicación"}
                    </h3>
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                description: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border rounded-md"
                            rows="3"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nivel de Rigurosidad
                          </label>
                          <select
                            value={formData.strictness}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                strictness: parseFloat(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border rounded-md"
                          >
                            <option value="0.4">Bajo (0.4)</option>
                            <option value="0.6">Medio (0.6)</option>
                            <option value="0.8">Alto (0.8)</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 border rounded-md hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                          {currentApp ? "Actualizar" : "Crear"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
