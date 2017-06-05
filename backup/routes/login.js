var express = require('express');
var router = express.Router();
var mysql		= require('mysql');
var dbconfig	= require('../config/database.js');
var connection	= mysql.createConnection(dbconfig);
connection.connect();

/* GET users listing. */
router.post("/", function(req, res, next){
	// Add User
	var userId		= req.body.userId;
	var userPass	= req.body.userPass;

	var sql = "SELECT * FROM user_info WHERE user_id = ? AND user_pass = ?"	
	var sql_input = [userId, userPass]

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
			console.log(results.length)
			console.log(results[0])
			if (results.length == 1){
				result.type = 1 // succss
				result.content = results[0]
			}
			else{
				result.type = 2 // succss
				result.content = "data is not exist"
			}
		}
		res.send( JSON.stringify(result) )
	});	
})

module.exports = router;
