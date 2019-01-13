var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post('/webhook', (req, res) => {
  let reply_token = req.body.events[0].replyToken
  let text = req.body.events[0].message.text
  let sender = req.body.events[0].source.userId
  console.log(text, sender, reply_token)
  console.log(typeof sender, typeof text)

  reply(reply_token)
  res.sendStatus(200)
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function reply(reply_token) {
  let headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer  {c250nsCx5FpnupzPY/zMrEnqJ8drnkFioBT5Nrs9UH7tf28qAPMAxkz/2k5Jj6slJsRDWJut0XEJcICjDh1m+GsaqhduGxdqAN95omC+98wlCiYtbqH6lFDi4Bnhi/UxW5KbCOOu6RHRyp9Ga8bQiAdB04t89/1O/w1cDnyilFU=}'
  }
  let body = JSON.stringify({
      replyToken: reply_token,
      messages: [{
          type: 'text',
          text: 'Hello'
      },
      {
          type: 'text',
          text: 'How are you?'
      }]
  })
  request.post({
      url: 'https://api.line.me/v2/bot/message/reply',
      headers: headers,
      body: body
  }, (err, res, body) => {
      console.log('status = ' + res.statusCode);
  });
}

module.exports = app;
