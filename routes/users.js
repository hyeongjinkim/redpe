var express = require('express');
var router = express.Router();
var mysql		= require('mysql');
var dbconfig	= require('../config/database.js');
var nodemailer = require('nodemailer');
var connection	= mysql.createConnection(dbconfig);
connection.connect();

router.get('/', function(req, res, next) {

	console.log(req.query)
	var userId = req.query.userId
	var sql = "SELECT user_id as count FROM user_info WHERE user_id = ?"
	var sql_input = [userId]

	result = {}

	console.log(sql)
	console.log(sql_input)
	connection.query(sql, sql_input, function (err, results){

		if(err){
			console.log(err)
			result.type = 0 // error
			result.content = err
		}
		else{
			
			console.log("results.length:" , results.length)
			if( results.length != 0 ) { // already exist this Id
				console.log(results)
				result.type = 2
			}
			else{

				console.log(results)
				result.type = 1 // succss
			}
		}
		res.send( JSON.stringify(result) )
	});	

})


// 메일보내는 함
router.post('/verify', function(req, res) {
	var randomArray = [
   '4293','1286', '9121', '3312'
	];

	var rand = randomArray[Math.floor(Math.random() * randomArray.length)];


	var transporter = nodemailer.createTransport({
    service: 'Naver',
    auth : {
      user : "redmiror@naver.com",
      pass : '80silver!@'
    	}
  	});

  	var mailOptions = {
    from: 'redmiror@naver.com',
    to: req.body.email,
    subject: '[빨간거울] 인증번호' + rand,
    text: '인증번호를 입력하여 학교 인증해주세요'
  	};

  	if (req.body.email.indexOf('sogang.ac.kr') == -1){
    	res.send('<script type="text/javascript">alert("소속 대학 메일로만 인증가능합니다. 조금더 안전한 미팅을 위한 것이니 부탁드려요!");window.history.back();</script>');
    }
    else { 

  	transporter.sendMail(mailOptions, function(error, info){
    if(error) {
      console.log(error);
      res.writeHead(200, {'Content-Type': 'text/plain'});
    }
    else{
      console.log('message sent');
      res.send('<script type="text/javascript">alert("인증 번호를 발송했습니다");window.history.back();</script>');
    }   
  });
  }
});


router.post("/", function(req, res, next){
	// Add User
	
	var userUniv	= req.body.userUniv;
	var userGender	= req.body.userGender;
	var userCount	= req.body.userCount;
	var userAge		= req.body.userAge;
	var userId		= req.body.userId;
	var userPass	= req.body.userPass;
	var userPhone	= req.body.userPhone;
	var userConcern = req.body.userConcern;

	var sql  = "INSERT INTO user_info (user_id, user_pass, user_concern, user_univ, user_age, user_gender, user_count, user_phone) ";
		sql += " VALUES (?, ?, ?, ?, ?, ?, ?, ?) ";
	var sql_input = [userId, userPass, userConcern, userUniv, userAge, userGender, userCount, userPhone];
	var result = {};

	//connection.connect();
	console.log(sql)
	console.log(sql_input)
	connection.query(sql, sql_input, function (err, results){

		if(err){
			console.log(err)
			result.type = 0 // error
			result.content = err
			res.send( JSON.stringify(result) )
		}
		else{
			sql = "SELECT * FROM user_info WHERE user_id = ? AND user_pass = ?"	
			sql_input = [userId, userPass]
			connection.query(sql, sql_input, function (err, results){
				if(err){
					console.log(err)
					result.type = 0 // error
					result.content = err
				}
				else{
					console.log(results)
					result.type = 1 // succss
					result.content = results[0]
				}
				console.log(result)
				res.send( JSON.stringify(result) )
			})
		}
	});	
	/*
	connection.end(function(err){
		console.log("Disconnect")	
	});
	*/

})

router.put("/:userNum", function(req, res, next){
	// Add User
	var userNum		= req.params.userNum;	
	var userUniv	= req.body.userUniv;
	var userGender	= req.body.userGender;
	var userCount	= req.body.userCount;
	var userAge		= req.body.userAge;
	var userId		= req.body.userId;
	var userPass	= req.body.userPass;
	var userPhone	= req.body.userPhone;
	var userConcern = req.body.userConcern;

	var sql = " UPDATE user_info SET ";
		sql+= " user_id = ?, user_pass =?, user_concern=?, user_univ=?, user_age=?, user_gender=?, user_count=?, user_phone=?";
		sql+= " WHERE user_num = ? ";
	var sql_input = [userId, userPass, userConcern, userUniv, userAge, userGender, userCount, userPhone, userNum];
	var result = {};

	console.log(sql)
	console.log(sql_input)

	connection.query(sql, sql_input, function (err, results){

		if(err){
			console.log(err)
			result.type = 0 // error
			result.content = err
		}
		else{
			console.log(results)
			result.type = 1 // succss
			result.content = results
		}
		res.send( JSON.stringify(result) )
	});	

})



router.get('/:userNum', function(req, res, next) {

	var userNum = req.params.userNum
	var sql = "SELECT * FROM user_info WHERE user_num = ?"
	var sql_input = [userNum]

	result = {}

	console.log(sql)
	console.log(sql_input)
	connection.query(sql, sql_input, function (err, results){

		if(err){
			console.log(err)
			result.type = 0 // error
			result.content = err
		}
		else{
			console.log(results)
			result.type = 1 // succss
			result.content = results[0]
		}
		res.send( JSON.stringify(result) )
	});	

})
module.exports = router;
