var express = require('express');
var router = express.Router();
const {ID_ADMIN} = require('../utilities/constant');

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get("/listroomcontrol/:id",(req,res,next) => {
    const id = req.params.id;
    let query = "";
    if(id === ID_ADMIN){
        query = `SELECT * FROM Room`;
    }
    else{
        query = `SELECT id_user,id_room,name 
        FROM AdminRoom,Room
        where id_user='${id}' and id_room=id`;
    }

    connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(query,(error,rows) => {
            connection.release();
            if(error) console.log(error);
            res.send(rows);
        })
    })
}); 
// Your code here

module.exports = router;