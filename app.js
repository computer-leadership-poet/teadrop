const express = require('express')
const path = require('path')
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
const { json } = require('express');
const favicon = require('serve-favicon');
var $ = require('jquery');
var multer  = require('multer');
app.use(express.json())
let fname = "empty";
let code
//app.use(favicon(path.join(__dirname, '/', 'favicon.ico')));


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/public',express.static('public'));

// get html pagees
app.get('/', (_, res) => {
  res.sendFile('public/page/index.html', {root: __dirname })});

app.get('/share', (_, res) => {
  res.sendFile('public/page/share.html', {root: __dirname })});

// port listenter
app.listen(port, () => {
  console.log(`App listening on port ${port}!`)
});

// save uploaded file
var storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/" + code + '/');
  },
  filename: function (req, file, cb) {
    cb(null, fname);
  }
});

var upload = multer({ storage: storage });


/////////////////////////////
//                         //
//   ___  ______   _____   //
//  / __|/ _` \ \ / / _ \  //
//  \__ \ (_| |\ V /  __/  //
//  |___/\__,_| \_/ \___|  //
//                         //                                      
//                         //                                        
/////////////////////////////


app.post('/public/name', function(req, res) {
  fname = req.body.name;

  try {
    console.log("filename is: " + fname);
  } catch (err) {
    console.error(err);
  }
  res.send(fname);
});

app.post('/public/code', function(req, res) {
  code = req.body.code;

  try {
    console.log("sharing code is: " + code);
  } catch (err) {
    console.error(err);
  }
  fs.mkdirSync("uploads/"+code);
  res.send(code);
});


app.post('/public/file', upload.single('file'), function(req, res) {
    var file = req.file;
  
    try {
      console.log("file saved successfully at : " + file.path);
    } catch (err) {
      console.error(err);
    }
    res.send(file);
  });
