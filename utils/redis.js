import { createClient } from 'redis';


//Redis client class.
class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.error('Reddis Client Error:', err);
    });
  }

  //Checks if the Redis client is connected to the server.
  isAlive() {
    return this.client.connected;
  }

  //Retrieves the value stored in Redis for a given key.
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) reject(err);
        resolve(value);
      });
    });
  }

  //Sets a value in Redis with an expiration (duration in seconds).
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  // Removes a value from Redis for a given key.
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, resp) => {
        if (err) reject(err);
        resolve(resp === 1);
      });
    });
  }
}

const redisClient = new RedisClient();
export default redisClient;
