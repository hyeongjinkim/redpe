var express = require('express');
var router = express.Router();
var mysql		= require('mysql');
var dbconfig	= require('../config/database.js');
var connection	= mysql.createConnection(dbconfig);
connection.connect();

/*
router.get('/', function(req, res, next) {
	var userNum		= req.query.userNum
	var sql = "SELECT * FROM user_info WHERE user_num = ?" 
	var sql_input = [userNum]
	var result = {}

	//connection.connect();
	connection.query(sql, sql_input, function (err, results){
		if(err){

			result.type = 0
			result.content = err
			res.send(JSON.stringify(result))
		}
		else{

			if( results[0].user_gender == 'M' )
				search_gender = 'W'
			else
				search_gender = 'M'

			sql = "SELECT user_num, user_univ, user_age, user_gender FROM user_info WHERE user_gender = ?"
			sql_input = [search_gender]
			
			connection.query(sql, sql_input, function (err, results){

				if(err){

					console.log(err)
					result.type = 0
					result.content = err
					res.send(JSON.stringify(result))
				}
				else{
					// select just 2 user_info 
					var random1 = Math.floor(Math.random() * results.length);
					var random2 = Math.floor(Math.random() * results.length);

					while( random1 == random2 )
						random2 = Math.floor(Math.random() * results.length);

					console.log(random1)
					console.log(random2)

					result.type = 1
					result.match1 = results[random1]
					result.match2 = results[random2]
					res.send( JSON.stringify(result) )
				}

			})
			
		}
	})

});
*/
router.put('/', function(req, res, next) {

	var queueNum	= req.body.queueNum

	var sql = "UPDATE queue_info SET expire_flag = ? WHERE queue_num =?"
	var sql_input = [1, queueNum]
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
		console.log(result)
		res.send( JSON.stringify(result) )

	})
})


router.post('/', function(req, res, next) {

	var userNum		= req.body.userNum
	var matchNum1	= req.body.matchNum1
	var matchNum2	= req.body.matchNum2

	var sql = "INSERT INTO queue_info (queue_user_num, queue_match1_num , queue_match2_num) ";
		sql+= " VALUES (?, ?, ?) ";
	var sql_input = [userNum, matchNum1, matchNum2];
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

	})
})

router.get('/', function(req, res, next){

	var userNum		= req.query.userNum
	var sql = "SELECT * FROM queue_info WHERE queue_user_num = ? ORDER BY queue_time DESC limit 1"
	var sql_input = [userNum]
	var result = {};
	
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
			if( results.length == 0 || results[0].expire_flag == 1 ){ // can run queue
				result.type = 2 
				result.content = err
				res.send( JSON.stringify(result) )
				
			}
			else{ // can't run queue(show exist data)

				result.request_num = results[0].queue_num

				sql = " SELECT "
				sql+= " match1.user_num AS m1_user_num, match1.user_univ AS m1_user_univ, match1.user_age AS m1_user_age , match1.user_gender AS m1_user_gender, "
				sql+= " match1.user_count AS m1_user_count, match1.user_concern AS m1_user_concern, "
				sql+= " match2.user_num AS m2_user_num, match2.user_univ AS m2_user_univ, match2.user_age AS m2_user_age , match2.user_gender AS m2_user_gender, "
				sql+= " match2.user_count AS m2_user_count, match2.user_concern AS m2_user_concern "
				sql+= " FROM user_info AS match1, user_info AS match2 "
				sql+= " WHERE match1.user_num = ? AND match2.user_num = ? "
				sql_input = [ results[0].queue_match1_num, results[0].queue_match2_num ]

				
				console.log(sql)
				console.log(sql_input)
				connection.query(sql, sql_input, function (err, results){

					if(err){
						result.type = 0 // error
						result.content = err
						res.send( JSON.stringify(result) )

					}
					else{

						result.type = 1 // error
						result.content = results[0]
						console.log(result)
						res.send( JSON.stringify(result) )

					}

				});
			}
		}
	})

})
/*
router.get('/:userNum', function(req, res, next){
	var userNum = req.params.userNum
	var pageType = req.query.pageType // to_user_number or from_user_number
	
	var sql;
	var sql_input = [userNum];
	var result = {};

	if ( pageType == 'F'){
		sql  = " SELECT "
		sql += " _from.user_num as from_user_num, _from.user_id as from_user_id, _from.user_univ as from_user_univ, "
		sql += " _to.user_num as to_user_num,     _to.user_id as to_user_id,	_to.user_univ as to_user_univ, "
		sql += " request_info.to_user_check, request_info.success_flag " 
		sql += " FROM user_info AS _from, user_info AS _to, request_info"
		sql += " WHERE request_info.from_user_num = ? AND request_info.from_user_num = _from.user_num AND request_info.to_user_num = _to.user_num"
	}
	else if( pageType == 'T'){
		sql  = " SELECT "
		sql += " _from.user_num as from_user_num, _from.user_id as from_user_id, _from.user_univ as from_user_univ, "
		sql += " _to.user_num as to_user_num,     _to.user_id as to_user_id,	_to.user_univ as to_user_univ, "
		sql += " request_info.request_num, request_info.to_user_check, request_info.success_flag " 
		sql += " FROM user_info AS _from, user_info AS _to, request_info"
		sql += " WHERE request_info.to_user_num = ? AND request_info.from_user_num = _from.user_num AND request_info.to_user_num = _to.user_num"
	}
	else{
		sql  = " SELECT "
		sql += " _from.user_num as from_user_num, _from.user_id as from_user_id, _from.user_univ as from_user_univ, _from.user_phone as from_user_phone, "
		sql += " _to.user_num as to_user_num,     _to.user_id as to_user_id,	_to.user_univ as to_user_univ,	 _to.user_phone as to_user_phone"
		sql += " FROM user_info AS _from, user_info AS _to, request_info"
		sql += " WHERE (request_info.to_user_num = ? OR request_info.from_user_num = ?) AND request_info.success_flag = ?" 
		sql += " AND request_info.from_user_num = _from.user_num AND request_info.to_user_num = _to.user_num"
		sql_input =[userNum, userNum, 1]
	}
	console.log(sql)
	console.log(sql_input)

	connection.query(sql, sql_input, function (err, results){

		if(err){

			console.log(err)
			result.type = 0
			result.content = err
		}
		else{

			console.log(results)
			result.type = 1
			result.content = results
		}
		res.send(JSON.stringify(result))

	})
})
*/

/*
router.put('/:matchNum', function(req, res, next){

	var matchNum = req.params.matchNum
	var matchFlag = req.body.matchFlag; // ok:1, deny:2
	
	var sql = "UPDATE request_info SET success_flag = ? WHERE request_num = ?";
	var sql_input = [matchFlag, matchNum];
	var result = {};

	console.log(sql)
	console.log(sql_input)

	connection.query(sql, sql_input, function (err, results){

		if(err){

			console.log(err)
			result.type = 0
			result.content = err
		}
		else{

			console.log(results)
			result.type = 1
			result.content = results
		}
		res.send(JSON.stringify(result))

	})
})
*/



module.exports = router;
