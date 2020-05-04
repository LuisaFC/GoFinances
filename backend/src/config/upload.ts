import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpFolder,

  // armazenar os uploads dentro da propria estrutura do app - na pasta tmp
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename: (request, file, callback) => {
      const filehash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${filehash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
