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
  getEndUsersByApp,
  deleteEndUser,
} from "../../../services/appService.js";
import {
  FaUserCircle,
  FaRegChartBar,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaCopy,
  FaEdit,
  FaTrashAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import Modal from "react-modal";
import logo from "../../../assets/img/logo.svg";

// Configuración para react-modal
Modal.setAppElement("#root");

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "600px",
    width: "90%",
    borderRadius: "8px",
    padding: "2rem",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

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
    CONFIDENCE_THRESHOLD: 0.8,
    FALLBACK_THRESHOLD: 0.6,
  });

  // Nuevo estado para almacenar los usuarios finales por aplicación
  const [endUsersByApp, setEndUsersByApp] = useState({});
  const [isLoadingEndUsers, setIsLoadingEndUsers] = useState(false);

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

  // Cargar las apps cuando se selecciona la pestaña de configuración
  useEffect(() => {
    if (activeTab === "configuracion") {
      fetchApps();
    }
  }, [activeTab]);

  // Cargar los EndUsers cuando se selecciona la pestaña de usuarios
  // y las apps ya están cargadas
  useEffect(() => {
    if (activeTab === "usuarios" && apps.length > 0) {
      fetchAllEndUsers();
    } else if (
      activeTab === "usuarios" &&
      apps.length === 0 &&
      !isLoadingApps
    ) {
      setEndUsersByApp({});
    }
  }, [activeTab, apps, isLoadingApps]);

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

  // Función para cargar las aplicaciones
  const fetchApps = async () => {
    setIsLoadingApps(true);
    try {
      const appsData = await getApps();
      setApps(appsData);
    } catch (error) {
      console.error("Error loading apps:", error);
      toast.error("Error al cargar las aplicaciones.");
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Función para cargar los EndUsers de todas las aplicaciones
  const fetchAllEndUsers = async () => {
    setIsLoadingEndUsers(true);
    const newEndUsersByApp = {};
    for (const app of apps) {
      try {
        const usersData = await getEndUsersByApp(app.id);
        newEndUsersByApp[app.id] = usersData;
      } catch (error) {
        console.error(`Error loading end users for app ${app.name}:`, error);
        toast.error(`Error al cargar usuarios para la aplicación: ${app.name}`);
      }
    }
    setEndUsersByApp(newEndUsersByApp);
    setIsLoadingEndUsers(false);
  };

  // Función para manejar el envío del formulario de apps
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
      fetchApps(); // Refrescar la lista de apps
      setIsModalOpen(false);
      setCurrentApp(null);
      setFormData({
        name: "",
        description: "",
        CONFIDENCE_THRESHOLD: 0.8,
        FALLBACK_THRESHOLD: 0.6,
      });
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
      CONFIDENCE_THRESHOLD: app.CONFIDENCE_THRESHOLD,
      FALLBACK_THRESHOLD: app.FALLBACK_THRESHOLD,
    });
    setIsModalOpen(true);
  };

  // Función para eliminar una app
  const handleDeleteApp = async (id) => {
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

  // Función para eliminar un EndUser
  const handleDeleteEndUser = async (appId, userId, userName) => {
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar al usuario ${userName}?`
      )
    ) {
      try {
        await deleteEndUser(appId, userId);
        toast.success(`Usuario ${userName} eliminado correctamente`);
        // Refrescar solo los usuarios de esa app
        const updatedUsers = await getEndUsersByApp(appId);
        setEndUsersByApp((prev) => ({
          ...prev,
          [appId]: updatedUsers,
        }));
      } catch (error) {
        toast.error(`Error al eliminar al usuario ${userName}`);
        console.error("Error deleting end user:", error);
      }
    }
  };

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
            <img src={logo} className="w-8 h-8 text-indigo-600" alt="Logo" />
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
            <img
              src={logo}
              className="w-6 h-6 mr-1 text-indigo-600"
              alt="Logo"
            />
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

          {/* Tab: Usuarios (Ahora con listado por aplicación) */}
          {activeTab === "usuarios" && (
            <section>
              <h2 className="text-2xl font-bold mb-6">
                Usuarios de mis Aplicaciones
              </h2>
              {isLoadingEndUsers ? (
                <div className="flex justify-center items-center h-40">
                  <p>Cargando usuarios...</p>
                </div>
              ) : apps.length === 0 ? (
                <p className="text-gray-600">
                  Aún no tienes aplicaciones registradas para mostrar usuarios.
                  Ve a la pestaña "Aplicaciones" para crear una.
                </p>
              ) : (
                <div className="space-y-8">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white rounded-lg shadow p-6"
                    >
                      <h3 className="text-xl font-semibold mb-4">
                        Aplicación: {app.name}
                      </h3>
                      {endUsersByApp[app.id] &&
                      endUsersByApp[app.id].length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Nombre Completo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Correo Electrónico
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Registrado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Acciones
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {endUsersByApp[app.id].map((endUser) => (
                                <tr key={endUser.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {endUser.full_name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {endUser.email}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                      {endUser.role}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {format(
                                      parseISO(endUser.created_at),
                                      "dd/MM/yyyy",
                                      { locale: es }
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                      onClick={() =>
                                        handleDeleteEndUser(
                                          app.id,
                                          endUser.id,
                                          endUser.full_name
                                        )
                                      }
                                      className="text-red-600 hover:text-red-900 ml-4"
                                      title="Eliminar usuario"
                                    >
                                      <FaTrashAlt />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No hay usuarios registrados para esta aplicación.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                    setFormData({
                      name: "",
                      description: "",
                      CONFIDENCE_THRESHOLD: 0.8,
                      FALLBACK_THRESHOLD: 0.6,
                    });
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150"
                >
                  + Nueva Aplicación
                </button>
              </div>
              <p className="mb-5 text-gray-700">
                Solicita y consulta una API Key para integrar los servicios de
                FaceAuth en tus aplicaciones. Define los umbrales de confianza
                para el reconocimiento facial.
              </p>

              {isLoadingApps ? (
                <div className="flex justify-center items-center h-40">
                  <p>Cargando aplicaciones...</p>
                </div>
              ) : apps.length === 0 ? (
                <p className="text-gray-600">
                  Aún no tienes aplicaciones registradas. Haz clic en "+ Nueva
                  Aplicación" para empezar.
                </p>
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
                      <div className="mt-3 text-sm text-gray-700">
                        <p>
                          Umbral de Confianza:{" "}
                          <span className="font-semibold">
                            {(app.CONFIDENCE_THRESHOLD * 100).toFixed(0)}%
                          </span>
                        </p>
                        <p>
                          Umbral de Respaldo:{" "}
                          <span className="font-semibold">
                            {(app.FALLBACK_THRESHOLD * 100).toFixed(0)}%
                          </span>
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(app)}
                            className="text-indigo-600 hover:text-indigo-800"
                            title="Editar aplicación"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteApp(app.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar aplicación"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500 mr-2">
                            Token:
                          </span>
                          <button
                            onClick={() => copyToClipboard(app.token)}
                            className="text-indigo-600 hover:text-indigo-800 hover:cursor-pointer flex items-center text-sm"
                            title="Copiar token"
                          >
                            <FaCopy className="mr-1" /> Copiar
                          </button>
                        </div>
                      </div>
                      <div className="text-xs font-mono text-gray-700 truncate mt-2 p-2 bg-gray-50 rounded-md border border-gray-200">
                        {app.token}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Creada: {format(parseISO(app.created_at), "dd/MM/yyyy")}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Modal para crear/editar aplicaciones */}
              <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={customModalStyles}
                contentLabel={
                  currentApp ? "Editar Aplicación" : "Nueva Aplicación"
                }
              >
                <h3 className="text-xl font-semibold mb-4">
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
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Umbral de Confianza (0.0 - 1.0)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.0"
                        max="1.0"
                        value={formData.CONFIDENCE_THRESHOLD}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            CONFIDENCE_THRESHOLD: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Define la similitud mínima para un "match" directo. Un
                        valor más alto es más estricto.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Umbral de Respaldo (0.0 - 1.0)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.0"
                        max="1.0"
                        value={formData.FALLBACK_THRESHOLD}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            FALLBACK_THRESHOLD: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Define la similitud para posibles coincidencias
                        (ambiguas). Debe ser igual o menor al Umbral de
                        Confianza.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150"
                    >
                      {currentApp ? "Actualizar" : "Crear"}
                    </button>
                  </div>
                </form>
              </Modal>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
