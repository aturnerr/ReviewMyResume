/*=========================package/schema imports=============================*/

var methodOverride        = require("method-override"),
    localStrategy         = require("passport-local"),
    flash                 = require("connect-flash"),
    bodyParser            = require("body-parser"),
    passport              = require("passport"),
    mongoose              = require("mongoose"),
    express               = require("express"),
    helmet                = require("helmet"),
    app                   = express();

var User  = require("./models/user");
var User  = require("./models/resume");

var indexRoutes = require("./routes/index.js");
var loginRoutes = require("./routes/login.js");

// hello
/*==================================app config================================*/

mongoose.connect("mongodb+srv://test:test@cluster1-sfksn.mongodb.net/test?retryWrites=true", {useNewUrlParser: true}, function(err){
  if (err){
    console.log("Could not connect to database.\nError: " + err);
  } else{
    console.log("Successfully connected to database.");
  }
});

app.use(flash());   // needs to be BEFORE passport config
app.use(helmet());

app.use(require("express-session")({
    secret: "one day, you will lose Shevon and you will regret it",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// move user data and flash errors to all views
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

/*====================================routing=================================*/

app.use(loginRoutes);
app.use(indexRoutes);

app.listen(3000 || process.env.PORT, function(){
    console.log("Successfully connected to server.");
});
