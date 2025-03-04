var express = require('express');
var router = express.Router();
var md5 = require('md5');

var connect = require('../connect/connect');
var {createUniqueId} = require('../utilities/createId');
var {ID_ADMIN} = require('../utilities/constant');
var {transporter} = require('../connect/mqttconfig');

const SIGNUP_FAIL = 'SIGNUP_FAIL';
const LOGIN_FAIL = 'LOGIN_FAIL';
const SUCCESS = 'SUCCESS';

router.post('/login',(req,res,next) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username === null){
    username="";
  }
  if(password === null){
    password = "";
  }
  
  password = md5(password); 

  let query = `SELECT * FROM myuser WHERE username='${username}' and password='${password}'`;

  connect.getConnection((err,connection) => {
    if(err) console.log(err);
    connection.query(query,(err,rows) => {
      connection.release();
      if(err) console.log(err);
      
      if(rows.length < 1){
        res.send(LOGIN_FAIL);
      }
      else{
        res.send(rows[0].id);
      }
    });
  });
});

// SELECT * FROM `room` WHERE id not IN ( SELECT id_room FROM AdminRoom )
router.post('/usernameexist',(req,res,next) => {
  const username = req.body.username;
  let query = `SELECT * FROM myuser WHERE username='${username}'`;
  connect.getConnection((err,connection) => {
    if(err) console.log( err);
    connection.query(query,(err,rows) => {
      connection.release();
      if(err) console.log( err);

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
  let query = `SELECT * FROM Room WHERE id not IN ( SELECT id_room FROM AdminRoom)`;
  connect.getConnection((err,connection) => {
    if(err) console.log( err);
    connection.query(query,(err,rows) => {
      connection.release();
      if(err) console.log( err);

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
    if(err) console.log( err);
    connection.query(query,(error,rows) => {
      connection.release();
      if(err) console.log( error);
      res.send(SUCCESS);
    });
  }); 
});

router.get('/info/:id',(req,res,next) => {
  const user_id = req.params.id;
  let query = "";

  if(user_id === ID_ADMIN){
    query = `SELECT * FROM myuser WHERE id ='${user_id}'`;
  }
  else{
    query = `SELECT * FROM myuser,AdminRoom,Room WHERE myuser.id = '${user_id}' and AdminRoom.id_user = myuser.id and AdminRoom.id_room = Room.id`;
  }

  connect.getConnection((err,connection) => {
    if(err) console.log( err);
    connection.query(query,(err,rows) => {
      connection.release();
      if(err) console.log( err);
      res.send(rows);
    });
  });
});

router.post("/editname",(req,res,next) => {
  const id = req.body.id;
  const realname = req.body.realname;
  const username = req.body.username;

  const query = `UPDATE myuser SET realname='${realname}',username='${username}' WHERE id='${id}'`;

  connect.getConnection((err,connection) => {
    if(err) console.log(err);
    connection.query(query,(error,rows) => {
      connection.release();
      if(error) console.log(error);
      res.send(SUCCESS);
    })
  });
});

router.post("/checkpassword",(req,res,next) => {
  const id = req.body.id;
  let oldPass = req.body.oldPass;
  oldPass = md5(oldPass);

  const query = `SELECT * FROM myuser WHERE id='${id}' AND password='${oldPass}'`;

  connect.getConnection((err,connection) => {
    if(err) console.log(err);
    connection.query(query,(error,rows) => {
      connection.release();
      if(error) console.log(error);
      res.send(rows);
    })
  });
});  

router.post("/changepassword",(req,res,next) => {
  const id = req.body.id;
  let newPass = req.body.newPass;
  newPass = md5(newPass);

  const query = `UPDATE myuser SET password='${newPass}' WHERE id='${id}'`;

  connect.getConnection((err,connection) => {
    if(err) console.log(err);
    connection.query(query,(error,rows) => {
      connection.release();
      if(error) console.log(error);
      res.send(SUCCESS);
    })
  });
});

router.post("/forgotpassword",(req,res,next) => {
  const email = req.body.email;
  const newPass = createUniqueId();

  const query = `SELECT * FROM myuser where username = '${email}'`;

  connect.getConnection((err,connection) => {
    if(err) console.log(err);
    connection.query(query,(error,rows) => {
      connection.release();
      if(error) console.log(error);
      if(rows.length < 1){
        res.send("FAILED");
        return;
      }
      let user = rows[0];
      let pass = md5(newPass);

      const queryUpdatePass = `UPDATE myuser SET password = '${pass}' where id='${user.id}'`;
      connect.getConnection((err,connection) => {
        if(err) console.log(err);
        connection.query(queryUpdatePass,(error,rows) => {
          connection.release();
          if(error) console.log(error);

          let contentEmail = `
            Dear ${user.realname},\n
            New password of you is: ${newPass}.\n
            Please remember it carefully.Next, use this password to login, and then, change to new password.\n
            Best regards,
            DAND2020
          `;
          
          const mailOptions = {
            from : "dadn2020lightiot@gmail.com",
            to : email,
            subject: "FORGOT PASSWORD",
            text: contentEmail
          };

          transporter.sendMail(mailOptions,(err,info) => {
              if(err){
                console.log(err);
              }
              else{
                  console.log("Send email : " + info.response);
                  res.send(SUCCESS);
              }
          });
        })
      });
    })
  });

});


module.exports = router;

