var express = require('express');
var router = express.Router();

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get("/history",(req,res,next) => {
    // Your code here

    res.send("history");
}); 
// Your code here

module.exports = router;