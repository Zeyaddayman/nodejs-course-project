const express = require('express');
const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const httpStatusText = require('./utils/httpStatusText');
const cors = require('cors');
const path = require('path');

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log('mongodb server started');
})

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
app.use(express.json());
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: err.statusText || httpStatusText.ERROR,
        message: err.message,
        code: err.statusCode,
        data: null
    })
})

app.all('*', (req, res, next) => {
    res.status(404).json({status: httpStatusText.FAIL, message: 'this resource not available'});
})

app.listen(process.env.PORT, () => {
    console.log(`Listening on port: ${process.env.PORT}`);
})