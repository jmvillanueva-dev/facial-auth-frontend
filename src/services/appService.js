import api from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const getApps = async () => {
  try {
    const response = await api.get(
      `${API_URL}/api/apps/my-apps/`,
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

export const createApp = async (appData) => {
  try {
    const response = await api.post(
      `${API_URL}/api/apps/create-app/`,
      appData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error creating app:", error);
    throw error;
  }
};

export const updateApp = async (id, appData) => {
  try {
    const response = await api.put(
      `${API_URL}/api/apps/update-app/${id}/`,
      appData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating app:", error);
    throw error;
  }
};

export const deleteApp = async (id) => {
  try {
    const response = await api.delete(`${API_URL}/api/apps/delete-app/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting app:", error);
    throw error;
  }
};
