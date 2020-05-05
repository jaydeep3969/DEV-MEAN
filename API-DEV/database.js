const mongoose = require('mongoose');
mongoose.set('debug',true);
mongoose.set('useCreateIndex',true);

const server = '127.0.0.1:27017';
const database = 'dev_db';

class Database {
    constructor()
    {
        this._connect();
    }

    _connect(){
        mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser : true})
            .then( () => {
                console.log("Database Connection Successfull");

            })
            .catch(err => {
                console.error('Database Connection Error');
            })
    }
}

module.exports = new Database();