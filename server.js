var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var http = require('http');

var session = require('express-session');
app.use(session({
    secret: 'Ajay',
    maxAge: 1*60*1000, 
	secure: true,
	httpOnly: true,
	ephemeral:true,
	resave: true,
	saveUninitialized:false
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 
// connection configurations
var mc = mysql.createConnection({
    host: 'mysql-instance.cc9eehfqupez.us-east-1.rds.amazonaws.com',
    user: 'akkineni10009',
    password: 'Pedapadu1',
    database: 'Ediss'
});
 
// connect to database
mc.connect();
 
app.post('/login', function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	
	   mc.query('select * from Users where username=? and password=?',[username,password],function(err, rows){
		   
		   if(err)
		   {
			   mc.end();   
		   }
		   
		   else if (!err && rows.length>0)
		   {
			   req.session.username=true;
			   req.session.cookie.maxAge= 1*60*1000;
			   res.json({'message':'Welcome '+rows[0].firstname});		   
		   }
		   
		   else{
			   res.json({'message':'There seems to be an issue with the username/password combination that you entered'});
		   }
		   
	   });
	
});

app.post('/logout',function(req,res){
	if(req.session.username)
	{
		req.session.destroy();
	res.json({'message':'You have been successfully logged out'});
	}
	
	else
	{
		res.json({'message':'You are not currently logged in'});
	}
});

app.post('/add', function(req,res){
	console.log(req.session.username);
	
	var firstnumber = req.body.num1;
	var secondnumber = req.body.num2;
	
	if(req.session.username)
	{
		if(Number.isInteger(firstnumber) && Number.isInteger(secondnumber))
		{
			var sumOfTwoNumbers = firstnumber+secondnumber;
			return res.json({'message':'The action was successful', 'result':sumOfTwoNumbers});
		}
				
		else
		{
			return res.json({'message':'The numbers you entered are not valid'});
		}
	}
	
	else
	{
		return res.json({'message':'You are not currently logged in'});
	}
});

app.post('/multiply', function(req,res){
	var firstnumber = req.body.num1;
	var secondnumber = req.body.num2;
	
	if(req.session.username)
	{
		if(Number.isInteger(firstnumber) && Number.isInteger(secondnumber))
		{
			var productOfTwoNumbers = firstnumber*secondnumber;
			return res.json({'message':'The action was successful', 'result':productOfTwoNumbers});
		}
				
		else
		{
			return res.json({'message':'The numbers you entered are not valid'});
		}
	}
	
	else
	{
	return res.json({'message':'You are not currently logged in'});
	}
});
 
app.post('/divide', function(req,res){
	var firstnumber = req.body.num1;
	var secondnumber = req.body.num2;
	
	if(req.session.username)
	{
		if(Number.isInteger(firstnumber) && Number.isInteger(secondnumber) && secondnumber!=0)
		{
			var divideOfTwoNumbers = firstnumber/secondnumber;
			return res.json({'message':'The action was successful', 'result':divideOfTwoNumbers});
		}
				
		else
		{
		return res.json({'message':'The numbers you entered are not valid'});
		}
	}
	
	else
	{
		return res.json({'message':'You are not currently logged in'});
	}
});
  
// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});