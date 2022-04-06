// Get dependencies
var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// import the routing file to handle the default (index) route
var index = require('./server/routes/app');

// ... ADD CODE TO IMPORT YOUR ROUTING FILES HERE ...
const clientsRoutes = require('./server/routes/clients');
const ordersRoutes = require('./server/routes/orders');

// establish a connection to the mongo database
mongoose.connect('mongodb://localhost:27017/fitCamp',
   { useNewUrlParser: true }, (err, res) => {
      if (err) {
         console.log('Connection failed: ' + err);
      }
      else {
         console.log('Connected to database!');
      }
   }
);

var app = express(); // create an instance of express

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(logger('dev')); // Tell express to use the Morgan logger

// Add support for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});


app.use(express.static(path.join(__dirname, 'dist/fitCamp')));

app.use('/', index);

app.use('/clients', clientsRoutes);
app.use('/orders', ordersRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/fitCamp/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);


const server = http.createServer(app);

server.listen(port, function() {
  console.log('API running on localhost: ' + port)
});


//EFUFZdnxcNF71oVX
