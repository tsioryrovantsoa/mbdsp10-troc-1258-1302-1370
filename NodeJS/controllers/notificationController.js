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
}


module.exports = NotificationController;
