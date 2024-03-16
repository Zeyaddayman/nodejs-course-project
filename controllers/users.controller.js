const User = require('../models/user.model.js');
const httpStatusText = require('../utils/httpStatusText.js');
const asyncWrapper = require('../middleware/asyncWrapper.js');
const appError = require('../utils/appError.js');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/generateJWT.js');
require('dotenv').config();

const getAllUsers = asyncWrapper(async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    const users = await User.find({}, {"__v": false, "password": false}).limit(limit).skip(skip);

    res.json({status: httpStatusText.SUCCESS, data: {users}});
})

const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;

    const oldUser = await User.findOne({email: email});

    if (oldUser) {
        const err = appError.create("user already exists", 400, httpStatusText.FAIL);
        next(err);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar: req.file.filename
    })

    const token = generateJWT({email, id: newUser._id, role});
    newUser.token = token;

    await newUser.save();

    res.status(201).json({status: httpStatusText.SUCCESS, data: {user: newUser}});
})

const login = asyncWrapper(async(req, res, next) => {
    const { email, password } = req.body;

    if (!email && !password) {
        const err = appError.create("email and password are required", 400, httpStatusText.FAIL);
        return next(err);
    }    

    const user = await User.findOne({email: email});

    if (user) {
        const matchedPassword = await bcrypt.compare(password, user.password);

        if (matchedPassword) {
            const token = generateJWT({email, id: user._id, role: user.role});
            res.status(200).json({status: httpStatusText.SUCCESS, data: {token}});
        } else {
            const err = appError.create("password is incorrect", 400, httpStatusText.FAIL);
            return next(err);
        }
    } else {
        const err = appError.create("user does not exists", 400, httpStatusText.FAIL);
        return next(err);
    }
})

module.exports = {
    getAllUsers,
    register,
    login
}