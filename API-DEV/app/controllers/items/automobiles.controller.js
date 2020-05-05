const Automobile = require('../../../models/items/automobiles.model')
const Stats = require('../../../models/stats.model');

// Create and Save a new brand
exports.create = (req, res) => {

    //Create a brand
    const brand = new Automobile({
        name : req.body.name,
        submodels : req.body.submodels
    })

    //Save Automobile in DB
    brand.save()
        .then( data => {
            console.log("Brand successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating the brand-item"
            })
        });
};


// Create and Save a submodel
exports.createModel = (req, res) => {

    let today = new Date().toLocaleDateString().split('/');
    let month  = today[0] - '0';
    let day  = today[1] - '0';
    let year  = today[2] - '0';
    let date = new Date(year, month-1, day+1);

    //Create a brand
    const model = {
        name : req.body.name,
        quantity : req.body.quantity,
        pp : req.body.pp,
        date : date
    };

    Automobile.update(
        {_id :  req.params.brandId},
        { $push : { submodels : model}},
        (err, numAffected) => {
            if(err)
            {
                console.log(err);
                res.send(err);
                return;
            }
            else
            {
                //Update Statistics
                Stats.findOne({item_type : 'automobiles'})
                .then(item_level => {
                    var year_level = item_level.value.find(y => y.year == year);
                    var month_level = year_level.value.find(m => m.month == month);
                    var day_level = month_level.value.find(d => d.day == day);
                    
                    year_level.purchase += (model.pp * model.quantity);
                    month_level.purchase += (model.pp * model.quantity);
                    day_level.purchase += (model.pp * model.quantity);

                    item_level.save()
                        .then(data=> {
                            if(!data){
                                console.log("Error");
                                res.send({message : err});
                                return;
                            }

                            console.log("Purchase updated in Stats(Electronic)!");
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
                res.send({message : "Model Successfully Saved !"});
                console.log("Model successfully saved !");
            }
        }
    );
};


// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    Automobile.find()
        .then( automobiles => {
            console.log("Automobiles successfully retrieved !");
            res.send(automobiles);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving automobiles"
            })            
        });
};


// Find a single automobile with a userId
exports.findOne = (req, res) => {

    Automobile.findById(req.params.automobileId)
        .then( automobile => {
            if(!automobile)
            {
                return res.status(404).send({
                    message : "Automobile not found !"
                })
            }

            console.log("Automobile with id successfully retrieved !");
            res.send(automobile);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Automobile not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving automobile with id"
            });
            
        });
};



// Update a automobile identified by the userId in the request
exports.update = (req, res) => {

    //find user and update it with the request body
    Automobile.findByIdAndUpdate( req.params.automobileId, {
        name : req.body.name,
        submodels : req.body.submodels
    }, {new : true})
        .then(automobile => {
            if(!automobile) {
                return res.status(404).send({
                    message : "Automobile not found with this id !"
                });
            }

            console.log("Automobile successfully updated !");
            res.send(automobile);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Automobile not found with this id !"
                });
            }

            res.status(500).send({
                message : err.message || "Some error occurred while updating the automobile !"
            });
        })
};


// Update model 
exports.updateModel = (req, res) => {

    let today = new Date().toLocaleDateString().split('/');
    let month  = today[0] - '0';
    let day  = today[1] - '0';
    let year  = today[2] - '0';
    let date = new Date(year, month-1, day+1);

    Automobile.findOne( { _id : req.params.brandId })
        .then(brand => {
            var model = brand.submodels.find(m => m._id == req.body._id);
            
            let qty_diff = req.body.quantity - model.quantity;
            let pp_diff = req.body.pp - model.pp;

            if(qty_diff == 0 && pp_diff != 0)
            { 
                date = model.date;
                year  = date.getFullYear();
                month = date.getMonth()+1;
                day = date.getDate()-1;
                qty_diff = model.quantity;
            }
            else if(qty_diff != 0 && pp_diff == 0)
                pp_diff = model.pp;
            else if( qty_diff != 0 && pp_diff != 0)
                pp_diff = req.body.pp;

            model.name = req.body.name;
            model.quantity = req.body.quantity;
            model.pp = req.body.pp;
            model.date = date;

            brand.save()
                .then(data => {

                    if(qty_diff != 0 || pp_diff != 0)
                    {
                        //Update Statistics
                        Stats.findOne({item_type : 'automobiles'})
                        .then(item_level => {
                            var year_level = item_level.value.find(y => y.year == year);
                            var month_level = year_level.value.find(m => m.month == month);
                            var day_level = month_level.value.find(d => d.day == day);
                            
                            year_level.purchase += (pp_diff * qty_diff);
                            month_level.purchase += (pp_diff * qty_diff);
                            day_level.purchase += (pp_diff * qty_diff);

                            item_level.save()
                                .then(data=> {
                                    if(!data){
                                        console.log("Error");
                                        res.send({message : err});
                                        return;
                                    }

                                    console.log("Purchase updated in Stats(Autmobile)!");
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
                    }

                    console.log("Model successfully updated !");
                    res.send(data);
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).send(err);
                })
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Brand not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving brand with id"
            });
            
        });
}


// Delete a automobile with the specified userId in the request
exports.delete = (req, res) => {
    Automobile.findByIdAndRemove(req.params.automobileId)
        .then(automobile => {
            if(!automobile) {
                return res.status(404).send({
                    message : "Automobile not found with this id !"
                });
            }

            console.log("Automobile successfully deleted !");
            res.send({
                message : "Automobile successfully deleted !"
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound'){
                return res.status(404).send({
                    message : "Automobile not found with this id !"
                })
            }

            res.status(500).send({
                message : "Could not delete the automobile with this id !"
            });     
        })
};

// Delete Model
exports.deleteModel = (req,res) => {
    //Pulling out the model from brand

    Automobile.findOne({ _id : req.params.brandId })
        .then(brand => {
            var model = brand.submodels.find(m => m._id == req.params.modelId);

            Automobile.update(
                {_id :  req.params.brandId},
                { $pull : { submodels : model}},
                (err, numAffected) => {
                    if(err)
                    {
                        console.log(err);
                        res.send(err);
                        return;
                    }
                    else
                    {
                        //Update Statistics
                        var date = model.date;
                        let year = date.getFullYear();
                        let month = date.getMonth()+1;
                        let day = date.getDate()-1;

                        Stats.findOne({item_type : 'automobiles'})
                            .then(item_level => {
                                var year_level = item_level.value.find(y => y.year == year);
                                var month_level = year_level.value.find(m => m.month == month);
                                var day_level = month_level.value.find(d => d.day == day);
                                
                                year_level.purchase -= (model.pp * model.quantity);
                                month_level.purchase -= (model.pp * model.quantity);
                                day_level.purchase -= (model.pp * model.quantity);

                                item_level.save()
                                    .then(data=> {
                                        if(!data){
                                            console.log("Error");
                                            res.send({message : err});
                                            return;
                                        }

                                        console.log("Purchase updated in Stats(Autmobiles)!");
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
                        res.send({message : "Model Successfully Deleted !"});
                        console.log("Model successfully deleted !");
                    }
                }
            );
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Brand not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving brand with id"
            });
            
        });
}

//find a model by name
exports.findOneByName = (req, res) => {
    Automobile.findOne({ 'name' : req.params.brandName })
        .then( brand => {
            if(!brand)
            {
                return res.status(404).send({
                    message : "Brand not found !"
                })
            }

            console.log("Brand with name successfully retrieved !");
            
            brand.submodels.forEach(model => {
                if(model.name == req.params.modelName)
                    res.send(model);
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Brand not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving brand with name"
            });
            
        });
};