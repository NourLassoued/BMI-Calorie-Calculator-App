

const API_URL = "http://localhost:5000/poids";


const getToken = () => localStorage.getItem("authToken");
export const getPoidsByUser = async (userId) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Utilisateur non connecté");

    const res = await fetch(`${API_URL}/getPoidsByUser/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Erreur récupération poids");
    }

    return await res.json();
  } catch (err) {
    console.error("Erreur récupération poids :", err.message);
    return [];
  }
};


export const addPoids = async (userId, poidsData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Utilisateur non connecté");

    const res = await fetch(`${API_URL}/add/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(poidsData),
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Erreur ajout poids");
    }

    const data = await res.json();
    return data.poids;
  } catch (err) {
    console.error("Erreur ajout poids :", err.message);
    throw err;
  }
};

// Supprimer un poids
export const deletePoids = async (id, token) => {
  try {
    const res = await fetch(`${API_URL}/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Erreur suppression poids");
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
