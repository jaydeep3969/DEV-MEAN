module.exports = (app) => {
    const expenses = require('../controllers/other_expense.controller') 

    // Create a new expense
    app.post('/api/expenses', expenses.create);

    // Retrieve all expenses
    app.get('/api/expenses', expenses.findAll);

    // Retrieve all expenses by date
    app.get('/api/expenses/:date', expenses.findAllByDate);

    // Retrieve a single expense with id
    app.get('/api/expenses/:expenseId', expenses.findOne);

    // Update an expense with id
    app.put('/api/expenses/:expenseId', expenses.update);

    // Delete an expense with id
    app.delete('/api/expenses/:expenseId', expenses.delete);
}