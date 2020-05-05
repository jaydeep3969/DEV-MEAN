module.exports = (app) => {
    const bill_automobile = require('../../controllers/bills/bill_automobiles.controller') ;

    // Create a new Bill(Autmobile)
    app.post('/api/bill_automobile', bill_automobile.create);

    // Retrieve all Bills(Autmobile)
    app.get('/api/bill_automobile', bill_automobile.findAll);

    // Retrieve a single Bill(Autmobile) with id
    app.get('/api/bill_automobile/:billId', bill_automobile.findOne);

    // Update a Bill(Autmobile) with id
    // app.put('/api/bill_automobile/:billId', bill_automobile.update);

    // Delete a Bill(Autmobile) with id
    app.delete('/api/bill_automobile/:billId', bill_automobile.delete);
}