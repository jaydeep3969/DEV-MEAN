module.exports = (app) => {
    const customer_automobile = require('../../controllers/customers/customer_automobiles.controller') ;

    // Create a new Customer(Automobile)
    app.post('/api/customer_automobile', customer_automobile.create);

    // Retrieve all Customers(Automobile)
    app.get('/api/customer_automobile', customer_automobile.findAll);

    // Retrieve a single Customer(Automobile) with id
    app.get('/api/customer_automobile/:customerId', customer_automobile.findOne);

    // Update a Customer(Automobile) with id
    app.put('/api/customer_automobile/:customerId', customer_automobile.update);

    // Delete a Customer(Automobile) with id
    app.delete('/api/customer_automobile/:customerId', customer_automobile.delete);
}