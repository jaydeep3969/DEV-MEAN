const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const cors = require('cors');

var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

require('./app/routes/items/clothes.routes')(app);
require('./app/routes/items/electronics.routes')(app);
require('./app/routes/items/automobiles.routes')(app);
require('./app/routes/customers/customer_clothes.routes')(app);
require('./app/routes/bills/bill_clothes.routes')(app);
require('./app/routes/customers/customer_electronics.routes')(app);
require('./app/routes/bills/bill_electronics.routes')(app);
require('./app/routes/customers/customer_automobiles.routes')(app);
require('./app/routes/bills/bill_automobiles.routes')(app);
require('./app/routes/other_expense.routes')(app);
require('./app/routes/config.routes')(app);
require('./app/routes/stats.routes')(app);
require('./app/routes/user.routes')(app);


app.get('/', (req, res) => {
    res.send("Hello From Node API...");
})

app.listen(3000,  () => {
    console.log("Listening on 3000 ....");
})
