const Cloth = require('../../../models/items/clothes.model')
const Stats = require('../../../models/stats.model');

// Create and Save a new user
exports.create = (req, res) => {

    let today = new Date().toLocaleDateString().split('/');
    let month  = today[0] - '0';
    let day  = today[1] - '0';
    let year  = today[2] - '0';
    let date = new Date(year, month-1, day+1);

    // Create a cloth
    const cloth = new Cloth({
        name : req.body.name,
        quantity : req.body.quantity,
        pp : req.body.pp,
        sp : req.body.sp,
        date : date
    })

    //Save Cloth in DB
    cloth.save()
        .then( data => {

            //Update Statistics
            

            Stats.findOne({item_type : 'clothes'})
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

                            console.log("Purchase updated in Stats(Cloth)!");
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


            console.log("Cloth successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while creating the cloth-item"
            })
        });
};



// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
    Cloth.find()
        .then( clothes => {
            console.log("Clothes successfully retrieved !");
            res.send(clothes);
        })
        .catch(err => {
            res.status(500).send({
                message : err.message || "Some error occurred while retrieving clothes"
            })            
        });
};



// Find a single user with a userId
exports.findOne = (req, res) => {

    Cloth.findById(req.params.clothId)
        .then( cloth => {
            if(!cloth)
            {
                return res.status(404).send({
                    message : "Cloth not found !"
                })
            }

            console.log("Cloth with id successfully retrieved !");
            res.send(cloth);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Cloth not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving cloth with id"
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

    Cloth.findById(req.params.clothId)
        .then( cloth => {
            if(!cloth)
            {
                return res.status(404).send({
                    message : "Cloth not found !"
                })
            }

            let qty_diff = req.body.quantity - cloth.quantity;
            let pp_diff = req.body.pp - cloth.pp;
             
            if(qty_diff == 0 && pp_diff != 0)
            { 
                date = cloth.date;
                year  = date.getFullYear();
                month = date.getMonth()+1;
                day = date.getDate()-1;
                qty_diff = cloth.quantity;
            }
            else if(qty_diff != 0 && pp_diff == 0)
                pp_diff = cloth.pp;
            else if( qty_diff != 0 && pp_diff != 0)
                pp_diff = req.body.pp;

            //find user and update it with the request body
            Cloth.findByIdAndUpdate( req.params.clothId, {
                sr_no : req.body.sr_no,
                name : req.body.name,
                quantity : req.body.quantity,
                pp : req.body.pp,
                sp : req.body.sp,
                date : date
            }, {new : true})
                .then(cloth => {
                    if(!cloth) {
                        return res.status(404).send({
                            message : "Cloth not found with this id !"
                        });
                    }


                    if(qty_diff != 0 || pp_diff != 0)
                    {
                        //Update Statistics
                        Stats.findOne({item_type : 'clothes'})
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

                                    console.log("Purchase updated in Stats(Cloth)!");
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
                    

                    console.log("Cloth successfully updated !");
                    res.send(cloth);
                })
                .catch(err => {
                    if(err.kind === 'ObjectId'){
                        return res.status(404).send({
                            message : "Cloth not found with this id !"
                        });
                    }

                    res.status(500).send({
                        message : err.message || "Some error occurred while updating the cloth !"
                    });
                })

            console.log("Cloth with id successfully retrieved !");
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Cloth not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving cloth with id"
            });
            
        });

};



// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    Cloth.findByIdAndRemove(req.params.clothId)
        .then(cloth => {
            if(!cloth) {
                return res.status(404).send({
                    message : "Cloth not found with this id !"
                });
            }

            //Update Statistics
            var date = cloth.date;
            let year = date.getFullYear();
            let month = date.getMonth()+1;
            let day = date.getDate()-1;

            Stats.findOne({item_type : 'clothes'})
                .then(item_level => {
                    var year_level = item_level.value.find(y => y.year == year);
                    var month_level = year_level.value.find(m => m.month == month);
                    var day_level = month_level.value.find(d => d.day == day);
                    
                    year_level.purchase -= (cloth.pp * cloth.quantity);
                    month_level.purchase -= (cloth.pp * cloth.quantity);
                    day_level.purchase -= (cloth.pp * cloth.quantity);

                    item_level.save()
                        .then(data=> {
                            if(!data){
                                console.log("Error");
                                res.send({message : err});
                                return;
                            }

                            console.log("Purchase updated in Stats(Cloth)!");
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

            console.log("Cloth successfully deleted !");
            res.send({
                message : "Cloth successfully deleted !"
            });
        })
        .catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound'){
                return res.status(404).send({
                    message : "Cloth not found with this id !"
                })
            }

            res.status(500).send({
                message : "Could not delete the cloth with this id !"
            });     
        })
};


//find a cloth by name
exports.findOneByName = (req, res) => {
    Cloth.findOne({ 'name' : req.params.clothName })
        .then( cloth => {
            if(!cloth)
            {
                return res.status(404).send({
                    message : "Cloth not found !"
                })
            }

            console.log("Cloth with name successfully retrieved !");
            res.send(cloth);
        })
        .catch(err => {
            if(err.kind === 'ObjectId'){
                return res.status(404).send({
                    message : "Cloth not found !"
                });
            }
            
            return res.status(500).send({
                message : err.message || "Some error occured while retrieving cloth with name"
            });
            
        });
};