let mongoose = require('mongoose');

let automobileCustomerSchema = new mongoose.Schema({
    name : String,
    contact : Number,
    gst : String,
    address : {
        streetline : String,
        area : String,
        city : String,
        state : String
    },
    bills : [
        { type: mongoose.Schema.ObjectId, ref: 'BillAutomobile' }
    ]
})

module.exports = mongoose.model('CustomerAutomobile', automobileCustomerSchema)