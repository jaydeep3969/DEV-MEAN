let mongoose = require('mongoose');
let AutoIncrement = require('mongoose-sequence')(mongoose);

let automobileBillSchema = new mongoose.Schema({
    invoice_no_auto : Number,
    invoice_date : Date,
    receiver : { type: mongoose.Schema.ObjectId, ref: 'CustomerAutomobile', required: true },
    items : [{
        brand_name : String,
        model_name : String,
        quantity : Number,
        sr_no : [],
        rate : Number,
        amount : Number,
        warranty_details : String
    }],
    total_amount : Number,
    cgst : Number,
    sgst : Number,
    bill_amount : Number,
    in_words : String,
    profit : Number
})

automobileBillSchema.plugin(AutoIncrement, {inc_field: 'invoice_no_auto'});
module.exports = mongoose.model('BillAutomobile', automobileBillSchema)