// app.js

// 🌟 Modules
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

// 🌟 Connexion à MongoDB
const { connectToMongoDB } = require('./db/db');

// 🌟 Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/authRouter');
var objectRouter = require('./routes/object');
var poidsRouter = require('./routes/poids');
var mesureRouter = require('./routes/meseur');
var  imcRouter=require('./routes/imcRouter');

//  Création de l'application Express
var app = express();

//  Désactiver le cache (fix 304 / Axios)
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

// 🌟 CORS (autoriser le front React)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
}));

//  OPTIONS preflight
app.options("*", cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Middlewares généraux
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/images')));


// 🌟 Session
app.use(session({
  secret: 'JWT_SECRET',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true si HTTPS
    maxAge: 90000 // 1 minute
  }
}));

//  Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/objectifs', objectRouter);
app.use('/poids', poidsRouter);
app.use('/mesures', mesureRouter);
app.use('/imc',imcRouter);

// Catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// 🌟 Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// 🌟 Création du serveur HTTP
const server = http.createServer(app);

// 🌟 Démarrage serveur + connexion MongoDB
connectToMongoDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Server not started due to MongoDB connection error:", err);
  });

module.exports = app;
