const Bill = require('../../../models/bills/bill_electronics.model');
const Customer = require('../../../models/cutomers/cutomer_electronics.model');
const Electronic = require('../../../models/items/electronics.model');
const Stats = require('../../../models/stats.model');
const converter = require('number-to-words');

// Create and Save a new bill
exports.create = (req, res) => {

    let customer_id;

    // Check for customer existence, if not create new else link its object id
    if (req.body.new_receiver) {
        let customer = new Customer({
            name: req.body.new_receiver.name,
            contact: req.body.new_receiver.contact,
            gst: req.body.new_receiver.gst,
            address: req.body.new_receiver.address,
            due_amount: req.body.due_amount,
            bills: []
        });

        // console.log("-----------------------------")
        // console.log(req.body.new_receiver.name);
        // console.log("--------------------------");

        //Save customer in DB
        customer.save()
            .then(data => {
                customer_id = String(data._id);
                console.log("Customer for electronics successfully saved !");

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
                    profit: req.body.profit,
                    deposite: req.body.deposite,
                    due_amount: req.body.due_amount,
                    bank_detail : req.body.bank_detail
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
                                if (err)
                                {
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
                            Electronic.update(
                                {name : item.product_name},
                                {$inc : {quantity : item.quantity * (-1)}},
                                (err, numAffected) => {
                                    if(err)
                                    {
                                        console.log(err);
                                        res.send(err);
                                        return;
                                    }
                                }
                            )
                        });

                        console.log("Quantity updated in Item(Electronic)");

                        //Update Statistics
                        var date = new Date(bill.invoice_date);
                        let year = date.getFullYear();
                        let month = date.getMonth()+1;
                        let day = date.getDate();

                        Stats.findOne({item_type : 'electronics'})
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

                                        console.log("Sell and Profit updated in Stats(Electronic)!");
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

                        console.log("Bill for Electronic successfully saved !");
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the Bill for Electronic"
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
            profit: req.body.profit,
            deposite: req.body.deposite,
            due_amount: req.body.due_amount,
            bank_detail : req.body.bank_detail
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
                        if (err)
                            console.log(err);
                        else
                            console.log('Bill Id successfully added to customer');
                    }
                );

                if (bill.due_amount != 0) {
                    //update due_amount in customer
                    Customer.findOneAndUpdate(
                        { _id: customer_id },
                        { $inc: { due_amount: bill.due_amount } },
                        (err, numAffected) => {
                            if (err)
                            {
                                console.log(err);
                                return res.status(500).send({message : err});
                            }
                            else {
                                console.log('Due Amount successfully added to customer');
                            }
                        }
                    );
                }

                //Update Quantity in Item(Electronic)
                bill.items.forEach(item => {
                    Electronic.update(
                        {name : item.product_name},
                        {$inc : {quantity : item.quantity * (-1)}},
                        (err, numAffected) => {
                            if(err)
                            {
                                console.log(err);
                                res.send(err);
                                return;
                            }
                        }
                    )
                });

                console.log("Quantity updated in Item(Electronic)");

                //Update Statistics
                var date = new Date(bill.invoice_date);
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let day = date.getDate();

                Stats.findOne({item_type : 'electronics'})
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

                                console.log("Sell and Profit updated in Stats(Electronic)!");
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

                console.log("Bill for Electronic successfully saved !");
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
    Bill.find().populate('receiver').sort({invoice_no_ele : -1})
        .then(bills => {
            console.log("Bills for Electronic successfully retrieved !");
            res.send(bills);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Bills for Electronic"
            })
        });
};


// Find a single Bill(Electronic) with a billId
exports.findOne = (req, res) => {

    Bill.findById(req.params.billId).populate('receiver')
        .then(bill => {
            if (!bill) {
                return res.status(404).send({
                    message: "Bill(Electronic) not found !"
                })
            }

            console.log("Bill(Electronic) with id successfully retrieved !");
            res.send(bill);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Bill(Electronic) not found !"
                });
            }

            return res.status(500).send({
                message: err.message || "Some error occured while retrieving Bill(Electronic) with id"
            });

        });
};


// Update a Bill(Electronic) identified by the billId in the request
// exports.update = (req, res) => {

//     //find user and update it with the request body
//     Bill.findByIdAndUpdate(req.params.billId, {
//         invoice_no_ele: req.body.invoice_no_ele,
//         invoice_date: req.body.invoice_date,
//         receiver: customer_id,
//         billed_to: req.body.billed_to,
//         consignee_name: req.body.consignee_name,
//         consignee_contact : req.body.consignee_contact,
//         shipped_to: req.body.shipped_to,
//         items: req.body.items,
//         total_amount: req.body.total_amount,
//         cgst: req.body.cgst,
//         sgst: req.body.sgst,
//         bill_amount: req.body.bill_amount,
//         in_words : converter.toWords(req.body.bill_amount).toUpperCase(),
//         due_date: req.body.due_date
//     }, { new: true })
//         .then(bill => {
//             if (!bill) {
//                 return res.status(404).send({
//                     message: "Bill(Electronic) not found with this id !"
//                 });
//             }

//             console.log("Bill(Electronic) successfully updated !");
//             res.send(bill);
//         })
//         .catch(err => {
//             if (err.kind === 'ObjectId') {
//                 return res.status(404).send({
//                     message: "Bill(Electronic) not found with this id !"
//                 });
//             }

//             res.status(500).send({
//                 message: err.message || "Some error occurred while updating the Bill(Electronic) !"
//             });
//         })
// };


// Delete a Bill(Electronic) with the specified billId in the request
exports.delete = (req, res) => {

    Bill.findById(req.params.billId).populate('receiver')
        .then(bill => {
            if (!bill) {
                return res.status(404).send({
                    message: "Bill(Electronic) not found with this id !"
                });
            }

            //Pulling out the bill id an dupdate due amount from customer
            Customer.update({ _id: bill.receiver._id },
                { $pull: { bills: bill._id }, $inc: { due_amount: ((-1) * bill.due_amount) } },
                (err, numAffected) => {
                    if (err)
                        console.log(err);
                    else {
                        console.log('Bill Id successfully removed and due amount is updated from customer');
                        Bill.findByIdAndRemove(req.params.billId)
                            .then(bill => {
                                if (!bill) {
                                    return res.status(404).send({
                                        message: "Bill(Electronic) not found with this id !"
                                    });
                                }


                                //Update Quantity in Item(Electronic)
                                bill.items.forEach(item => {
                                    Electronic.update(
                                        {name : item.product_name},
                                        {$inc : {quantity : item.quantity}},
                                        (err, numAffected) => {
                                            if(err)
                                            {
                                                console.log(err);
                                                res.send(err);
                                                return;
                                            }
                                        }
                                    )
                                });

                                console.log("Quantity updated in Item(Electronic)");

                                //Update Statistics
                                var date = new Date(bill.invoice_date);
                                let year = date.getFullYear();
                                let month = date.getMonth()+1;
                                let day = date.getDate();

                                Stats.findOne({item_type : 'electronics'})
                                    .then(item_level => {
                                        var year_level = item_level.value.find(y => y.year == year);
                                        var month_level = year_level.value.find(m => m.month == month);
                                        var day_level = month_level.value.find(d => d.day == day);
                                        
                                        year_level.sell -= bill.total_amount;
                                        year_level.profit -= bill.profit;
                                        month_level.sell -= bill.total_amount;
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

                                                console.log("Sell and Profit updated in Stats(Electronic)!");
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

                                console.log("Bill(Electronic) successfully deleted !");
                                res.send({
                                    message: "Bill(Electronic) successfully deleted !"
                                });
                            })
                            .catch(err => {
                                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                                    return res.status(404).send({
                                        message: "Bill(Electronic) not found with this id !"
                                    })
                                }

                                res.status(500).send({
                                    message: "Could not delete the Bill(Electronic) with this id !"
                                });
                            })
                    }
                }
            );
        });


};



// Deposite Amount in Bill(Electronic)
exports.saveDeposite = (req, res) => {

    let new_deposite = {
        name: req.body.name,
        amount: req.body.amount,
        date: req.body.date
    }

    Bill.update(
        { _id: req.params.billId },
        {
            $push: { deposite: new_deposite },
            $inc: { due_amount: req.body.amount * (-1) }
        },
        (err, numAffected) => {
            if (err)
                console.log(err);
            else {
                console.log("Deposite for Bill(Electronic) is successfully updated !");
                Customer.findOneAndUpdate(
                    { _id: req.params.custId },
                    { $inc: { due_amount: req.body.amount * (-1) } },
                    (err, numAffected) => {
                        if (err)
                            console.log(err);
                        else {
                            console.log('Due Amount successfully updated to customer');
                            res.send({
                                message: "Deposite Successfully Saved !"
                            });
                        }
                    }
                );
            }
        }
    );
}


// Delete Deposite in Bill(Electronic)
exports.deleteDeposite = (req, res) => {

    Bill.findById(req.params.billId).populate('receiver')
        .then(bill => {
            if (!bill) {
                return res.status(404).send({
                    message: "Bill(Electronic) not found with this id !"
                });
            }

            bill.deposite.forEach(dep => {
                if (dep._id == req.params.depositeId) {
                   let dep_amount = dep.amount;

                    Bill.update(
                        { _id: req.params.billId },
                        {
                            $pull: { deposite: dep},
                            $inc: { due_amount: dep_amount }
                        },
                        (err, numAffected) => {
                            if (err)
                                console.log(err);
                            else {
                                console.log("Deposite for Bill(Electronic) is successfully updated !");
                                Customer.findOneAndUpdate(
                                    { _id: bill.receiver._id },
                                    { $inc: { due_amount: dep_amount } },
                                    (err, numAffected) => {
                                        if (err)
                                            console.log(err);
                                        else {
                                            console.log('Due Amount successfully updated to customer');
                                            res.send({
                                                message: "Deposite Successfully Deleted !"
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    )
                }
            });
        })
}