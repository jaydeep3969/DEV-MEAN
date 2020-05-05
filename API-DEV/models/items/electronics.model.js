let mongoose = require('mongoose');

let electronicSchema = new mongoose.Schema({
    name : String,
    quantity : Number,
    pp : Number,
    date : Date
})

module.exports = mongoose.model('Electronic', electronicSchema)