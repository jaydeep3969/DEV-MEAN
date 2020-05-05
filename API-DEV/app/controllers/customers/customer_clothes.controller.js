const Customer = require('../../../models/cutomers/customer_clothes.model');

// Create and Save a new customer for clothes
exports.create = (req, res) => {

    // Create a customer

    let customer = new Customer({
        name :req.body.name,
        contact : req.body.contact,
        gst : req.body.gst,
        address : req.body.address,
        bills : []
    }); 

    //Save customer in DB
    customer.save()
        .then( data => {
            console.log("Customer for clothes successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating the customer"
            })
        });
};



// Retrieve and return all customers from the database.
exports.findAll = (req, res) => {
    Customer.find().populate('bills')
        .then( customers => {
            console.log("Customers for clothes successfully retrieved !");
            res.send(customers);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving Customers for clothes"
            })            
        });
};



// Find a single customer with a customerId
exports.findOne = (req, res) => {

    Customer.findById(req.params.customerId).populate('bills')
        .then( customer => {
            if(!customer)
            {
                return res.status(404).send({
                    message : "Customer(Cloth) not found !"
                })
            }

            console.log("Customer(Cloth) with id successfully retrieved !");
            res.send(customer);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Customer(Cloth) not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving customer(Cloth) with id"
            });
            
        });
};



// Update a customer(Cloth) identified by the customerId in the request
exports.update = (req, res) => {

    //find customer(Cloth) and update it with the request body
    Customer.findByIdAndUpdate( req.params.customerId, {
        name : req.body.name,
        contact : req.body.contact,
        gst : req.body.gst,
        address : req.body.address
    }, {new : true})
        .then(customer => {
            if(!customer) {
                return res.status(404).send({
                    message : "Customer(Cloth) not found with this id !"
                });
            }

            console.log("Customer(Cloth) successfully updated !");
            res.send(customer);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Customer(Cloth) not found with this id !"
                });
            }

            res.status(500).send({
                message : err.message || "Some error occurred while updating the Customer(Cloth) !"
            });
        })
};



// Delete a customer(Cloth) with the specified customerId in the request
exports.delete = (req, res) => {
    Customer.findByIdAndRemove(req.params.customerId)
        .then(customer => {
            if(!customer) {
                return res.status(404).send({
                    message : "Customer(Cloth) not found with this id !"
                });
            }

            console.log("Customer(Cloth) successfully deleted !");
            res.send({
                message : "Customer(Cloth) successfully deleted !"
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound'){
                return res.status(404).send({
                    message : "Customer(Cloth) not found with this id !"
                })
            }

            res.status(500).send({
                message : "Could not delete the Customer with this id !"
            });     
        })
};