let mongoose = require('mongoose');

let clotheSchema = new mongoose.Schema({
    name : String,
    quantity : Number,
    pp : Number,
    date : Date
})

module.exports = mongoose.model('Clothe', clotheSchema)