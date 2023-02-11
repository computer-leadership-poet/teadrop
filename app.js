const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
const { json } = require('express');
const favicon = require('serve-favicon');
var codearray = [];
var $ = require('jquery');
var multer  = require('multer');
app.use(express.json())
let fname = "empty";
let code;
let receivefile;
//app.use(favicon(path.join(__dirname, '/', 'favicon.ico')));


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/public',express.static('public'));

// get html pages
app.get('/', (_, res) => {
  res.sendFile('public/page/index.html', {root: __dirname })});

app.get('/share', (_, res) => {
  res.sendFile('public/page/share.html', {root: __dirname })});

app.get('/receive', (_, res) => {
  res.sendFile('public/page/receive.html', {root: __dirname })});
  
app.use(express.static('public'));
  

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
    timebomb()
  }

});

var upload = multer({ storage: storage });

async function timebomb() {
  let time = 0;
  const temp_code = code
  codearray.push(temp_code);
  console.log(codearray)
  
  while (time < 60)
  {
    time++;
    tl = 60 - time
    await new Promise(resolve => setTimeout(resolve, 1000));  
  }

  codearray = codearray.filter(item => item !== temp_code)
  console.log(codearray)

  fs.rm("./uploads/" + temp_code + "/",{ recursive: true, force: true }, (err) => {});
}

/////////////////////////////
//                         //
//                         //
//  | | ___   __ _  __| |  //
//  | |/ _ \ / _` |/ _` |  //
//  | | (_) | (_| | (_| |  //
//  |_|\___/ \__,_|\__,_|  //
//                         //                                      
//                         //                                        
/////////////////////////////

app.post('/public/codearray', function(req, res) {
  res.send(codearray);
});

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
  console.log(codearray);

  try {
    console.log("sharing code is: " + code);
  } catch (err) {
    console.error(err);
  }
  fs.mkdirSync("uploads/"+code);
  res.send(code);
});

app.post('/public/r_code', function(req, res) {
  r_code = req.body.r_code;
  try {
    console.log("r_code code is: " + r_code);
  } catch (err) {
    console.error(err);
  }
  
  receivefile = fs.readdir("./uploads/" + r_code + "/", function response(){
    app.post('/public/receivefile', function(req, res) {
      res.send(receivefile);
    });
  })
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
