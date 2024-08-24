import axios from 'axios';
import { API_URL } from '../Constante/constante';
import UserService from './userService';

const API_ITEM_URL = `${API_URL}api/items`;

const ItemService = {

    createItem(itemData) {
    const token = localStorage.getItem('token');
        return axios.post(API_ITEM_URL, itemData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });
    },

    listItem(paramsData) {
    const token = localStorage.getItem('token');
        return axios.get(`${API_ITEM_URL}/search`, {
            params: paramsData,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    },

    getImage(imageId) {
        const token = localStorage.getItem('token');
        return axios.get(`${API_ITEM_URL}/images/${imageId}`, {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    },

    getCategories() {
        const token = localStorage.getItem('token');
        return axios.get(`${API_ITEM_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    },

    getDetailItem(itemId) {
        const token = localStorage.getItem('token');
        return axios.get(`${API_ITEM_URL}/${itemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
    },

    getMyItems(paramsData) {
        const userConnectedId = UserService.getUserIdFromToken();
        const token = localStorage.getItem('token');
        return axios.get(`${API_ITEM_URL}/user/${userConnectedId}`, {
            params: paramsData,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    }
}

export default ItemService;
