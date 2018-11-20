const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics_controller');

topicsRouter.get('/', getTopics);

module.exports = { topicsRouter }