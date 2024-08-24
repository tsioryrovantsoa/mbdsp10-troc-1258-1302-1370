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
};

export default ExchangeService;
