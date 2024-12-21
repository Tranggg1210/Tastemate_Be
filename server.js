require('dotenv').config();

const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const cron = require('node-cron');
const express = require('express');
const mongoose = require('mongoose');
const httpStatus = require('http-status');

const apiRoute = require('./routes');
const cronService = require('./utils/cron-job');
const upload = require('./middlewares/multer.middleware');
const errorHandler = require('./middlewares/error.middleware');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 3002;
const devEnv = process.env.NODE_ENV === 'development';
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/taste-mate';

app.use(cors());
app.use(express.json());
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));
mongoose.set('debug', devEnv);

app.use('/api/v1', apiRoute);

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

const scheduledTasks = [{ task: cronService.updateStatusOrder, schedule: '*/55 * * * * *' }];

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected 🍀');
  })
  .then(() => {
    scheduledTasks.forEach(({ task, schedule }) => {
      cron.schedule(schedule, task, { scheduled: true, timezone: 'Asia/Ho_Chi_Minh' });
    });
  })
  .then(() => {
    server.listen(port, () => {
      console.log(`Server listening on port ${port} 🚀`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
