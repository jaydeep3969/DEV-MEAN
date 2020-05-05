const Stats = require('../../models/stats.model')

exports.create = (req, res) => {

    // Create an Expense
    const stats = new Stats({
        item_type : req.body.item_type,
        value : req.body.value
    })

    //Save Expense in DB
    stats.save()
        .then( data => {
            console.log("Stats successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating the Stats"
            })
        });
};

// Retrieve and return all Expenses from the database.
exports.findAll = (req, res) => {
    Stats.find()
        .then( stats => {
            console.log("Stats successfully retrieved !");
            res.send(stats);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving stats"
            })            
        });
};

