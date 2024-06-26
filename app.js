var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./src/routes/index.routes');
var usersRouter = require('./src/routes/users.routes');
var quizzesRouter = require('./src/routes/quizzes.routes');
var resultsRouter = require('./src/routes/results.routes');
var answersRouter = require('./src/routes/answers.routes');
var questionTypesRouter = require('./src/routes/question-types.routes');
var quizTypesRouter = require('./src/routes/quiz-types.routes');
var questionsRouter = require('./src/routes/questions.routes');
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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/quizzes', quizzesRouter);
app.use('/results', resultsRouter);
app.use('/answers', answersRouter);
app.use('/question-type', questionTypesRouter);
app.use('/quiz-type', quizTypesRouter);
app.use('/questions', questionsRouter);
app.use('/auth', authorizationRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

/* // catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send('Internal server error');
}); */

module.exports = app;
