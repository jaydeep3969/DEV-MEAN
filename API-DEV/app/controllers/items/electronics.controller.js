const Electronic = require('../../../models/items/electronics.model')
const Stats = require('../../../models/stats.model');

// Create and Save a new user
exports.create = (req, res) => {

    let today = new Date().toLocaleDateString().split('/');
    let month  = today[0] - '0';
    let day  = today[1] - '0';
    let year  = today[2] - '0';
    let date = new Date(year, month-1, day+1);

    // Create a electronic
    const electronic = new Electronic({
        name : req.body.name,
        quantity : req.body.quantity,
        pp : req.body.pp,
        date : date
    })

    //Save Electronic in DB
    electronic.save()
        .then( data => {

            //Update Statistics
            Stats.findOne({item_type : 'electronics'})
                .then(item_level => {
                    var year_level = item_level.value.find(y => y.year == year);
                    var month_level = year_level.value.find(m => m.month == month);
                    var day_level = month_level.value.find(d => d.day == day);
                    
                    year_level.purchase += (data.pp * data.quantity);
                    month_level.purchase += (data.pp * data.quantity);
                    day_level.purchase += (data.pp * data.quantity);

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

            console.log("Electronic successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating the electronic-item"
            })
        });
};



// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    Electronic.find()
        .then( electronics => {
            console.log("Electronices successfully retrieved !");
            res.send(electronics);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving electronics"
            })            
        });
};



// Find a single user with a userId
exports.findOne = (req, res) => {

    Electronic.findById(req.params.electronicId)
        .then( electronic => {
            if(!electronic)
            {
                return res.status(404).send({
                    message : "Electronic not found !"
                })
            }

            console.log("Electronic with id successfully retrieved !");
            res.send(electronic);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Electronic not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving electronic with id"
            });
            
        });
};



// Update a user identified by the userId in the request
exports.update = (req, res) => {

    let today = new Date().toLocaleDateString().split('/');
    let month  = today[0] - '0';
    let day  = today[1] - '0';
    let year  = today[2] - '0';
    let date = new Date(year, month-1, day+1);

    Electronic.findById(req.params.electronicId)
        .then( electronic => {
            if(!electronic)
            {
                return res.status(404).send({
                    message : "Cloth not found !"
                })
            }

            let qty_diff = req.body.quantity - electronic.quantity;
            let pp_diff = req.body.pp - electronic.pp;
             
            if(qty_diff == 0 && pp_diff != 0)
            { 
                date = electronic.date;
                year  = date.getFullYear();
                month = date.getMonth()+1;
                day = date.getDate()-1;
                qty_diff = electronic.quantity;
            }
            else if(qty_diff != 0 && pp_diff == 0)
                pp_diff = electronic.pp;
            else if( qty_diff != 0 && pp_diff != 0)
                pp_diff = req.body.pp;

            //find user and update it with the request body
            Electronic.findByIdAndUpdate( req.params.electronicId, {
                name : req.body.name,
                quantity : req.body.quantity,
                pp : req.body.pp,
                date : date
            }, {new : true})
                .then(electronic => {
                    if(!electronic) {
                        return res.status(404).send({
                            message : "Electronic not found with this id !"
                        });
                    }

                    if(qty_diff != 0 || pp_diff != 0)
                    {
                        //Update Statistics
                        Stats.findOne({item_type : 'electronics'})
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
                    }
                    

                    console.log("Electronic successfully updated !");
                    res.send(electronic);
                })
                .catch(err => {
                    if(err.kind === 'ObjectId'){
                        return res.status(404).send({
                            message : "Electronic not found with this id !"
                        });
                    }

                    res.status(500).send({
                        message : err.message || "Some error occurred while updating the electronic !"
                    });
                })
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Cloth not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving electronic with id"
            });
            
        });

    
};



// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    Electronic.findByIdAndRemove(req.params.electronicId)
        .then(electronic => {
            if(!electronic) {
                return res.status(404).send({
                    message : "Electronic not found with this id !"
                });
            }

            //Update Statistics
            var date = electronic.date;
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate()-1;

            Stats.findOne({item_type : 'electronics'})
                .then(item_level => {
                    var year_level = item_level.value.find(y => y.year == year);
                    var month_level = year_level.value.find(m => m.month == month);
                    var day_level = month_level.value.find(d => d.day == day);
                    
                    year_level.purchase -= (electronic.pp * electronic.quantity);
                    month_level.purchase -= (electronic.pp * electronic.quantity);
                    day_level.purchase -= (electronic.pp * electronic.quantity);

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

            console.log("Electronic successfully deleted !");
            res.send({
                message : "Electronic successfully deleted !"
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound'){
                return res.status(404).send({
                    message : "Electronic not found with this id !"
                })
            }

            res.status(500).send({
                message : "Could not delete the electronic with this id !"
            });     
        })
};


//Find One Electronics by Name
exports.findOneByName = (req, res) => {
    Electronic.findOne({ 'name' : req.params.electronicName })
        .then( electronic => {
            if(!electronic)
            {
                return res.status(404).send({
                    message : "Electronic not found !"
                })
            }

            console.log("Electronic with name successfully retrieved !");
            res.send(electronic);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Electronic not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving electronic with name"
            });
            
        });
};