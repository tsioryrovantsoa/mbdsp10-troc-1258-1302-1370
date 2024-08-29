import axios from 'axios';
import { EXPRESS_API_URL } from '../Constante/constante';

const API_NOTIFICATIONS_URL = `${EXPRESS_API_URL}api/notifications`;

const NotificationService = {
    nbNotification(userId) {
        const token = localStorage.getItem('token');
        return axios.get(`${API_NOTIFICATIONS_URL}/unread-count/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    },

    getNotificationsUser(userId, paramsData) {
        const token = localStorage.getItem('token');
        return axios.get(`${API_NOTIFICATIONS_URL}/${userId}`, {
            params: paramsData,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    },

    markReadNotification(notifId) {
        const token = localStorage.getItem('token');
        return axios.patch(`${API_NOTIFICATIONS_URL}/${notifId}/read`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });
    }
}

export default NotificationService;
