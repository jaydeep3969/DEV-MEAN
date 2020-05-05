let mongoose = require('mongoose');

let automobileSchema = new mongoose.Schema({
    name : String,
    submodels : [
                   { 
                    name : String,
                    quantity : Number,
                    pp : Number,
                    date : Date}
                ]
})

module.exports = mongoose.model('Automobile', automobileSchema);







