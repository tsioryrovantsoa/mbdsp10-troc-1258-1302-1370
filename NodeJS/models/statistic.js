const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const StatSchema = Schema({
    date: Date,
    count: {type: Number, default: 1}
});


const StatisticsSchema = Schema({
    categorie: {
      type: Map,
      of: [StatSchema]
    }
});

StatisticsSchema.plugin(mongoosePaginate);

const StatisticsModel = mongoose.model('statistics', StatisticsSchema);

module.exports = {StatisticsModel, StatisticsSchema}

