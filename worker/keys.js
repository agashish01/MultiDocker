//Anytime, we want to connect to host and port stored in our environment variables.
module.exports = {
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT
};
