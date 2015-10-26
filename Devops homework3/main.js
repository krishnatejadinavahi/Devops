var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()

// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})

///////////// WEB ROUTES

// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	//console.log(req.method, req.url);

	//console.log(req);
	// ... INSERT HERE.

	client.lpush(['queue',req.originalUrl],function(err,reply){
		
		//res.sendStatus(req.url);
	});

	client.lrange('queue', 0, 4, function(err, reply) {
  //  console.log(reply); // ['angularjs', 'backbone']
    //res.sendStatus(reply);
    if(req.originalUrl=='/recent')
    {
    res.send(reply);
	}
	});
	
	next(); // Passing the request to the next handler in the stack.
});



app.get('/recent', function(req, res) {

console.log(res);

});


app.get('/', function(req, res) {
res.send('hello world')
});

app.get('/set',function(req,res){
console.log("set");
client.set("key", "this message will self-destruct in 10 seconds",redis.print);
client.expire("key", 10);
res.end();

});

app.get('/get',function(req,res){

console.log("get");
client.get("key", function(err,value){ 

res.send(value);
});

});

 app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){
    console.log(req.body) // form fields
    console.log(req.files) // form files


    if( req.files.image )
    {
 	   fs.readFile( req.files.image.path, function (err, data) {
 	  		if (err) throw err;
 	  		var img = new Buffer(data).toString('base64');
 	  		//console.log(img);
  			client.lpush(['queue2',img],function(err,reply){
		
		//res.sendStatus(req.url);


			});
 		});
 	}

    res.status(204).end()
 }]);

 app.get('/meow', function(req, res) {
 	{
 	//	if (err) throw err;


 /*	client.blpop('queue2', 0, function(err, data) {
	      console.log(data[1]);

	            //setTimeout(function() {
	              //      addWorker();
	            //}, 0);
	});*/




	client.lrange('queue2', 0, -1, function(err, reply) {
  //  console.log(reply); // ['angularjs', 'backbone']
    //res.sendStatus(reply);

   // res.send(reply);


   		//console.log(reply[reply.length-1]);

   		console.log(reply.length);

 		res.writeHead(200, {'content-type':'text/html'});
 		//items.forEach(function (imagedata) 
 		//{
    		res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+reply[0]+"'/>");
 		//});

    	res.end();
		});

	client.blpop('queue2', 0, function(err, data) {
    

	            //setTimeout(function() {
	              //      addWorker();
	            //}, 0);
	});
 	}
 })

// HTTP SERVER
// var server = app.listen(3000, function () {

//   var host = server.address().address
//   var port = server.address().port

//   console.log('Example app listening at http://%s:%s', host, port)
// })

/*var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})


var server1 = app.listen(3001, function () {

  var host = server1.address().address
  var port = server1.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})*/



client.lpush(['queue3',3000,3001],function(err,reply){
	
	
});

client.rpoplpush('queue3', 'queue3', function (err, item){

console.log(item);

var server = app.listen(item, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})


})