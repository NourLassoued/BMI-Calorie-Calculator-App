import axios   from "axios";
const API_URL = "http://localhost:5000/auth";


export const login = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data; 

}
export async function register(userData) {
  return await axios.post(`${API_URL}/register`, userData);
}
export const logout=async()=>{
  try{
    await axios.post('${API_URL}/logout',{
      headers :{
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }});
      }catch(error){
        console.error("Erreur lors de la déconnexion :", error.response?.data || error.message);
      }
      localStorage.removeItem('authToken');

    };
  
 
