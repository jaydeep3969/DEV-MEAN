let mongoose = require('mongoose');

let statsSchema = new mongoose.Schema({
    item_type : String,
    value : [ {
                year : Number,
                profit : Number,
                sell : Number,
                purchase : Number,
                expense : Number,
                value : [
                    {
                        month : Number,
                        profit : Number,
                        sell : Number,
                        purchase : Number,
                        expense : Number,
                        value : [
                            {
                                day : Number,
                                profit : Number,
                                sell : Number,
                                purchase : Number,
                                expense : Number
                            }
                        ]
                    }
                ]
             }
        ]
})

module.exports = mongoose.model('Statistic', statsSchema);







