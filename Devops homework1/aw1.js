var AWS = require('aws-sdk');
var fs=require('fs');
// configure AWS security tokens
AWS.config.update({accessKeyId: process.env.AccessKeyID, 
  secretAccessKey: process.env.SecretAccessKey});

// Set your region for future requests.
AWS.config.update({region: 'us-east-1'});

var ec2 = new AWS.EC2();



var params1 = {
  KeyName: 'teja1', /* required */
  DryRun: false
};
ec2.createKeyPair(params1, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data['KeyMaterial']);           // successful response
});
// Create the instance
var params = {
  ImageId: 'ami-d05e75b8', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't2.micro',
  MinCount: 1, MaxCount: 1,
  KeyName: 'teja1'
};

ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }

  var instanceId = data.Instances[0].InstanceId;
  //console.log("Created instance", instanceId);
 // console.log(data);
 var params={
	InstanceIds:[instanceId]
 };
 ec2.waitFor('instanceRunning', params, function(err, data1) {
  if (err) console.log(err, err.stack); // an error occurred
  else   
  {  
  console.log(data1['Reservations'][0]['Instances'][0]['PublicIpAddress']);  
  ip=data1['Reservations'][0]['Instances'][0]['PublicIpAddress'];
  var inventory = "\nnode1 ansible_ssh_host=" + ip + " ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./teja1.pem"
                fs.appendFile("inventory", inventory, function (err) {
                    if (err) {
                        return console.log(err);
                    } else console.log("the file was created");
                })
  }     // successful response
});
});