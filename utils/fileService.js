import { promisify } from 'util';
import path from 'path';
import {
  mkdir, writeFile, existsSync,
} from 'fs';


const mkDirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';


const saveFileInDB = async (fileData, dbClient) => {
  const filesCollection = await dbClient.filesCollection();
  const result = await filesCollection.insertOne(fileData);
  return result.ops[0];
};


const saveFileInDisk = async (base64Data, filename) => {
  if (!existsSync(FOLDER_PATH)) {
    await mkDirAsync(FOLDER_PATH);
  }
  const filePath = path.join(FOLDER_PATH, filename);
  await writeFileAsync(filePath, base64Data, { encoding: 'base64' });
  return filePath;
};


const fileService = {
  saveFileInDB,
  saveFileInDisk,
};

export default fileService;
