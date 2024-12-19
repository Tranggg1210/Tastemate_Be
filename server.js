require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const cors = require('cors');
const http = require('http');
const userRoute = require('./routes/user.route');
const authRoute = require('./routes/auth.route');

const upload = require('./middlewares/multer.middleware');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3002;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hit-nodejs-2024';

app.use(cors());
app.use(express.json());
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(morgan('dev'));
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);

app.post('/uploads', upload.single('file'), (req, res) => {
  const urlPublic = `http://localhost:${port}/uploads/${req.file.filename}`;
  res.send({
    message: 'File uploaded successfully',
    urlPublic,
  });
});

app.get('/', (req, res) => {
  res.status(httpStatus.OK).send({
    message: 'Server is running 🍀',
    code: httpStatus.OK,
  });
});

app.get('/health-check', (req, res) => {
  res.status(httpStatus.OK).send({
    message: 'OK',
    code: httpStatus.OK,
  });
});

app.all('*', (req, res) => {
  res.status(httpStatus.NOT_FOUND).send({
    message: 'Not found',
    code: httpStatus.NOT_FOUND,
  });
});

app.use(errorHandler);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .then(() => {
    server.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
