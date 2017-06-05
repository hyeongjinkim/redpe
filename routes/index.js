var express		= require('express');
var router		= express.Router();
var mysql		= require('mysql');
var dbconfig	= require('../config/database.js');
var connection	= mysql.createConnection(dbconfig);

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("router.get,'/'")
	//res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {

	console.log(connection)
	sql = "SELECT * FROM user_info"
	console.log(sql)
	connection.query(sql, function (err, results){
		if(err){
			result = {}
			result.type = "error"
			result.content = err
			
			console.log(result)	
			res.send(result)
		}
		else{
			result = {}
			result.type = "success"
			result.content = results

			console.log(result)	
			res.send(result)
		}
	});
});

module.exports = router;
