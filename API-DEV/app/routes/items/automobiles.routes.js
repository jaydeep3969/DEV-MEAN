module.exports = (app) => {
    const automobiles = require('../../controllers/items/automobiles.controller') 

    // Create a new automobile brand
    app.post('/api/automobiles', automobiles.create);

    // Create a new model
    app.post('/api/automobiles/model/:brandId', automobiles.createModel);

    // Retrieve all automobiles
    app.get('/api/automobiles', automobiles.findAll);

    // Retrieve a single automobile with id
    app.get('/api/automobiles/id/:automobileId', automobiles.findOne);

    // Retrieve a single automobile with name
    app.get('/api/automobiles/name/:brandName/:modelName', automobiles.findOneByName);

    // Update a automobile with id
    app.put('/api/automobiles/:automobileId', automobiles.update);

    // Update a model with id
    app.put('/api/automobiles/model/:brandId', automobiles.updateModel);

    // Delete a automobile with id
    app.delete('/api/automobiles/:automobileId', automobiles.delete);

    // Delete a model with id
    app.delete('/api/automobiles/model/:brandId/:modelId', automobiles.deleteModel);
}