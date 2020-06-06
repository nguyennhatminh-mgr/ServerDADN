var express = require('express');
var router = express.Router();

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get("/control",(req,res,next) => {
    // Your code here

    res.send("control");
}); 
// Your code here

module.exports = router;