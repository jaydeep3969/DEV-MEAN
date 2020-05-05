const Bill = require('../../../models/bills/bill_automobile.model');
const Customer = require('../../../models/cutomers/cutomer_automobile.model');
const converter = require('number-to-words');
const Automobile = require('../../../models/items/automobiles.model');
const Stats = require('../../../models/stats.model');

// Create and Save a new bill
exports.create = (req, res) => {

    let customer_id;

    // Check for customer existence, if not create new else link its object id
    if (req.body.new_receiver) {
        let customer = new Customer({
            name: req.body.new_receiver.name,
            contact: req.body.new_receiver.contact,
            address: req.body.new_receiver.address,
            gst : req.body.new_receiver.gst,
            bills : []
        });

        //Save customer in DB
        customer.save()
            .then(data => {
                customer_id = String(data._id);
                console.log("Customer for automobiles successfully saved !");

                //Create A Bill
                const bill = new Bill({
                    invoice_date: req.body.invoice_date,
                    receiver: customer_id,
                    items: req.body.items,
                    total_amount: req.body.total_amount,
                    cgst: req.body.cgst,
                    sgst: req.body.sgst,
                    bill_amount: req.body.bill_amount,
                    in_words: converter.toWords(req.body.bill_amount).toUpperCase(),
                    profit: req.body.profit
                })

                //Save Bill(Cloth) in DB
                bill.save()
                    .then(data => {
                        bill_id = String(data._id);

                        //Save Bill Id to Customer
                        Customer.update(
                            { _id: customer_id },
                            { $push: { bills: bill_id } },
                            (err, numAffected) => {
                                if (err){
                                    console.log(err);
                                    return res.status(500).send({message : err});
                                }
                                else {
                                    console.log('Bill Id successfully added to customer');
                                    
                                }
                            }
                        );

                        //Update Quantity in Item(Electronic)
                        bill.items.forEach(item => {
                            Automobile.findOne({name : item.brand_name})
                                .then(brand => {
                                    var model = brand.submodels.find(m => m.name == item.model_name);
                                    model.quantity -= item.quantity;
                                    brand.save()
                                        .then(data=> {
                                            if(!data){
                                                console.log("Error");
                                                res.send({message : err});
                                                return;
                                            }

                                        })
                                        .catch(err => {
                                            res.send({message : err});
                                            return;
                                        })
                                })
                                .catch(err => {
                                    console.log(err);
                                    return res.status(500).send({message : err});
                                })
                        });

                        console.log("Quantity updated in Item(Automobile)");

                        //Update Statistics
                        var date = new Date(bill.invoice_date);
                        let year = date.getFullYear();
                        let month = date.getMonth()+1;
                        let day = date.getDate();

                        Stats.findOne({item_type : 'automobiles'})
                            .then(item_level => {
                                var year_level = item_level.value.find(y => y.year == year);
                                var month_level = year_level.value.find(m => m.month == month);
                                var day_level = month_level.value.find(d => d.day == day);
                                
                                year_level.sell += bill.total_amount;
                                year_level.profit += bill.profit;
                                month_level.sell += bill.total_amount;
                                month_level.profit += bill.profit;
                                day_level.sell += bill.total_amount;
                                day_level.profit += bill.profit;

                                item_level.save()
                                    .then(data=> {
                                        if(!data){
                                            console.log("Error");
                                            res.send({message : err});
                                            return;
                                        }

                                        console.log("Sell and Profit updated in Stats(Autmobiles)!");
                                    })
                                    .catch(err => {
                                        res.send({message : err});
                                        return;
                                    })
                            })
                            .catch(err => {
                                res.send({message : err});
                                return;
                            })

                        console.log("Bill for Automobile successfully saved !");
                        res.send(data);


                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the Bill for Automobiles !"
                        })
                    });

            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the customer"
                })
            });
    }
    else {
        customer_id = req.body.receiver;

        //Create A Bill
        const bill = new Bill({
            invoice_date: req.body.invoice_date,
            receiver: customer_id,
            items: req.body.items,
            total_amount: req.body.total_amount,
            cgst: req.body.cgst,
            sgst: req.body.sgst,
            bill_amount: req.body.bill_amount,
            in_words: converter.toWords(req.body.bill_amount).toUpperCase(),
            profit: req.body.profit
        })


        //Save Cloth in DB
        bill.save()
            .then(data => {

                bill_id = String(data._id);

                //Save Bill Id to Customer
                Customer.update(
                    { _id: customer_id },
                    { $push: { bills: bill_id } },
                    (err, numAffected) => {
                        if (err){
                            console.log(err);
                            return res.status(500).send({message: err});
                        }
                        else
                        {
                            console.log('Bill Id successfully added to customer');
                        }
                    }
                );

                 //Update Quantity in Item(Electronic)
                 bill.items.forEach(item => {
                    Automobile.findOne({name : item.brand_name})
                        .then(brand => {
                            var model = brand.submodels.find(m => m.name == item.model_name);
                            model.quantity -= item.quantity;
                            brand.save()
                                .then(data=> {
                                    if(!data){
                                        console.log("Error");
                                        res.send({message : err});
                                        return;
                                    }

                                })
                                .catch(err => {
                                    res.send({message : err});
                                    return;
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).send({message : err});
                        })
                });

                console.log("Quantity updated in Item(Automobile)");

                //Update Statistics
                var date = new Date(bill.invoice_date);
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let day = date.getDate();

                Stats.findOne({item_type : 'automobiles'})
                    .then(item_level => {
                        var year_level = item_level.value.find(y => y.year == year);
                        var month_level = year_level.value.find(m => m.month == month);
                        var day_level = month_level.value.find(d => d.day == day);
                        
                        year_level.sell += bill.total_amount;
                        year_level.profit += bill.profit;
                        month_level.sell += bill.total_amount;
                        month_level.profit += bill.profit;
                        day_level.sell += bill.total_amount;
                        day_level.profit += bill.profit;

                        item_level.save()
                            .then(data=> {
                                if(!data){
                                    console.log("Error");
                                    res.send({message : err});
                                    return;
                                }

                                console.log("Sell and Profit updated in Stats(Autmobiles)!");
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

                console.log("Bill for Automobile successfully saved !");
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Bill for Electronic"
                })
            });

    }

};


// Retrieve and return all bills from the database.
exports.findAll = (req, res) => {
    Bill.find().populate('receiver').sort({invoice_no_auto : -1})
        .then(bills => {
            console.log("Bills for Automobile successfully retrieved !");
            res.send(bills);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Bills for Automobile"
            })
        });
};


// Find a single Bill(Electronic) with a billId
exports.findOne = (req, res) => {

    Bill.findById(req.params.billId).populate('receiver')
        .then(bill => {
            if (!bill) {
                return res.status(404).send({
                    message: "Bill(Automobile) not found !"
                })
            }

            console.log("Bill(Automobile) with id successfully retrieved !");
            res.send(bill);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Bill(Automobile) not found !"
                });
            }

            return res.status(500).send({
                message: err.message || "Some error occured while retrieving Bill(Automobile) with id"
            });

        });
};

// Delete a Bill(Electronic) with the specified billId in the request
exports.delete = (req, res) => {

    Bill.findById(req.params.billId).populate('receiver')
        .then(bill => {
            if (!bill) {
                return res.status(404).send({
                    message: "Bill(Automobile) not found with this id !"
                });
            }

            //Pulling out the bill id from customer
            Customer.update({ _id: bill.receiver._id },
                { $pull: { bills: bill._id }},
                (err, numAffected) => {
                    if (err)
                        console.log(err);
                    else {
                        console.log('Bill Id successfully removed and due amount is updated from customer');
                        Bill.findByIdAndRemove(req.params.billId)
                            .then(bill => {
                                if (!bill) {
                                    return res.status(404).send({
                                        message: "Bill(Automobile) not found with this id !"
                                    });
                                }

                                
                            })
                            .catch(err => {
                                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                                    return res.status(404).send({
                                        message: "Bill(Automobile) not found with this id !"
                                    })
                                }

                                res.status(500).send({
                                    message: "Could not delete the Bill(Automobile) with this id !"
                                });
                            })
                    }
                }
            );

             //Update Quantity in Item(Electronic)
             bill.items.forEach(item => {
                Automobile.findOne({name : item.brand_name})
                    .then(brand => {
                        var model = brand.submodels.find(m => m.name == item.model_name);
                        model.quantity += item.quantity;
                        brand.save()
                            .then(data=> {
                                if(!data){
                                    console.log("Error");
                                    res.send({message : err});
                                    return;
                                }

                            })
                            .catch(err => {
                                res.send({message : err});
                                return;
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).send({message : err});
                    })
            });

            console.log("Quantity updated in Item(Automobile)");

            //Update Statistics
            var date = new Date(bill.invoice_date);
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate();

            Stats.findOne({item_type : 'automobiles'})
                .then(item_level => {
                    var year_level = item_level.value.find(y => y.year == year);
                    var month_level = year_level.value.find(m => m.month == month);
                    var day_level = month_level.value.find(d => d.day == day);
                    
                    year_level.sell -= bill.total_amount;
                    year_level.profit -= bill.profit;
                    month_level.sell-= bill.total_amount;
                    month_level.profit -= bill.profit;
                    day_level.sell -= bill.total_amount;
                    day_level.profit -= bill.profit;

                    item_level.save()
                        .then(data=> {
                            if(!data){
                                console.log("Error");
                                res.send({message : err});
                                return;
                            }

                            console.log("Sell and Profit updated in Stats(Autmobiles)!");
                        })
                        .catch(err => {
                            res.send({message : err});
                            return;
                        })
                })
                .catch(err => {
                    res.send({message : err});
                    return;
                })
            
            console.log("Bill(Automobile) successfully deleted !");
            res.send({
                message: "Bill(Automobile) successfully deleted !"
            });
        });
};