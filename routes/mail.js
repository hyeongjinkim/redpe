var express = require('express');
var router = express.Router();
var mysql       = require('mysql');
var dbconfig    = require('../config/database.js');
var connection  = mysql.createConnection(dbconfig);
var nodemailer = require('nodemailer');
connection.connect();


router.get('/', function(req, res, next) {


var smtpTransport = nodemailer.createTransport("SMTP", {  
    service: 'Gmail',
    auth: {
        user: 'khjin1991@gmail.com',
        pass: 'qwer1234-'
    }
});

var mailOptions = {  
    from: 'khjin1991@gmail.com',
    to: 'khjin1991@gmail.com',
    subject: 'Nodemailer 테스트',
    text: '평문 보내기 테스트 '
};

smtpTransport.sendMail(mailOptions, function(error, response){

    if (error){
        console.log(error);
    } else {
        console.log("Message sent : " + response.message);
    }
    smtpTransport.close();
});
})

module.exports = router;