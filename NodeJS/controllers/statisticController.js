
const { StatisticsModel: Statistics } = require('../models/statistic');

class StatisticController {
    static async addStatCateg(req, res) {
        try {
            const { category } = req.body;
            const statsDate = new Date();
            statsDate.setHours(0, 0, 0, 0);
        
            await Statistics.findOneAndUpdate(
              {},
              {
                $push: {
                  [`categorie.${category}`]: { date: statsDate, count: 1 }
                }
              },
              { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        
            res.json({ message: 'Exchange recorded and statistics updated' });
        } catch (error) {
            res.status(500).json({ error: 'Error updating statistics' });
        }
    }

    static async getStatCategory(req, res) {
        try {
            const { limit = 5 } = req.query;
        
            const stats = await Statistics.aggregate([
              { $project: { 
                categories: { $objectToArray: "$categorie" }
              }},
              { $unwind: "$categories" },
              { $unwind: "$categories.v" },
              { $group: {
                _id: "$categories.k",
                count: { $sum: "$categories.v.count" }
              }},
              { $sort: { count: -1 }},
              { $limit: parseInt(limit) }
            ]);
        
            res.json(stats);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving popular categories' });
        }
    }
}

module.exports = StatisticController;