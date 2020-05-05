let mongoose = require('mongoose');
let AutoIncrement = require('mongoose-sequence')(mongoose);

let clothBillSchema = new mongoose.Schema({
    invoice_no_cloth : Number,
    invoice_date : Date,
    challan_no : Number,
    supply_date : Date,
    receiver : { type: mongoose.Schema.ObjectId, ref: 'CustomerCloth', required: true },
    consignee_name : String,
    consignee_contact :Number,
    shipped_to : {
        streetline : String,
        area : String,
        city : String,
        state : String
    },
    items : [{
        description : String,
        hsn_cd : String,
        pcs : Number,
        cut : String,
        meters : Number,
        rate : Number,
        uqc : String,
        amount : Number
    }],
    total_amount : Number,
    cgst : Number,
    sgst : Number,
    bill_amount : Number,
    in_words : String,
    due_date : Date,
    profit : Number,
    bank_detail : Boolean
})

clothBillSchema.plugin(AutoIncrement, {inc_field: 'invoice_no_cloth'});
module.exports = mongoose.model('BillCloth', clothBillSchema)