let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username : String,
    name : String,
    password : String
})

module.exports = mongoose.model('User', userSchema);