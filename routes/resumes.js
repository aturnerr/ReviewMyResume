var GridFsStorage         = require('multer-gridfs-storage'),
    Grid                  = require('gridfs-stream'),
    mongoose              = require("mongoose"),
    express               = require('express'),
    crypto                = require('crypto'),
    multer                = require('multer'),
    path                  = require('path'),
    fs                    = require('fs');

var router = express.Router();

const MongoURI = "mongodb+srv://test:test@cluster1-sfksn.mongodb.net/test?retryWrites=true";
// connect to mongoDB
const conn = mongoose.createConnection(MongoURI, {useNewUrlParser: true});

/*================================ FILE STORAGE ==============================*/

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

/*=================================GET ROUTES=================================*/

// standard resume upload page and form
router.get('/upload_resume', (req, res) => {
    res.render('upload');
});

// list of all currently stored resumes
router.get('/resumes', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files or error
    if (!files || files.length === 0 || err) {
      return res.status(404).json({ err: 'No files exist'});
    }

    return res.render("resumes", { resumes : files });
  });
});


// view a specific pdf in the browser
router.get('/resumes/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // Check if pdf
    if (file.contentType === 'routerlication/pdf') {
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

/*================================POST ROUTES=================================*/

// route for uploading the file
router.post('/resumes/upload', upload.single("file"), (req, res) => {
    // link file to specific user
    res.redirect("/")
});

module.exports = router;