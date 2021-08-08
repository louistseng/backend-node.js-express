const express = require('express');
const multer = require('multer');

/**
 * @param {import('mysql2').Pool} dbPool
 */
module.exports = function build(dbPool) {
  let router = express.Router();

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'public/uploads');
    },
    filename(req, file, cb) {
      // cb(null, `${Date.now()}_${file.originalname}`);
      cb(null, `${req.body.member_id}.jpg`);
    },
  });

  const upload = multer({ storage });

  router.post('/file', upload.single('file'), async (req, res, next) => {
    const { file } = req;

    if (file) {
      res.json(file);
    } else {
      throw new Error('File upload unsuccessful');
    }
  });

  return router;
};
