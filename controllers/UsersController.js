import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import dbClient from '../utils/db';

const userQueue = new Queue('email sending');

//Controller for the index route.
class UsersController {

  // Create a new user in DB.
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const user = await (await dbClient.usersCollection()).findOne({ email });

    if (user) return res.status(400).json({ error: 'Already exist' });

    try {
      const addUserInfo = await (await dbClient.usersCollection())
        .insertOne({ email, password: sha1(password) });
      const userId = addUserInfo.insertedId.toString();

      userQueue.add({ userId });
      return res.status(201).json({ id: userId, email });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  //Fetches a user in DB.
  static async getMe(req, res) {
    return res.status(200).json({ id: req.user._id.toString(), email: req.user.email });
  }
}

export default UsersController;
