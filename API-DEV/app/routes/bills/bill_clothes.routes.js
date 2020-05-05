module.exports = (app) => {
    const bill_cloth = require('../../controllers/bills/bill_clothes.controller') ;

    // Create a new Bill(Cloth)
    app.post('/api/bill_cloth', bill_cloth.create);

    // Retrieve all Bills(Cloth)
    app.get('/api/bill_cloth', bill_cloth.findAll);

    // Retrieve a single Bill(Cloth) with id
    app.get('/api/bill_cloth/:billId', bill_cloth.findOne);

    // Update a Bill(Cloth) with id
    app.put('/api/bill_cloth/:billId/:dueDate', bill_cloth.updateDueDate);

    // Update a Bill(Cloth) with id
    // app.put('/api/bill_cloth/:billId', bill_cloth.update);

    // Delete a Bill(Cloth) with id
    app.delete('/api/bill_cloth/:billId', bill_cloth.delete);
}