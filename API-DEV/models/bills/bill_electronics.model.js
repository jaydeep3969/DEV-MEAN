let mongoose = require('mongoose');
let AutoIncrement = require('mongoose-sequence')(mongoose);

let electronicsBillSchema = new mongoose.Schema({
    invoice_no_ele : Number,
    invoice_date : Date,
    receiver : { type: mongoose.Schema.ObjectId, ref: 'CustomerElectronic', required: true },
    items : [{
        product_name : String,
        quantity : Number,
        sr_no : [],
        model_no : String,
        rate : Number,
        amount : Number,
        warranty_details : String
    }],
    total_amount : Number,
    cgst : Number,
    sgst : Number,
    bill_amount : Number,
    in_words : String,
    profit : Number,
    deposite : [{
        name : String,
        amount : Number,
        date : Date
    }],
    due_amount : Number,
    bank_detail : Boolean
})

electronicsBillSchema.plugin(AutoIncrement, {inc_field: 'invoice_no_ele'});
module.exports = mongoose.model('BillElectronic', electronicsBillSchema)