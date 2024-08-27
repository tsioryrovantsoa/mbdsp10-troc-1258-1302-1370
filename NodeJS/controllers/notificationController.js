const { NotificationModel: Notification } = require('../models/notification');

class NotificationController {
    static async createNotification(req, res) {

        try {
            const newNotif = new Notification({
                user: req.body.user,
                content: req.body.content,
                isRead: false,
                creationDate: new Date(),
                typeNotification: req.body.typeNotification,
                entityId: req.body.entityId 
            })

            const savedNotification = await newNotif.save();
            res.status(201).json({message: "ok", notif: savedNotification});
        } catch (err) {
            console.log(err);
            res.status(400).json({message: "non ok", detail: err.message});
        }

    }

    static async getUnreadNotificationsCount(req, res) {
        try {
            const userId = req.params.userId;

            const count = await Notification.countDocuments({
                'user.user_id': userId,
                isRead: false
            });

            res.status(200).json({ count });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors du comptage des notifications", detail: err.message });
        }
    }

    static async getNotificationsWithPagination(req, res) {
        try {
            const userId = req.params.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const options = {
                page: page,
                limit: limit,
                sort: { creationDate: -1 }
            };

            const query = { 'user.user_id': userId };

            const result = await NotificationModel.paginate(query, options);

            res.status(200).json({
                notifications: result.docs,
                currentPage: result.page,
                totalPages: result.totalPages,
                totalNotifications: result.totalDocs
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Erreur lors de la récupération des notifications", detail: err.message });
        }
    }
}


module.exports = NotificationController;
