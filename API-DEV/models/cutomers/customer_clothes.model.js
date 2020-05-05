let mongoose = require('mongoose');

let clothCustomerSchema = new mongoose.Schema({
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
        { type: mongoose.Schema.ObjectId, ref: 'BillCloth' }
    ]
})

module.exports = mongoose.model('CustomerCloth', clothCustomerSchema)