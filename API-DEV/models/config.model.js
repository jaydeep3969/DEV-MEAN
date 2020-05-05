let mongoose = require('mongoose');

let configSchema = new mongoose.Schema({
    label : String,
    value : mongoose.Mixed
})

module.exports = mongoose.model('Config', configSchema);