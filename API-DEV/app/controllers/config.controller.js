const Config = require('../../models/config.model');

// Create and Save a new config
exports.create = (req, res) => {

    // Create a config

    let config = new Config({
        label :req.body.label,
        value : req.body.value
    }); 

    //Save config in DB
    config.save()
        .then( data => {
            console.log("Config successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating the config"
            })
        });
};


// Retrieve and return all config from the database.
exports.findAll = (req, res) => {
    Config.find()
        .then( configs => {
            console.log("Configs successfully retrieved !");
            res.send(configs);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving configs"
            })            
        });
};



// Find a single Config with a ConfigId
exports.findOne = (req, res) => {

    Config.findById(req.params.configId)
        .then( config => {
            if(!config)
            {
                return res.status(404).send({
                    message : "Config not found !"
                })
            }

            console.log("Config with id successfully retrieved !");
            res.send(config);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Config not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving Config with id"
            });
            
        });
};



//find a config by name
exports.findOneByName = (req, res) => {
    Config.findOne({ 'label' : req.params.configName })
        .then( config => {
            if(!config)
            {
                return res.status(404).send({
                    message : "Config not found !"
                })
            }

            console.log("Config with name successfully retrieved !");
            res.send(config);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Config not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving Config with name"
            });
            
        });
};



// Update a Config identified by the configId in the request
exports.update = (req, res) => {

    //find Config and update it with the request body
    Config.findByIdAndUpdate( req.params.configId, {
        label : req.body.label,
        value : req.body.value
    }, {new : true})
        .then(config => {
            if(!config) {
                return res.status(404).send({
                    message : "Config not found with this id !"
                });
            }

            console.log("Config successfully updated !");
            res.send(config);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Config not found with this id !"
                });
            }

            res.status(500).send({
                message : err.message || "Some error occurred while updating the Config !"
            });
        })
};


// update config value by name
// exports.updateByName = (req,res) => {
//     Config.findOneAndUpdate(
//         {'label' : req.body.label },
//         { $set : { 'value' : req.body.value}},
//         {new : true}
//     )
//      .then(config => {
//         if(!config) {
//             return res.status(404).send({
//                 message : "Config not found with this id !"
//             });
//         }

//         console.log("Config successfully updated !");
//         res.send(config);
//     })
//      .catch(err => {
//         if(err.kind === 'ObjectId'){
//             return res.status(404).send({
//                 message : "Config not found with this id !"
//             });
//         }

//         res.status(500).send({
//             message : err.message || "Some error occurred while updating the Config !"
//         });
//     })
// }

// Delete a config with the specified configId in the request
exports.delete = (req, res) => {
    Config.findByIdAndRemove(req.params.configId)
        .then(config => {
            if(!config) {
                return res.status(404).send({
                    message : "Config not found with this id !"
                });
            }

            console.log("Config successfully deleted !");
            res.send({
                message : "Config successfully deleted !"
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound'){
                return res.status(404).send({
                    message : "Config not found with this id !"
                })
            }

            res.status(500).send({
                message : "Could not delete the Config with this id !"
            });     
        })
};


