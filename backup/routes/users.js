var express = require('express');
var router = express.Router();
var mysql		= require('mysql');
var dbconfig	= require('../config/database.js');
var connection	= mysql.createConnection(dbconfig);
connection.connect();


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
