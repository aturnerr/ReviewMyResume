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
    path                  = require('path');
    fs                    = require('fs');
    crypto                = require('crypto');
    multer                = require('multer');
    GridFsStorage         = require('multer-gridfs-storage');
    Grid                  = require('gridfs-stream');

var User  = require("./models/user");

var indexRoutes = require("./routes/index.js");
var adminRoutes = require("./routes/admin.js");


/*================================= APP CONFIG ===============================*/

const MongoURI = "mongodb+srv://test:test@cluster1-sfksn.mongodb.net/test?retryWrites=true"
// connect to mongoDB
const conn = mongoose.createConnection(MongoURI, {useNewUrlParser: true}, function(err){
  if (err){
    console.log("Could not connect to database.\nError: " + err);
  } else{
    console.log("Successfully connected to database.");
  }
});

/*================================ FILE STORAGE ==============================*/
// TODO:
//    * move this section and routes into it's own file
//    * modify the file upload to only accept PDF files

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads')
})

// create storage engine which will store a pdf or other file on the server
const storage = new GridFsStorage({
    url: MongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });

const upload = multer({ storage });

// standard resume upload page and form
app.get('/resumes', (req, res) => {
    res.render('upload');
});

// route for uploading the file
app.post('/resumes/upload', upload.single("file"), (req, res) => {
    res.json({status: "Successfully uploaded", file: req.file});
});

// list of all currently stored resumes
app.get('/resumes/list', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }
    // Files exist
    return res.json(files);
  });
});

// view a specific pdf in the browser
app.get('/resumes/view/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // Check if pdf
    if (file.contentType === 'application/pdf') {
      // Read output to browser
        var data = gfs.createReadStream(file.filename);
        data.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not a PDF document'
      });
    }
  });
});

/*============================================================================*/

app.use(flash());   // nor flashing success/ error messages(eeds to be BEFORE passport config)
app.use(helmet());  // for web app security

// -- passport config
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

//
app.set("view engine", "ejs");  // use ejs templates (for dynamic pages)
app.use(express.static(__dirname + "/public")); // use 'public' dir as default dir
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); // allows the use of PUT and DELETE reqs

/*=================================== ROUTING ================================*/

app.use(adminRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT || 3000, function(){
    console.log("Successfully connected to server.");
});
