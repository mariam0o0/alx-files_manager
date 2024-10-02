import mongoDBCore from 'mongodb/lib/core';

const { MongoClient } = require('mongodb');


class DBClient {

  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const uri = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    this.client.connect((err) => {
      if (!err) {
        // console.log(`Connected to MongoDB at ${host}:${port}/${database}`);
        this.dbAlive = true;
      } else {
        console.error(err.message);
        this.dbAlive = false;
      }
    });
  }



  isAlive() {
    return !!this.dbAlive;
  }



  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }



  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }


  async usersCollection() {
    return this.client.db().collection('users');
  }


  async findUserByEmail(email) {
    const usersCollection = await this.usersCollection();
    return usersCollection.findOne({ email });
  }


  async findUserById(userId) {
    const usersCollection = await this.usersCollection();
    return usersCollection.findOne({ _id: new mongoDBCore.BSON.ObjectId(userId) });
  }

  /**
   * Retrieves a reference to the `files` collection.
   * @returns {Promise<Collection>}
   */
  async filesCollection() {
    return this.client.db().collection('files');
  }

  /**
   * Retrives a file by their ID.
   * @param {string} fileId - The file's ID.
   * @return {Promise<Document>} The file document.
   */
  async getFileById(fileId) {
    const filesCollection = await this.filesCollection();
    return filesCollection.findOne({ _id: new mongoDBCore.BSON.ObjectId(fileId) });
  }


  async getFileByIdAndUserId(fileId, userId) {
    const filesCollection = await this.filesCollection();
    return filesCollection.findOne({
      _id: new mongoDBCore.BSON.ObjectId(fileId),
      userId: new mongoDBCore.BSON.ObjectId(userId),
    });
  }


  async getFilesByQueryFilters(pipeline) {
    const filesCollection = await this.filesCollection();
    return filesCollection.aggregate(pipeline).toArray();
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
