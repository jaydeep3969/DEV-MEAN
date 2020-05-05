module.exports = (app) => {
    const clothes = require('../../controllers/items/clothes.controller') 

    // Create a new cloth
    app.post('/api/clothes', clothes.create);

    // Retrieve all clothes
    app.get('/api/clothes', clothes.findAll);

    // Retrieve a single cloth with id
    app.get('/api/clothes/id/:clothId', clothes.findOne);

    // Retrieve a single cloth with name
    app.get('/api/clothes/name/:clothName', clothes.findOneByName);

    // Update a cloth with id
    app.put('/api/clothes/:clothId', clothes.update);

    // Delete a cloth with id
    app.delete('/api/clothes/:clothId', clothes.delete);
}