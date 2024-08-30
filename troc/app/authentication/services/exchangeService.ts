import axios from "axios";
import { baseURL } from "@/services/ApiService";
import { getToken } from "@/storage";

const ExchangeService = {
  fetchExchangeData: async (itemId: any) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Token not found");
      }

      // Appelle l'API pour récupérer les données d'échange
      const response = await axios.get(
        `${baseURL}api/exchanges/item/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response;
    } catch (error) {
      console.error("Error fetching exchange data:", error);
      throw error;
    }
  },

  acceptExchange: async (exchangeId: string) => {
    try {
      const token = await getToken();

      return await axios.put(
        `${baseURL}api/exchanges/${exchangeId}/accept`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error accepting exchange:", error);
      throw error;
    }
  },

  rejectExchange: async (exchangeId: string) => {
    try {
      const token = await getToken();

      return await axios.put(
        `${baseURL}api/exchanges/${exchangeId}/reject`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error rejecting exchange:", error);
      throw error;
    }
  },
};

export default ExchangeService;
