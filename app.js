var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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


const fs = require("fs");


// View all the filenames from the specific directory
app.use("/viewfile", (req, res) => {
    file_directory = path.join(__dirname, 'files');
    let dir_files = [];
    fs.readdir(file_directory, (err, files) => {
        files.forEach(file => {
            dir_files.push(file)
        })
        res.send(dir_files);
    })
})

// Create file with current timestamp 
app.use("/createfile", (req, res) => {
    let date = new Date();
    let strDateTime = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    // let strDateTimeTxt = strDateTime.replaceAll("/", "-").replaceAll(":", "-");
    let strDateTimeTxt = strDateTime.split("/").join("-").split(":").join("-");
    target_directory = path.join(__dirname, 'files', strDateTimeTxt + ".txt");
    fs.writeFileSync(target_directory, strDateTime, 'utf-8');

    console.log(target_directory)
    let data = fs.readFileSync(target_directory).toString('utf8')
    console.log(data)
    res.send(data);
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

module.exports = app;
