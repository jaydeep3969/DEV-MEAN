const User = require('../../models/user.model');
const Stats = require('../../models/stats.model');

let admins = [
    { username : 'admin123', password : 'admin123'},
    { username : 'devjd_3979', password : 'wX3fi&^hiNJdo9'},
    { username : 'devent_1004', password : 'asdg%67H?SG31ds'},
    { username : 'devdep_7057', password : 'Hbsg#js67@jk45'},
    { username : 'devjei_8264', password : 'hdkU!gHt%kl90u'},
    { username : 'devdos_3935', password : 'keZ0*ej+op34l9'},
]

// Create and Save a new User
exports.create = (req, res) => {

    // Create a User
    const user = new User({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password
    })

    //Save User in DB
    user.save()
        .then(data => {
            console.log("User successfully saved !");
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the user"
            })
        });
};

// Retrieve and return all Users from the database.
exports.findAll = (req, res) => {
    User.find()
        .then(users => {
            console.log("Users successfully retrieved !");
            res.send(users);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Users"
            })
        });
};

// Find a single user with a userId
exports.findOne = (req, res) => {

    User.findById(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found !"
                })
            }

            console.log("User with id successfully retrieved !");
            res.send(user);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found !"
                });
            }

            return res.status(500).send({
                message: err.message || "Some error occured while retrieving user with id"
            });

        });
};

// Verify User
exports.verify = (req, res) => {

    user_admin = admins.find(u => u.username == req.body.username && u.password == req.body.password);

    if(user_admin)
        return res.send({message : 0});

    User.findOne({ username: req.body.username, password: req.body.password })
        .then(user => {
            if (!user){
                res.send({ message: -1 });
                return;
            }

            let today = new Date().toLocaleDateString().split('/');
            let month  = today[0] - '0';
            let day  = today[1] - '0';
            let year  = today[2] - '0';
            let items = ["clothes", "electronics", "automobiles"];

            items.forEach(item => {
                Stats.findOne({ item_type: item })
                .then(item_level => {
                    var year_level = item_level.value.find(y => y.year == year);

                    if (!year_level) {
                        var year_obj = {
                            year: year,
                            profit: 0,
                            sell: 0,
                            purchase: 0,
                            expense: 0,
                            value: [
                                {
                                    month: month,
                                    profit: 0,
                                    sell: 0,
                                    purchase: 0,
                                    expense: 0,
                                    value: [
                                        {
                                            day: day,
                                            profit: 0,
                                            sell: 0,
                                            purchase: 0,
                                            expense: 0
                                        }
                                    ]
                                }
                            ]
                        };

                        Stats.update(
                            { _id : item_level._id},
                            { $push : { value : year_obj}},
                            (err, numAffected) => {
                                if(err){
                                    console.log(err);
                                    res.send({message : err});
                                    return;
                                }
                                else{
                                    console.log("Year Level Object Added Successfully to Statistics !");
                                }
                            }
                        )
                    }
                    else {
                        var month_level = year_level.value.find(m => m.month == month);
                        if(!month_level) {
                            var month_obj = {
                                month: month,
                                profit: 0,
                                sell: 0,
                                purchase: 0,
                                expense: 0,
                                value: [
                                    {
                                        day: day,
                                        profit: 0,
                                        sell: 0,
                                        purchase: 0,
                                        expense: 0
                                    }
                                ]
                            }

                            year_level.value.push(month_obj);
                            item_level.save()
                                .then(data=> {
                                    if(!data){
                                        console.log("Error");
                                        res.send({message : err});
                                        return;
                                    }

                                    console.log("Month Level Object  Saved !");
                                })
                                .catch(err => {
                                    res.send({message : err});
                                    return;
                                })
                        }
                        else{
                            var day_level = month_level.value.find(d => d.day == day);
                            if(!day_level) {
                                let day_obj = {
                                    day: day,
                                    profit: 0,
                                    sell: 0,
                                    purchase: 0,
                                    expense: 0
                                };

                                month_level.value.push(day_obj);
                                item_level.save()
                                    .then(data=> {
                                        if(!data){
                                            console.log("Error");
                                            res.send({message : err});
                                            return;
                                        }

                                        console.log("Day Object  Saved !");
                                    })
                                    .catch(err => {
                                        res.send({message : err});
                                        return;
                                    })
                            }
                        }
                    }

                })
                .catch(err => {
                    res.send({message : err});
                }) 
            });
             
            res.send({ message: 1, uid : user._id });

        })
        .catch (err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found !"
                });
            }

            return res.status(500).send({
                message: err.message || "Some error occured while retrieving user with id"
            });

        });
    };

// Update a user identified by the username and password
exports.resetPassword = (req, res) => {

    User.findOne({ username: req.body.username, password: req.body.password })
        .then(user => {
            if (!user){
                return res.send({ message: -1 });
            }

            user.password = req.body.new_password;

            user.save()
                .then(data => {
                    if(!data)
                        return res.send({message : -1});
                    return res.send({message : 1});
                })
                .catch(err => {
                    console.log(err);
                    return res.send({message : err});
                })
             

        })
        .catch (err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found !"
                });
            }

            return res.status(500).send({
                message: err.message || "Some error occured while retrieving user with id"
            });

        });
};


// Update a user identified by the userId in the request
exports.update = (req, res) => {

    //find user and update it with the request body
    User.findByIdAndUpdate(req.params.userId, {
        username: req.body.username,
        name: req.body.name,
        password: req.body.password
    }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with this id !"
                });
            }

            console.log("User successfully updated !");
            res.send(user);
        })
        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "User not found with this id !"
                });
            }

            res.status(500).send({
                message: err.message || "Some error occurred while updating the User !"
            });
        })
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.userId)
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    message: "User not found with this id !"
                });
            }

            console.log("User successfully deleted !");
            res.send({
                message: "User successfully deleted !"
            });
        })
        .catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "User not found with this id !"
                })
            }

            res.status(500).send({
                message: "Could not delete the User with this id !"
            });
        })
};
