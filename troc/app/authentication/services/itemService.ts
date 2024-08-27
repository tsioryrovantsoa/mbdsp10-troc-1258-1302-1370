import axios from "axios";
import { baseURL } from "@/services/ApiService";
import { getToken } from "@/storage"; // Importez getToken si vous gérez les tokens de cette manière
import { getUserIdFromToken } from "./storageService";

export const getMyItems = async (paramsData = {}) => {
  try {
    // Obtenir le token et l'ID utilisateur de manière asynchrone
    const token = await getToken();
    const userConnectedId = await getUserIdFromToken();

    // Vérifiez si l'ID utilisateur est présent
    if (!userConnectedId) {
      throw new Error("Utilisateur non authentifié");
    }

    console.log(`${baseURL}user/${userConnectedId}`);

    // Envoyer la requête une fois que toutes les valeurs sont disponibles
    const response = await axios.get(
      `${baseURL}api/items/user/${userConnectedId}`,
      {
        params: paramsData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Retourner la réponse de la requête
    return response;
  } catch (error) {
    // Gérer les erreurs de manière appropriée
    console.error("Erreur lors de l'obtention des items :", error);
    throw error;
  }
};

export const proposeExchange = async (
  receiverItemId: string,
  requesterItemId: string
) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("Token non trouvé");
    }

    const response = await axios.post(`${baseURL}api/exchanges/propose`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        requesterItemId,
        receiverItemId,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error proposing exchange:", error);
    throw error;
  }
};
