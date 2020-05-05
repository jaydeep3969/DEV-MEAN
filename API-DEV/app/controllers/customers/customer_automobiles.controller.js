const Customer = require('../../../models/cutomers/cutomer_automobile.model');

// Create and Save a new customer for electronics
exports.create = (req, res) => {

    // Create a customer

    let customer = new Customer({
        name :req.body.name,
        contact : req.body.contact,
        address : req.body.address,
        gst : req.body.gst,
        bills : []
    }); 

    //Save customer in DB
    customer.save()
        .then( data => {
            console.log("Customer for automobiles successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating the customer for automobiles"
            })
        });
};


// Retrieve and return all customers from the database.
exports.findAll = (req, res) => {
    Customer.find().populate('bills')
        .then( customers => {
            console.log("Customers for automobiles successfully retrieved !");
            res.send(customers);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving Customers for automobiles"
            })            
        });
};


// Find a single customer(Automobile) with a customerId
exports.findOne = (req, res) => {

    Customer.findById(req.params.customerId).populate('bills')
        .then( customer => {
            if(!customer)
            {
                return res.status(404).send({
                    message : "Customer(Automobile) not found !"
                })
            }

            console.log("Customer(Automobile) with id successfully retrieved !");
            res.send(customer);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Customer(Automobile) not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving customer(Automobile) with id"
            });
            
        });
};


// Update a customer(Automobile) identified by the customerId in the request
exports.update = (req, res) => {

    //find customer(Ele) and update it with the request body
    Customer.findByIdAndUpdate( req.params.customerId, {
        name : req.body.name,
        contact : req.body.contact,
        address : req.body.address,
        gst : req.body.gst
    }, {new : true})
        .then(customer => {
            if(!customer) {
                return res.status(404).send({
                    message : "Customer(Automobile) not found with this id !"
                });
            }

            console.log("Customer(Automobile) successfully updated !");
            res.send(customer);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Customer(Automobile) not found with this id !"
                });
            }

            res.status(500).send({
                message : err.message || "Some error occurred while updating the Customer(Automobile) !"
            });
        })
};



// Delete a customer(Automobile) with the specified customerId in the request
exports.delete = (req, res) => {
    Customer.findByIdAndRemove(req.params.customerId)
        .then(customer => {
            if(!customer) {
                return res.status(404).send({
                    message : "Customer(Automobile) not found with this id !"
                });
            }

            console.log("Customer(Automobile) successfully deleted !");
            res.send({
                message : "Customer(Automobile) successfully deleted !"
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound'){
                return res.status(404).send({
                    message : "Customer(Automobile) not found with this id !"
                })
            }

            res.status(500).send({
                message : "Could not delete the Customer(Automobile) with this id !"
            });     
        })
};
