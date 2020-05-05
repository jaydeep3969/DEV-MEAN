let mongoose = require('mongoose');

let addressSchema = new mongoose.Schema({
    streetline : String,
    city : String,
    state : String
})

module.exports = mongoose.model('Address', addressSchema);