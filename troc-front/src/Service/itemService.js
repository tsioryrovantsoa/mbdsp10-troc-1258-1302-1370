import axios from 'axios';
import { API_URL } from '../Constante/constante';

const API_ITEM_URL = `${API_URL}api/items`;

const token = localStorage.getItem('token');
const ItemService = {

    createItem(itemData) {
        return axios.post(API_ITEM_URL, itemData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });
    }
}

export default ItemService;
