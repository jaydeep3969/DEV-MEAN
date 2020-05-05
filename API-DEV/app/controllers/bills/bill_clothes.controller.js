const Bill = require('../../../models/bills/bill_clothes.model');
const Customer = require('../../../models/cutomers/customer_clothes.model')
const converter = require('number-to-words');
const Clothes = require('../../../models/items/clothes.model');
const Stats = require('../../../models/stats.model');

// Create and Save a new bill
exports.create = (req, res) => {

    let customer_id;


    // Check for customer existence, if not create new else link its object id
    if (req.body.new_receiver) {
        let customer = new Customer({
            name: req.body.new_receiver.name,
            contact: req.body.new_receiver.contact,
            gst: req.body.new_receiver.gst,
            address : req.body.new_receiver.address,
            bills : []
        });

        // console.log("-----------------------------")
        // console.log(req.body.new_receiver.name);
        // console.log("--------------------------");

        //Save customer in DB
        customer.save()
            .then(data => {
                customer_id = String(data._id);
                console.log("Customer for clothes successfully saved !");

                //Create A Bill
                const bill = new Bill({
                    invoice_date: req.body.invoice_date, //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
                    challan_no: req.body.challan_no,
                    supply_date: req.body.supply_date,
                    receiver: customer_id,
                    consignee_name: req.body.consignee_name,
                    consignee_contact : req.body.consignee_contact,
                    shipped_to: req.body.shipped_to,
                    items: req.body.items,
                    total_amount: req.body.total_amount,
                    cgst: req.body.cgst,
                    sgst: req.body.sgst,
                    bill_amount: req.body.bill_amount,
                    in_words : converter.toWords(req.body.bill_amount).toUpperCase(),
                    due_date: req.body.due_date,
                    profit : req.body.profit,
                    bank_detail : req.body.bank_detail
                })

                //Save Cloth in DB
                bill.save()
                    .then(data => {

                        console.log("Bill for Cloth successfully saved !");
                        bill_id = String(data._id);
                        
                        //Save Bill Id to Customer
                        Customer.update(
                            {_id :  customer_id},
                            { $push : { bills : bill_id}},
                            (err, numAffected) => {
                                if(err)
                                {
                                    console.log(err);
                                    res.send(err);
                                    return;
                                }
                                else
                                {
                                    console.log('Bill Id successfully added to customer');
                                }
                            }
                        );

                        //Update Quantity in Item(Cloth)
                        bill.items.forEach(item => {
                            Clothes.update(
                                {name : item.description},
                                {$inc : {quantity : item.meters * (-1)}},
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
                        console.log("Quantity updated in Item(Cloth)");

                        //Update Statistics
                        var date = new Date(bill.invoice_date);
                        let year = date.getFullYear();
                        let month = date.getMonth()+1;
                        let day = date.getDate();

                        Stats.findOne({item_type : 'clothes'})
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

                                        console.log("Sell and Profit updated in Stats(Cloth)!");
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
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: err.message || "Some error occurred while creating the Bill for Cloth"
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
            invoice_date: req.body.invoice_date, //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
            challan_no: req.body.challan_no,
            supply_date: req.body.supply_date,
            receiver: customer_id,
            consignee_name: req.body.consignee_name,
            consignee_contact : req.body.consignee_contact,
            shipped_to: req.body.shipped_to,
            items: req.body.items,
            total_amount: req.body.total_amount,
            cgst: req.body.cgst,
            sgst: req.body.sgst,
            bill_amount: req.body.bill_amount,
            in_words : converter.toWords(req.body.bill_amount).toUpperCase(),
            due_date: req.body.due_date,
            profit : req.body.profit,
            bank_detail : req.body.bank_detail
        })

        //Save Cloth in DB
        bill.save()
            .then(data => {

                console.log('Bill Id successfully added to customer');

                bill_id = String(data._id);
                
                //Save Bill Id to Customer
                Customer.update(
                    {_id :  customer_id},
                    { $push : { bills : bill_id}},
                    (err, numAffected) => {
                        if(err)
                        {
                            console.log(err);
                            res.send(err);
                            return;
                        }
                        else
                        {
                            console.log("Bill for Cloth successfully saved !");
                        }
                    }
                );

                //Update Quantity in Item(Cloth)
                bill.items.forEach(item => {
                    Clothes.update(
                        {name : item.description},
                        {$inc : {quantity : item.meters * (-1)}},
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

                console.log("Quantity updated in Item(Cloth)");

                //Update Statistics
                var date = new Date(bill.invoice_date);
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let day = date.getDate();

                Stats.findOne({item_type : 'clothes'})
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

                                console.log("Sell and Profit updated in Stats(Cloth)!");
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

                res.send(data);
                
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating the Bill for Cloth"
                })
            });

    }



};


// Retrieve and return all bills from the database.
exports.findAll = (req, res) => {
    Bill.find().populate('receiver').sort({invoice_no_cloth : -1})
        .then(bills => {
            console.log("Bills for Cloth successfully retrieved !");
            res.send(bills);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Bills for Cloth"
            })
        });
};



// Find a single Bill(Cloth) with a billId
exports.findOne = (req, res) => {

    Bill.findById(req.params.billId).populate('receiver')
        .then(bill => {
            if (!bill) {
                return res.status(404).send({
                    message: "Bill(cloth) not found !"
                })
            }

            console.log("Bill(Cloth) with id successfully retrieved !");
            res.send(bill);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Bill(Cloth) not found !"
                });
            }

            return res.status(500).send({
                message: err.message || "Some error occured while retrieving Bill(Cloth) with id"
            });

        });
};

// Update a Bill(Cloth) identified by the billId in the request
exports.updateDueDate = (req, res) => {

    //find user and update it with the request body
    Bill.findByIdAndUpdate(req.params.billId, {
        due_date: req.params.dueDate
    }, { new: true })
        .then(bill => {
            if (!bill) {
                return res.status(404).send({
                    message: "Bill(Cloth) not found with this id !"
                });
            }

            console.log("Due Date of Bill(Cloth) successfully updated !");
            res.send(bill);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Bill(Cloth) not found with this id !"
                });
            }

            res.status(500).send({
                message: err.message || "Some error occurred while updating the due date of Bill(Cloth) !"
            });
        })
};

// Update a Bill(Cloth) identified by the billId in the request
// exports.update = (req, res) => {

//     //find user and update it with the request body
//     Bill.findByIdAndUpdate(req.params.billId, {
//         invoice_no_cloth: req.body.invoice_no_cloth,
//         invoice_date: req.body.invoice_date, //new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
//         challan_no: req.body.challan_no,
//         supply_date: req.body.supply_date,
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
//                     message: "Bill(Cloth) not found with this id !"
//                 });
//             }

//             console.log("Bill(Cloth) successfully updated !");
//             res.send(bill);
//         })
//         .catch(err => {
//             if (err.kind === 'ObjectId') {
//                 return res.status(404).send({
//                     message: "Bill(Cloth) not found with this id !"
//                 });
//             }

//             res.status(500).send({
//                 message: err.message || "Some error occurred while updating the Bill(Cloth) !"
//             });
//         })
// };



// Delete a Bill(Cloth) with the specified billId in the request
exports.delete = (req, res) => {

    Bill.findById(req.params.billId).populate('receiver')
        .then(bill => {
            if (!bill) {
                return res.status(404).send({
                    message: "Bill(Clothes) not found with this id !"
                });
            }

            //Pulling out the bill id from customer
            Customer.update({ _id: bill.receiver._id },
                { $pull: { bills: bill._id } },
                (err, numAffected) => {
                    if (err)
                        console.log(err);
                    else {
                        console.log('Bill Id successfully removed from customer');
                        Bill.findByIdAndRemove(req.params.billId)
                            .then(bill => {
                                if (!bill) {
                                    return res.status(404).send({
                                        message: "Bill(Cloth) not found with this id !"
                                    });
                                }

                                console.log("Bill(Cloth) successfully deleted !");

                                //Update Quantity in Item(Cloth)
                                bill.items.forEach(item => {
                                    Clothes.update(
                                        {name : item.description},
                                        {$inc : {quantity : item.meters}},
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

                                console.log("Quantity updated in Item(Cloth)");

                                //Update Statistics
                                var date = new Date(bill.invoice_date);
                                let year = date.getFullYear();
                                let month = date.getMonth()+1;
                                let day = date.getDate();

                                Stats.findOne({item_type : 'clothes'})
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

                                                console.log("Sell and Profit updated in Stats(Cloth)!");
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
                                res.send({
                                    message: "Bill(Cloth) successfully deleted !"
                                });
                            })
                            .catch(err => {
                                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                                    return res.status(404).send({
                                        message: "Bill(Cloth) not found with this id !"
                                    })
                                }

                                res.status(500).send({
                                    message: "Could not delete the Bill(Cloth) with this id !"
                                });
                            })
                    }
                }
            )
        });

    
};