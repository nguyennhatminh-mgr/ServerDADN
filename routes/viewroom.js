var express = require('express');
var router = express.Router();
var {ID_ADMIN}  = require('../utilities/constant');

//  variable connect is used to connect to database
var connect = require('../connect/connect');

router.get('/viewroom/:id',(req,res,next) => {
    const user_id = req.params.id;   
    let query = `SELECT d.id as deviceID, d.type as type, v.value as value, v.received_time as time
        from myuser m join AdminRoom ad on m.id = ad.id_user 
        join Room r on r.id = ad.id_room 
        join Device d on d.id_room = ad.id_room 
        join ValueOfDevice v on v.id_device = d.id 
        inner join (SELECT max(received_time) as time, id_device from ValueOfDevice GROUP by id_device) 
        maxtable on v.id_device = maxtable.id_device and v.received_time = maxtable.time where m.id = "${user_id}"`;
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
router.get('/listroominfo/:id',(req,res,next) => {
    let query = "";
    const userID = req.params.id;
    if(userID === ID_ADMIN){
        query = `select m.id as userID, m.realname, ad.id_room from myuser m, AdminRoom ad where m.id != '123AFFK89HM2' group by m.id`;
    }
    else{
        query = `select m.id as userID, m.realname, ad.id_room from myuser m, AdminRoom ad where m.id = '${userID}' group by m.id `;
    }
    connect.getConnection((err, con)=>{
        if(err) throw err;
        con.query(query, (err, row)=>{
            con.release();
            if(err) throw err;
            return res.send(row);           
        });
    }) 
}); 

module.exports = router;
