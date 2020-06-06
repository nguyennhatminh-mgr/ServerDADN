var express = require('express');
var router = express.Router();
var md5 = require('md5');

var connect = require('../connect/connect');
var {createUniqueId} = require('../utilities/createId');
var {ID_ADMIN} = require('../utilities/constant');

const SIGNUP_FAIL = 'SIGNUP_FAIL';
const LOGIN_FAIL = 'LOGIN_FAIL';
const SUCCESS = 'SUCCESS';

router.post('/login',(req,res,next) => {
  const username = req.body.username;
  let password = req.body.password;
  password = md5(password);

  let query = `SELECT * FROM MYUSER WHERE username='${username}' and password='${password}'`;

  connect.getConnection((err,connection) => {
    if(err) throw err;
    connection.query(query,(err,rows) => {
      connection.release();
      if(err) throw err;

      if(rows.length < 1){
        res.send(LOGIN_FAIL);
      }
      else{
        res.send(rows[0].id);
      }
    });
  });
});

// SELECT * FROM `room` WHERE id not IN ( SELECT id_room FROM adminroom )
router.post('/usernameexist',(req,res,next) => {
  const username = req.body.username;
  let query = `SELECT * FROM MYUSER WHERE username='${username}'`;
  connect.getConnection((err,connection) => {
    if(err) throw err;
    connection.query(query,(err,rows) => {
      connection.release();
      if(err) throw err;

      if(rows.length >= 1){
        res.send(SIGNUP_FAIL);
      }
      else{
        res.send("Success");
      }
    });
  });
});

router.get('/listroomnotowner',(req,res,next) => {
  let query = `SELECT * FROM room WHERE id not IN ( SELECT id_room FROM adminroom)`;
  connect.getConnection((err,connection) => {
    if(err) throw err;
    connection.query(query,(err,rows) => {
      connection.release();
      if(err) throw err;

      res.send(rows);
    });
  });
});

router.post('/signup',(req,res,next) => {
  const realname = req.body.realname;
  const username = req.body.username;
  let password = req.body.password;
  const id_room = req.body.id_room;

  const id_user = createUniqueId();
  password = md5(password);
  const query = `CALL sign_up('${id_user}','${realname}','${username}','${password}','${id_room}')`;

  connect.getConnection((err,connection) => {
    if(err) throw err;
    connection.query(query,(error,rows) => {
      connection.release();
      if(error) throw error;
      res.send(SUCCESS);
    });
  }); 
});

router.get('/info/:id',(req,res,next) => {
  const user_id = req.params.id;
  let query = "";

  if(user_id === ID_ADMIN){
    query = `SELECT * FROM MYUSER WHERE id ='${user_id}'`;
  }
  else{
    query = `SELECT * FROM myuser,adminroom,room WHERE myuser.id = '${user_id}' and adminroom.id_user = myuser.id and adminroom.id_room = room.id`;
  }

  connect.getConnection((err,connection) => {
    if(err) throw err;
    connection.query(query,(err,rows) => {
      connection.release();
      if(err) throw err;
      res.send(rows);
    });
  });
});

module.exports = router;

console.log(md5('123456'));