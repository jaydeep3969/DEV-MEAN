let mongoose = require('mongoose');

let otherExpenseSchema = new mongoose.Schema({
    name : String,
    details : String,
    amount : Number,
    date : Date
})

module.exports = mongoose.model('OtherExpense', otherExpenseSchema);