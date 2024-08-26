const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');
const { UsersSchema } = require('./users');

const NotificationSchema = Schema({
    user: {type: UsersSchema},
    content: {type: String},
    isRead: {type: Boolean, default: false},
    creationDate: {type: Date, default: Date.now},
    typeNotification: {type: String},
    entityId: {type: String}
});

NotificationSchema.plugin(mongoosePaginate);

const NotificationModel = mongoose.model('notifications', NotificationSchema);

module.exports = {NotificationModel, NotificationSchema}