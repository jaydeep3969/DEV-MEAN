let mongoose = require('mongoose');

let electronicCustomerSchema = new mongoose.Schema({
    name : String,
    contact : Number,
    gst : String,
    address : {
        streetline : String,
        area : String,
        city : String,
        state : String
    },
    due_amount : Number,
    bills : [
        { type: mongoose.Schema.ObjectId, ref: 'BillElectronic' }
    ]
})

module.exports = mongoose.model('CustomerElectronic', electronicCustomerSchema)