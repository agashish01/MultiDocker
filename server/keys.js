//Anytime, we want to connect to host and port stored in our environment variables.
// Below are details to connect to REDIS and Database for running reddis instance and postgres instance. EXPRESS objects will communicate with 
// redis client and postgres client. Hence, for express, we have created seperate process.
module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  pgUser: process.env.PGUSER,
  pgHost: process.env.PGHOST,
  pgDatabase: process.env.PGDATABASE,
  pgPassword: process.env.PGPASSWORD,
  pgPort: process.env.PGPORT
};
