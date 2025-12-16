import axios from "axios";
const API_URL = "http://localhost:5000/objectifs";
const getToken = () => localStorage.getItem("authToken");
export async function addObjectif(objectifData) {
  try {
    const token = getToken();
    if (!token) throw new Error("Utilisateur non connecté");

    const response = await axios.post(`${API_URL}/addObjectif`, objectifData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    console.error("Erreur ajout objectif :", err.response?.data || err.message);
    throw err;
  }
}
export async function getObjectifById(utilisateurId) {
  try {
    const token = getToken();
    if (!token) throw new Error("utliaisateur non connecté");
    const response = await axios.get(
      `${API_URL}/getObjectifById/${utilisateurId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error(
      " Erreur get objectif by id:",
      err.response?.data || err.message
    );
    throw err;
  }
}

export async function deleteObjectif(id) {
  try {
    const token = getToken();
    if (!token) throw new Error("utliaisateur non connecté");
    const response = await axios.delete(`${API_URL}/deleteObjectif/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error(" Erreur delete:", err.response?.data || err.message);
    throw err;
  }
}
export async function updateSatutObjectif(id, updatedData) {
  try{
    const token = getToken();
    if(!token) throw new Error("utliaisateur non connecté");
    const response = await axios.put(`${API_URL}/updateSatutObjectif/${id}`, updatedData,{
      headers:{
        Authorization: `Bearer ${token}`,
  },
});
return response.data;
  }catch(err){
    console.error(" Erreur update:", err.response?.data || err.message);
    throw err;
  }
}