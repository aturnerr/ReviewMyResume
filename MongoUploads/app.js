const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const app = express();

app.use(bodyparser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

const mongoURI = "mongodb+srv://test:test@cluster1-sfksn.mongodb.net/test?retryWrites=true";

const conn = mongoose.createConnection(mongoURI, {useNewUrlParser: true}, function(err){
  if (err){
    console.log("Could not connect to database.\nError: " + err);
  } else{
    console.log("Successfully connected to database.");
  }
});

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo); 
    gfs.collection('uploads')
})

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
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
  

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', upload.single("file"), (req, res) => {
    res.json({file: req.file});
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));