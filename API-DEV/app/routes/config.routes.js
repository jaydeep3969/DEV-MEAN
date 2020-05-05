module.exports = (app) => {
    const configs = require('../controllers/config.controller') 

    // Create a new config
    app.post('/api/configs', configs.create);

    // Retrieve all configs
    app.get('/api/configs', configs.findAll);

    // Retrieve a single config with id
    app.get('/api/configs/:configId', configs.findOne);

    // retrieve a songle config with name
    app.get('/api/configs/name/:configName', configs.findOneByName);

    // Update an config with id
    app.put('/api/configs/:configId', configs.update);

    // Delete an config with id
    app.delete('/api/configs/:configId', configs.delete);
}