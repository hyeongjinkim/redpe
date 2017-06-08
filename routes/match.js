var express = require('express');
var router = express.Router();
var mysql		= require('mysql');
var dbconfig	= require('../config/database.js');
var connection	= mysql.createConnection(dbconfig);
connection.connect();

/* GET users listing. */
router.get('/', function(req, res, next) {
	var userNum		= req.query.userNum
	var sql = "SELECT * FROM user_info WHERE user_num = ?" 
	var sql_input = [userNum]
	var result = {}

	var tdate = new Date();
	var ydate = tdate.getFullYear().toString();
	var mdate = (tdate.getMonth()+1).toString();
    var ddate = tdate.getDate().toString();
	var cdate = ydate+ (mdate[1] ? mdate : '0'+mdate[0])+ (ddate[1] ? ddate : '0'+ddate[0])

	console.log(tdate)

	//connection.connect();
	connection.query(sql, sql_input, function (err, results){
		if(err){

			console.log(err)

			result.type = 0
			result.content = err
			res.send(JSON.stringify(result))
		}
		else{

			if( results[0].user_gender == 'M' )
				search_gender = 'W'
			else
				search_gender = 'M'

			search_univ = results[0].user_univ

//SELECT DATE_FORMAT(queue_time, '%Y%m%d') FROM queue_info
			sql = "SELECT expire_flag, DATE_FORMAT(queue_time, '%Y%m%d') AS queue_time FROM queue_info WHERE queue_user_num = ? ORDER BY queue_time DESC limit 1"
			sql_input = [userNum];
			
			connection.query(sql, sql_input, function (err, results){
				if(err){

					console.log(err)

					result.type = 0
					result.content = err
					res.send(JSON.stringify(result))
				}
				else{
			/*	
					if( results[0].expire_flag == 0){ // pending

						result.type = 2
						result.content = "queue_info_exist";
						res.send(JSON.stringify(result))

					}
			*/
			//		else{


						if( results.length == 0 ){ // in case that run queue first time
							queue_time = 0
						}
						else{
							queue_time = results[0].queue_time
						}

						console.log(queue_time)
						console.log(cdate)

						if( queue_time > cdate){ // this case is unnormal case

							result.type = 3
							result.content = "stange case"
							res.send(JSON.stringify(result))
		
						}
						else if( queue_time == cdate){ // already run queue today

							result.type = 2
							result.content = "already run today"
							console.log("hihi")
							res.send( JSON.stringify(result) )
						}
						else{ //

							console.log(queue_time)
							console.log(cdate)


							sql = "SELECT user_num, user_univ, user_age, user_gender FROM user_info WHERE user_gender = ? AND user_univ <> ?"
							sql_input = [search_gender, search_univ]
							console.log(sql)
							console.log(sql_input)
							
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
			//		}

				}
			});
			
		}
	})

});

router.post('/', function(req, res, next) {

	var fromUserNum = req.body.fromUserNum
	var toUserNum	= req.body.toUserNum

	var sql = "INSERT INTO request_info (from_user_num, to_user_num) ";
		sql+= " VALUES (?, ?) ";
	var sql_input = [fromUserNum, toUserNum];
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

router.get('/:userNum', function(req, res, next){
	var userNum = req.params.userNum
	var pageType = req.query.pageType // to_user_number or from_user_number
	
	var sql;
	var sql_input = [userNum];
	var result = {};

	if ( pageType == 'F'){
		sql  = " SELECT "
		sql += " _from.user_num as from_user_num, _from.user_id as from_user_id, _from.user_univ as from_user_univ, "
		sql += " _to.user_num as to_user_num,     _to.user_id as to_user_id,	_to.user_univ as to_user_univ,		_to.user_count as to_user_count, " 
		sql += " _to.user_age as to_user_age,	  _to.user_concern as to_user_concern, " 
		sql += " request_info.to_user_check, request_info.success_flag " 
		sql += " FROM user_info AS _from, user_info AS _to, request_info"
		sql += " WHERE request_info.from_user_num = ? AND request_info.from_user_num = _from.user_num AND request_info.to_user_num = _to.user_num"
	}
	else if( pageType == 'T'){
		sql  = " SELECT "
		sql += " _from.user_num as from_user_num, _from.user_id as from_user_id, _from.user_univ as from_user_univ, _from.user_count as from_user_count, "
		sql += " _from.user_age as from_user_age, _from.user_concern as from_user_concern, " 
		sql += " _to.user_num as to_user_num,     _to.user_id as to_user_id,	_to.user_univ as to_user_univ,		_to.user_count as to_user_count, "
		sql += " request_info.request_num, request_info.to_user_check, request_info.success_flag " 
		sql += " FROM user_info AS _from, user_info AS _to, request_info"
		sql += " WHERE request_info.to_user_num = ? AND request_info.from_user_num = _from.user_num AND request_info.to_user_num = _to.user_num"
	}
	else{
		sql  = " SELECT "
		sql += " _from.user_num as from_user_num, _from.user_id as from_user_id, _from.user_univ as from_user_univ, _from.user_phone as from_user_phone, "
		sql += " _from.user_age as from_user_age, _from.user_concern as from_user_concern, " 
		sql += " _to.user_num as to_user_num,     _to.user_id as to_user_id,	_to.user_univ as to_user_univ,	 _to.user_phone as to_user_phone,"
		sql += " _to.user_age as to_user_age,	  _to.user_concern as to_user_concern " 
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

router.put('/:matchNum', function(req, res, next){
	console.log("put [/:matchNum]")

	var matchNum = req.params.matchNum
	var matchFlag = req.body.matchFlag; // ok:1, deny:2

	console.log(matchNum)
	console.log(matchFlag)
	
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



module.exports = router;
