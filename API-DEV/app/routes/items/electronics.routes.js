module.exports = (app) => {
    const electronics = require('../../controllers/items/electronics.controller') 

    // Create a new electronics
    app.post('/api/electronics', electronics.create);

    // Retrieve all electronics
    app.get('/api/electronics', electronics.findAll);

    // Retrieve a single electronics with id
    app.get('/api/electronics/id/:electronicId', electronics.findOne);

    // Retrieve a single electronic with name
    app.get('/api/electronics/name/:electronicName', electronics.findOneByName);

    // Update a electronics with id
    app.put('/api/electronics/:electronicId', electronics.update);

    // Delete a electronics with id
    app.delete('/api/electronics/:electronicId', electronics.delete);
}