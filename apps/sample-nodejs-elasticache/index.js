// Include redis package
var redis = require('redis');
var PORT = 6379;
var HOST = 'samapp-lab-redis.daqynj.0001.use1.cache.amazonaws.com';
var client = redis.createClient(PORT, HOST);

// Connect to Redis endpoint
client.on('connect', function(){
  console.log("Connection established!");
  setRedisKey("user", "dev");
});

// Set key to Redis
function setRedisKey(key, value){
  client.set(key, value, function(err, response){
    if (err) console.log(err, err.stack);
    else {
      console.log("Response: "+ response);
      client.expire(key, 30); // key expires in 30 seconds
      getRedisKey(key);
    }
  });
}

function getRedisKey(key) {
  client.get(key, function(err, response) {
    if (err) console.log(err, err.stack)
    else {
      console.log(`Key: ${key} - Value: ${response}`);
      // Set a new key object
      var obj = {
        info1: "Something about info1",
        info2: "Maybe the password",
        info3: "This could be the email"
      };
      setRedisObject("user-info", obj);
    }
  });
}

function setRedisObject(key, obj) {
  client.hmset(key, obj, function(err, response) {
    if (err) console.log(err, err.stack);
    else {
      console.log(response);
      getRedisObject(key);
    }
  });
}

function getRedisObject(key) {
  client.hgetall(key, function(err, response) {
    if (err) console.log(err, err.stack);
    else {
      console.log(`Key: ${key} - Value: ${JSON.stringify(response)}`);
    }
  });
}