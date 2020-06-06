var express = require('express');
var router = express.Router();

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get("/viewroom",(req,res,next) => {
    // Your code here
    res.send("viewroom");
}); 
// Your code here

module.exports = router;