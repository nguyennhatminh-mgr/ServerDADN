var express = require('express');
var router = express.Router();
var {ID_ADMIN}  = require('../utilities/constant');

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get('/viewroom/:id',(req,res,next) => {
    const user_id = req.params.id;
    let query = "";
    if(user_id === ID_ADMIN){
        query  = `SELECT m.id as userID, m.realname, r.name, d.id, v.value, max(v.received_time) as received_time from myuser m 
        join adminroom ad on m.id = ad.id_user join room r on r.id = ad.id_room join device d on d.id_room = ad.id_room 
        join valueofdevice v on v.id_device = d.id group by v.id_device`;
    }
    else{
        query = `SELECT m.id as userID, m.realname, r.name, d.id, v.value, max(v.received_time) as received_time from myuser m 
        join adminroom ad on m.id = ad.id_user join room r on r.id = ad.id_room join device d on d.id_room = ad.id_room 
        join valueofdevice v on v.id_device = d.id where m.id = "${user_id}"`;
    }
    // Your code here
    connect.getConnection((err, con)=>{
        if(err) throw err;
        con.query(query, (err, row)=>{
            con.release();
            if(err) throw err;
            return res.send(row);           
        });
    })
}); 
// Your code here

module.exports = router;
