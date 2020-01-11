require('custom-env').env();
const { createServer } = require('http');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express');
const authenticationMiddleware = require('./src/middleware/authenticationMiddleware');
const mainErrorsHandlerMiddleware = require('./src/middleware/mainErrorsHandlerMiddleware');
const authRoutes = require('./src/auth/auth_routes')
const eventRoutes = require('./src/course/course_routes')
const userRoutes = require('./src/user/user_routes')

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }).then(() => {

  console.log(`Server Connecting to Mongoo.`);

  const server = createServer(app);
  server.listen(port, () => {
    console.log(`Listening for events on ${server.address().port}`);
  });

  app.use(require("cors")())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use('/api/auth', authRoutes)
  app.use(authenticationMiddleware)
  app.use('/api/users', userRoutes)
  app.use('/api/courses', eventRoutes)
  app.use(mainErrorsHandlerMiddleware)


}).catch((error) => console.log(`Connection to Mongoo DB Failed. ${error}`));
