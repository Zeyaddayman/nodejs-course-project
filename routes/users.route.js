const express = require('express');
const usersController = require('../controllers/users.controller');
const verifyToken = require('../middleware/verifyToken');

const multer = require('multer');
const appError = require('../utils/appError');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType == 'image') {
        return cb(null, true);
    } else {
        const err = appError.create('file must be an image', 400);
        return cb(err, false);
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter
});

const router = express.Router();

router.get('/', verifyToken, usersController.getAllUsers)

router.post('/register', upload.single('avatar'), usersController.register)

router.post('/login', usersController.login)

module.exports = router;