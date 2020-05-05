const Expense = require('../../models/other_expense.model')
const Stats = require('../../models/stats.model');

// Create and Save a new Expense
exports.create = (req, res) => {

    // Create an Expense
    const expense = new Expense({
        name : req.body.name,
        details : req.body.details,
        amount : req.body.amount,
        date : req.body.date
    })

    //Save Expense in DB
    expense.save()
        .then( data => {

             //Update Statistics
             var date = new Date(data.date);
             let year = date.getFullYear();
             let month = date.getMonth()+1;
             let day = date.getDate();

             Stats.findOne({item_type : 'clothes'})
                 .then(item_level => {
                     var year_level = item_level.value.find(y => y.year == year);
                     var month_level = year_level.value.find(m => m.month == month);
                     var day_level = month_level.value.find(d => d.day == day);
                     
                     year_level.expense += data.amount;
                     month_level.expense += data.amount;
                     day_level.expense += data.amount;

                     item_level.save()
                         .then(data=> {
                             if(!data){
                                 console.log("Error");
                                 res.send({message : err});
                                 return;
                             }

                             console.log("Expense updated in Stats!");
                         })
                         .catch(err => {
                             console.log(err);
                             res.send({message : err});
                             return;
                         })
                 })
                 .catch(err => {
                     console.log(err);
                     res.send({message : err});
                     return;
                 })

            console.log("Expense successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating the Expense"
            })
        });
};


// Retrieve and return all Expenses from the database.
exports.findAll = (req, res) => {
    Expense.find().sort({date : -1})
        .then( expenses => {
            console.log("Expenses successfully retrieved !");
            res.send(expenses);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving Expenses"
            })            
        });
};

// Retrieve All Expenses using date
exports.findAllByDate = (req, res) => {
    Expense.find().select({'date' :  req.params.date})
        .then( expenses => {
            console.log("Expenses successfully retrieved !");
            res.send(expenses);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving Expenses"
            })            
        });
}


// Find a single expense with a expenseId
exports.findOne = (req, res) => {

    Expense.findById(req.params.expenseId)
        .then( expense => {
            if(!expense)
            {
                return res.status(404).send({
                    message : "Expense not found !"
                })
            }

            console.log("Expense with id successfully retrieved !");
            res.send(expense);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Expense not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving expense with id"
            });
            
        });
};


// Update an expense identified by the expenseId in the request
exports.update = (req, res) => {

    Expense.findById(req.params.expenseId)
        .then( expense => {
            if(!expense)
            {
                return res.status(404).send({
                    message : "Expense not found !"
                })
            }

            let amount_diff = req.body.amount - expense.amount;

            //find user and update it with the request body
            Expense.findByIdAndUpdate( req.params.expenseId, {
                name : req.body.name,
                details : req.body.details,
                amount : req.body.amount,
                date : req.body.date
            }, {new : true})
                .then(expense => {
                    if(!expense) {
                        return res.status(404).send({
                            message : "Expense not found with this id !"
                        });
                    }

                    //Update Statistics
                    var date = expense.date;
                    let year = date.getFullYear();
                    let month = date.getMonth()+1;
                    let day = date.getDate();

                    Stats.findOne({item_type : 'clothes'})
                        .then(item_level => {
                            var year_level = item_level.value.find(y => y.year == year);
                            var month_level = year_level.value.find(m => m.month == month);
                            var day_level = month_level.value.find(d => d.day == day);
                            
                            year_level.expense += amount_diff;
                            month_level.expense += amount_diff;
                            day_level.expense += amount_diff;

                            item_level.save()
                                .then(data=> {
                                    if(!data){
                                        console.log("Error");
                                        res.send({message : err});
                                        return;
                                    }

                                    console.log("Expense updated in Stats!");
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.send({message : err});
                                    return;
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            res.send({message : err});
                            return;
                        })

                    console.log("Expense successfully updated !");
                    res.send(expense);
                })
                .catch(err => {
                    if(err.kind === 'ObjectId'){
                        return res.status(404).send({
                            message : "Expense not found with this id !"
                        });
                    }

                    res.status(500).send({
                        message : err.message || "Some error occurred while updating the expense !"
                    });
                })

            console.log("Expense with id successfully retrieved !");
            res.send(expense);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Expense not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving expense with id"
            });
            
        });
    
};


// Delete an expense with the specified expenseId in the request
exports.delete = (req, res) => {
    Expense.findByIdAndRemove(req.params.expenseId)
        .then(expense => {
            if(!expense) {
                return res.status(404).send({
                    message : "Expense not found with this id !"
                });
            }

            //Update Statistics
            var date = expense.date;
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();

            Stats.findOne({item_type : 'clothes'})
                .then(item_level => {
                    var year_level = item_level.value.find(y => y.year == year);
                    var month_level = year_level.value.find(m => m.month == month);
                    var day_level = month_level.value.find(d => d.day == day);
                    
                    year_level.expense -= expense.amount;
                    month_level.expense -= expense.amount;
                    day_level.expense -= expense.amount;

                    item_level.save()
                        .then(data=> {
                            if(!data){
                                console.log("Error");
                                res.send({message : err});
                                return;
                            }

                            console.log("Expense updated in Stats!");
                        })
                        .catch(err => {
                            console.log(err);
                            res.send({message : err});
                            return;
                        })
                })
                .catch(err => {
                    console.log(err);
                    res.send({message : err});
                    return;
                })

            console.log("Expense successfully deleted !");
            res.send({
                message : "Expense successfully deleted !"
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound'){
                return res.status(404).send({
                    message : "Expense not found with this id !"
                })
            }

            res.status(500).send({
                message : "Could not delete the expense with this id !"
            });     
        })
};

