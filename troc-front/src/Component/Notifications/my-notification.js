
import React, { useState, useEffect } from 'react';
import NavBar from "../NavBar";
import { Box, Typography, Card, Alert, AlertTitle, Pagination } from "@mui/material";
import UserService from '../../Service/userService';
import NotificationService from '../../Service/notificationService';
import { useNavigate } from 'react-router-dom';

export function Notifications() {

    const navigate = useNavigate();
    
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    const userConnectedId = UserService.getUserIdFromToken();


    const handlePageChange = (event, value) => {
        setPage(value - 1);
    };

    const fetchNotifications = async () => {
        setIsLoading(true);
        const params = {
            page,
            limit: size
        }
        try {
            const response = await NotificationService.getNotificationsUser(userConnectedId, params);
            setNotifications(response.data.notifications);
            setTotalPages(response.data.totalPages);
        } catch(error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const markNotifAsRead = async (notifId) => {
        try {
            const response = await NotificationService.markReadNotification(notifId);
            if(response.data.typeNotification === 'PROPOSE_EXCHANGE') {
                navigate(`/item/${response.data.notification.entityId}`);
            } else {
                navigate(`/exchange-detail/${response.data.notification.entityId}`);
            }
        } catch(error) {
            console.error('Error fetching notifications:', error);
        }
    }

    useEffect(() => {
        fetchNotifications();
    }, [page, size]);

    return (
        <>
            <NavBar />
            <div style={{ marginTop: "1%" }}>
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Notifications
                    </Typography>
                    <br />

                    {isLoading ? (
                        <Typography variant="body2" color="text.secondary">
                        Loading...
                        </Typography>
                    ) : (
                        <>
                        {
                            notifications.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No notifications.
                                </Typography>
                            ) : (
                                <>
                                {
                                    notifications.map((notif) => (
                                        <Card sx={{ marginBottom: 2 }} key={notif._id}>
                                            <Alert severity={notif.isRead ? "success" : "info"} onClick={() => markNotifAsRead(notif._id)}>
                                                <AlertTitle>{notif.typeNotification}</AlertTitle>
                                                {notif.content}
                                            </Alert>
                                        </Card>
                                    ))
                                }
                                
                                <Pagination 
                                    count={totalPages} 
                                    page={page + 1} 
                                    onChange={handlePageChange} 
                                    variant="outlined" 
                                    color="secondary" 
                                />
                                </>
                            )
                        }
                        </>
                        )}
                </Box>
            </div>
        </>
    )
}