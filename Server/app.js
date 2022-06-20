const express = require('express');
const router=require('./routes');
const bodyParser = require('body-parser');
const result = require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/api',router);

app.listen(port, ()=>{
    console.log("Running on port" + port);
});