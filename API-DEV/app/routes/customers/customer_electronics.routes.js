module.exports = (app) => {
    const customer_electronic = require('../../controllers/customers/customer_electronics.colntroller') ;

    // Create a new Customer(Electronic)
    app.post('/api/customer_electronic', customer_electronic.create);

    // Retrieve all Customers(Electronic)
    app.get('/api/customer_electronic', customer_electronic.findAll);

    // Retrieve a single Customer(Electronic) with id
    app.get('/api/customer_electronic/:customerId', customer_electronic.findOne);

    // Update a Customer(Electronic) with id
    app.put('/api/customer_electronic/:customerId', customer_electronic.update);

    // Delete a Customer(Electronic) with id
    app.delete('/api/customer_electronic/:customerId', customer_electronic.delete);
}