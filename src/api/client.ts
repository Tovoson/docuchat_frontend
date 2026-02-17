import axios from "axios";

// Création d'une instance Axios configurée
const apiClient = axios.create({
  baseURL: "https://docuchatbackend-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
