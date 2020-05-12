// This will be for maintaing the logic for express to connect with ReactApp, postgres client, redis client
const keys = require('./keys');

//Express App setup
// Getting the libraries required.
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// creating the object for express for receive and respond to any http request that are going/coming through reactApp.
const app = express();

// cors: cross-origin resource sharing. Allow us from one domain (where the reactApp is running on) to the completely different domain or port that the 
// express-api is hosted on. Like, postgres, redis, react are on different host. Hence for communication, this library will help.
app.use(cors());


// Body-parser is going to parse the incoming request from reactApp and convert it into JSON, so that express can easily work with.
app.use(bodyParser.json());

//Postgres Client setup to connect to the Postgres server.
//logic for express to connect with the postgres db
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

// on any error, just log the below message
pgClient.on('error', () => console.log('Lost PG connection'));

// table in postgres db. Table is created only when not exists. If table creation throws error; then log it.
// this table is created to hold the indices entered by the user.
pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));


// Redis Client setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

// redis Publisher setup
// we are making this duplicate connection in both files because, according to the redis documentation for this javaScript library, if we ever have a 
// client that is listening or publishing information on redis, we have to make the duplicate connection; Because when the connection is turned into 
// listen, subscribe and publish information; then we cannot use the same connection for other purpose.
const redisPublisher = redisClient.duplicate();


//express routes handlers
app.get('/', (req, res) => {
  res.send('Hi');
});


app.get('/values/all', async (req, res) => {
  const values = await pgClient.query('SELECT * from values');

  res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

  res.send({ working: true });
});



app.listen(5000, err => {
  console.log('Listening');
});

