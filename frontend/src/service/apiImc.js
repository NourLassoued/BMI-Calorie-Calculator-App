import axios from "axios";
const API_URL = "http://localhost:5000/imc";
const getToken = () => localStorage.getItem("authToken");
export const getDernierIMC = async (utilisateurId) => {
  try {
    const response = await axios.get(`${API_URL}/dernier/${utilisateurId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}` 
      }
    });

    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la récupération du dernier IMC :", error.response?.data || error.message);
    throw error;
  }
};