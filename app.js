var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./src/routes/index.routes');
var quizzesRouter = require('./src/routes/quizzes.routes');
var resultsRouter = require('./src/routes/results.routes');
var questionTypesRouter = require('./src/routes/question-types.routes');
var quizTypesRouter = require('./src/routes/quiz-types.routes');
var authorizationRouter = require('./src/routes/authorization.routes');

var notFoundMiddleware = require('./src/middleware/not-found');
var errorHandlerMiddleware = require('./src/middleware/error-handler');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = require('./src/models');

db.sequelize
  .sync({ force: true })
  .then(() => {
    console.log('Synced db.');
  })
  .catch((err) => {
    console.log('Failed to sync db: ' + err.message);
  });

app.use('/', indexRouter);
app.use('/quizzes', quizzesRouter);
app.use('/results', resultsRouter);
app.use('/question-type', questionTypesRouter);
app.use('/quiz-type', quizTypesRouter);
app.use('/auth', authorizationRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
