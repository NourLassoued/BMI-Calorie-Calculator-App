import axios from "axios";
const API_URL = "http://localhost:5000/users";
const getToken = () => localStorage.getItem("authToken");

export async function getAllUsers() {
  return await axios.get(`${API_URL}/getAllUsers`);
}

export const deleteUser = (id) =>
  axios.delete(`${API_URL}/deleteUser/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });


export const updateUser = (id, data) =>
  axios.put(`${API_URL}/updateUser/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

// Ajouter un utilisateur avec image
export const addUserWithImage = (data, file) => {
  const formData = new FormData();
  formData.append("image_user", file);
  for (let key in data) formData.append(key, data[key]);

  return axios.post(`${API_URL}/addUserWithImage`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

// Récupérer un utilisateur par ID
export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/getUserById/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data; // <- ici tu récupères directement l'utilisateur
  } catch (err) {
    console.error("Erreur getUserById:", err.response?.data || err.message);
    throw err;
  }
};
