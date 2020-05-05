module.exports = (app) => {
    const users = require('../controllers/user.controller') 

    // Create a new user
    app.post('/api/users', users.create);

    // Retrieve all users
    app.get('/api/users', users.findAll);

    // Verify a user
    app.put('/api/users/verify', users.verify);

    // Verify a user
    app.put('/api/users/reset', users.resetPassword);

    // Retrieve a single user with id
    app.get('/api/users/:userId', users.findOne);

    // Update a user with id
    app.put('/api/users/:userId', users.update);

    // Delete a user with id
    app.delete('/api/users/:userId', users.delete);
}