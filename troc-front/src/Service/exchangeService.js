import axios from "axios";
import { API_URL } from "../Constante/constante";

const API_ITEM_URL = `${API_URL}api/exchanges`;

const ExchangeService = {
  proposeExchange(receiverItemId, requesterItemId) {
    const token = localStorage.getItem("token");
    return axios.post(`${API_ITEM_URL}/propose`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        requesterItemId,
        receiverItemId,
      },
    });
  },
  fetchExchangeData(itemId) {
    const token = localStorage.getItem("token");
    return axios.get(`${API_ITEM_URL}/item/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  acceptExchange: async (exchangeId) => {
    const token = localStorage.getItem("token");
    return await axios.put(`${API_ITEM_URL}/${exchangeId}/accept`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  rejectExchange: async (exchangeId) => {
    const token = localStorage.getItem("token");
    return await axios.put(`${API_ITEM_URL}/${exchangeId}/reject`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export default ExchangeService;
