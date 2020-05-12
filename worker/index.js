// We are creating this file in "WORKER" folder so that, we have a seperate process of WORKER which will communicate with redis client. 
// In package.json file; we are mentioning the clients as dependencies.
// This is the script which will execute at the very beginning of starting the application as mentioned in package.json
// We will mention here the logic to connect to redis, watching for values and eventually calculating the fibonacci.

//Mention the file where the hostname and port to connect to redis are stored. Below are just the connection details.
const keys = require('./keys');

//import the redis client
const redis = require('redis');

//create the redis client and connect to the redis server. 
//retry_strategy: if it looses the connection with server ; then it retries every 1 sec.
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

// create the duplicate of redisClient
const sub = redisClient.duplicate();

// we are using redis to calculate fibonacci because, there will be many temporary values generated.
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}



// msgVar is the index of the fibonacci series given on the website. It will calculate the fibonacci of the index provided and add into 'valuesVar'
// valuesVar is the hash table having index and fib(index)
// Below fn will watch redis for any new values that shows up
// So anytime, we get new message on redis, then run the below callback fn; and then we will toss the value back to the redis client.
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
