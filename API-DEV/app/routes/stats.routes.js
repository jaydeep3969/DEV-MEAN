module.exports = (app) => {
    const stats = require('../controllers/stats.controller') 

    // Create a new expense
    app.post('/api/stats', stats.create);

    // Retrieve all stats
    app.get('/api/stats', stats.findAll);
}