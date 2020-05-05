module.exports = (app) => {
    const customer_cloth = require('../../controllers/customers/customer_clothes.controller') ;

    // Create a new Customer(Cloth)
    app.post('/api/customer_cloth', customer_cloth.create);

    // Retrieve all Customers(Cloth)
    app.get('/api/customer_cloth', customer_cloth.findAll);

    // Retrieve a single Customer(Cloth) with id
    app.get('/api/customer_cloth/:customerId', customer_cloth.findOne);

    // Update a Customer(Cloth) with id
    app.put('/api/customer_cloth/:customerId', customer_cloth.update);

    // Delete a Customer(Cloth) with id
    app.delete('/api/customer_cloth/:customerId', customer_cloth.delete);
}