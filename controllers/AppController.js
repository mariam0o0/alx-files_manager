import redisClient from '../utils/redis';
import dbClient from '../utils/db';

//Controller for the index route.
class AppController {

  //Method for the route GET /status.
  static getStatus(_req, res) {
    res.status(200).json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  //Method for the route GET /stats.
  static getStats(_req, res) {
    Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
      .then(([usersCount, filesCount]) => {
        res.status(200).json({ users: usersCount, files: filesCount });
      });
  }
}

export default AppController;
