module.exports = (app) => {
    const bill_electronic = require('../../controllers/bills/bill_electronics.controller') ;

    // Create a new Bill(Electronic)
    app.post('/api/bill_electronic', bill_electronic.create);

    // Retrieve all Bills(Electronic)
    app.get('/api/bill_electronic', bill_electronic.findAll);

    // Retrieve a single Bill(Electronic) with id
    app.get('/api/bill_electronic/:billId', bill_electronic.findOne);

    // Update a Bill(Electronic) with id
    // app.put('/api/bill_electronic/:billId', bill_electronic.update);

    // Deposite amount in bill w/ billId and customerId
    app.put('/api/bill_electronic/deposite/:billId/:custId', bill_electronic.saveDeposite);

    // Deposite amount in bill w/ billId and customerId
    app.delete('/api/bill_electronic/deposite/:billId/:depositeId', bill_electronic.deleteDeposite);

    // Delete a Bill(Electronic) with id
    app.delete('/api/bill_electronic/:billId', bill_electronic.delete);
}