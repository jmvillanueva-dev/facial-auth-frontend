import api from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirigir al login (manejo de sesión expirada/no autenticada)
    window.location.href = "/auth?session_expired=1";
    throw new Error("No authentication token found");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // Aseguramos que el tipo de contenido sea JSON
    },
  };
};

// Función para obtener todas las aplicaciones del usuario autenticado
export const getApps = async () => {
  try {
    const response = await api.get(
      `${API_URL}/api/apps/`, // URL actualizada
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth?session_expired=1";
    }
    console.error("Error fetching apps:", error);
    throw error;
  }
};

// Función para crear una nueva aplicación
export const createApp = async (appData) => {
  try {
    const response = await api.post(
      `${API_URL}/api/apps/create/`, // URL actualizada
      appData, // appData ahora debe incluir CONFIDENCE_THRESHOLD y FALLBACK_THRESHOLD
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error creating app:", error);
    throw error;
  }
};

// Función para actualizar una aplicación existente
export const updateApp = async (id, appData) => {
  try {
    const response = await api.put(
      `${API_URL}/api/apps/${id}/update/`, // URL actualizada
      appData, // appData ahora debe incluir CONFIDENCE_THRESHOLD y FALLBACK_THRESHOLD
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating app:", error);
    throw error;
  }
};

// Función para eliminar una aplicación
export const deleteApp = async (id) => {
  try {
    // getAuthHeader() es necesario para DELETE también, ya que la vista requiere autenticación
    const response = await api.delete(
      `${API_URL}/api/apps/${id}/delete/`,
      getAuthHeader()
    ); // URL actualizada
    return response.data;
  } catch (error) {
    console.error("Error deleting app:", error);
    throw error;
  }
};

// --- NUEVAS FUNCIONES PARA ENDUSERS ---

// Función para obtener los usuarios finales de una aplicación específica
export const getEndUsersByApp = async (appId) => {
  try {
    const response = await api.get(
      `${API_URL}/api/apps/${appId}/users/`, // URL para listar EndUsers de una app
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth?session_expired=1";
    }
    console.error(`Error fetching end users for app ${appId}:`, error);
    throw error;
  }
};

// Función para eliminar (soft delete) un usuario final de una aplicación específica
export const deleteEndUser = async (appId, userId) => {
  try {
    const response = await api.delete(
      `${API_URL}/api/apps/${appId}/users/${userId}/delete/`, // URL para eliminar un EndUser
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth?session_expired=1";
    }
    console.error(
      `Error deleting end user ${userId} from app ${appId}:`,
      error
    );
    throw error;
  }
};
