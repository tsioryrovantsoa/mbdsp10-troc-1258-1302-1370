const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-aggregate-paginate-v2');

const UsersSchema = Schema({
    user_id: {type: Number},
    username: {type: String},
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    createdAt: {type: Date},
    updatedAt: {type: Date},
    deletedAt: {type: Date},
    isEnabled: {type: Boolean}
});

UsersSchema.plugin(mongoosePaginate);

const UsersModel = mongoose.model('users', UsersSchema);

module.exports = { UsersModel, UsersSchema }