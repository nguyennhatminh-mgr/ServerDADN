var express = require('express');
var router = express.Router();

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get("/setlightlevel",(req,res,next) => {
    // Your code here

    res.send("setlightlevel");
}); 
// Your code here

module.exports = router;