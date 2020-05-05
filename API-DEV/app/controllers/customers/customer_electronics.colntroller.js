const Customer = require('../../../models/cutomers/cutomer_electronics.model');

// Create and Save a new customer for electronics
exports.create = (req, res) => {

    // Create a customer

    let customer = new Customer({
        name :req.body.name,
        contact : req.body.contact,
        gst : req.body.gst,
        address : req.body.address,
        due_amount : 0,
        bills : []
    }); 

    //Save customer in DB
    customer.save()
        .then( data => {
            console.log("Customer for electronics successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating the customer for electronics"
            })
        });
};


// Retrieve and return all customers from the database.
exports.findAll = (req, res) => {
    Customer.find().populate('bills')
        .then( customers => {
            console.log("Customers for electronics successfully retrieved !");
            res.send(customers);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving Customers for electronics"
            })            
        });
};


// Find a single customer(Ele) with a customerId
exports.findOne = (req, res) => {

    Customer.findById(req.params.customerId).populate('bills')
        .then( customer => {
            if(!customer)
            {
                return res.status(404).send({
                    message : "Customer(Ele) not found !"
                })
            }

            console.log("Customer(Ele) with id successfully retrieved !");
            res.send(customer);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Customer(Ele) not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving customer(Ele) with id"
            });
            
        });
};


// Update a customer(Ele) identified by the customerId in the request
exports.update = (req, res) => {

    //find customer(Ele) and update it with the request body
    Customer.findByIdAndUpdate( req.params.customerId, {
        name : req.body.name,
        contact : req.body.contact,
        gst : req.body.gst,
        address : req.body.address,
        due_amount : req.body.due_amount
    }, {new : true})
        .then(customer => {
            if(!customer) {
                return res.status(404).send({
                    message : "Customer(Ele) not found with this id !"
                });
            }

            console.log("Customer(Ele) successfully updated !");
            res.send(customer);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Customer(Ele) not found with this id !"
                });
            }

            res.status(500).send({
                message : err.message || "Some error occurred while updating the Customer(Ele) !"
            });
        })
};



// Delete a customer(Ele) with the specified customerId in the request
exports.delete = (req, res) => {
    Customer.findByIdAndRemove(req.params.customerId)
        .then(customer => {
            if(!customer) {
                return res.status(404).send({
                    message : "Customer(Ele) not found with this id !"
                });
            }

            console.log("Customer(Ele) successfully deleted !");
            res.send({
                message : "Customer(Ele) successfully deleted !"
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound'){
                return res.status(404).send({
                    message : "Customer(Ele) not found with this id !"
                })
            }

            res.status(500).send({
                message : "Could not delete the Customer(Ele) with this id !"
            });     
        })
};
