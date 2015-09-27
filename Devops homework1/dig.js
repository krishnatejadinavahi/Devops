var needle = require("needle");
var os   = require("os");
var fs=require('fs');
var config = {};
config.token="//my token goes here";

var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

var client =
{
	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},
	
	listkeys: function(onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/account/keys", {headers:headers}, onResponse)
	},
	
	newkey:function(name,onResponse)
	{
		var data = 
		{
		  "name": "key3",
		  "public_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCv9fDOTlzZOH95Q6rnc+Gxmb+4q1ZDFbzWNdhhwYnFcKN2Rm60zk91vIaUnJsMjsUILtbCSZqG9eRRNGLWDpoXkZFtrssP61qpEzsNmJTtW9hHZrujTi8FcxvBBLlsHkt50U7tENUbNpTWbI7xDIUuhC3BdxN1UOyVSHZORhmgfsYvD0nG84dqPfIgewGVJPJZaWMnzMcG0sKMrkvSBmrJsFcDLvDi6qm/oQN4dZnAXHYQsELmhnDPZdQzecl91gDqIj/52vHO5rxja5KbWwfBgM3hFGe4FsqdTQmfislXw4kgf+UEMm19T+c011kqA8so4hR8JTHXNX9sQ5L6dAVcO52fSWEo1wDmB/e2hhbvDNlRIMKTS4YGvoUnF7JTNX9XUcmvWR/QkBpN3ACFV5RUS1Xsvyr6vYbtOaRUhC4p3obKYpW//UrjkbcppJPjLC8kuxo5CDd+Oq0jlFQ+ITCRKRxKqtts37ydkiZPcTbUrm2VIDk8x0EUL+IOssVANLbkrf1DWKaKz04Jpl+BxJryhjWfi78OSnHMs4I9Y+eTyU13e1irJafbAogDqCXrxGJoDT/R9srYsmRSIz6VScU73H7IwSx5kH+0TANSL5N8Q/+6145dwQ8gHWJMEv7T2bQsBTZxwrDjpIzjN5mc1CIuloU6QZw4ZNjeAHYI46ra6w== kdinava"		
		  };
		needle.post("https://api.digitalocean.com/v2/account/keys", data, {headers:headers,json:true}, onResponse );
	},
	
	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[1265075],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},
	getDroplet:function(did, onResponse)
	{
		console.log(did);
		needle.get("https://api.digitalocean.com/v2/droplets/"+did,{headers:headers}, onResponse)
	}
};


client.newkey("mykey",function(err,resp,body){
	
	
	console.log(body);
});

client.listkeys(function(err,res){
	
	console.log(res.body);
	
	
});

var name = "kdinava";
var region = "fra1"; // Fill one in from #1
var image = "ubuntu-14-04-x32"; // Fill one in from #2
var did;
 client.createDroplet(name, region, image, function(err, resp, body)
 {
 	//console.log(body);
	//console.log(body['droplet']['id']);
	did=body['droplet']['id'];
 	// StatusCode 202 - Means server accepted request.
 	if(!err && resp.statusCode == 202)
	{
 		//console.log( JSON.stringify( body, null, 3 ) );
		setTimeout(trr,70000);
	}
 });
/*client.getDroplet(did,function(err,resp,body){
	{
	
	 console.log(body);
	}
});*/
function trr()
{
	console.log(did);
	needle.get("https://api.digitalocean.com/v2/droplets/"+did,{headers:headers}, function(err,data,resp){
		console.log(resp['droplet']['networks']['v4'][0]['ip_address']);
		var ip=resp['droplet']['networks']['v4'][0]['ip_address'];
		
		var inventory = "\nnode0 ansible_ssh_host=" + ip + " ansible_ssh_user=root ansible_ssh_public_key_file=./keys/id_rsa.pub"
                fs.appendFile("inventory", inventory, function (err) {
                    if (err) {
                        return console.log(err);
                    } else console.log("the file was created");
                })
		
		
	});
	
}
 
