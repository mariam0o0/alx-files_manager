import { createClient } from 'redis';


class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => {
      console.error('Reddis Client Error:', err);
    });
  }


  isAlive() {
    return this.client.connected;
  }


  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) reject(err);
        resolve(value);
      });
    });
  }


  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  }


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
