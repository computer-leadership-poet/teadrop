const WebSocket = require ("ws");
const express = require('express');
const path = require('path');
const mime = require('mime-types');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
var codearray = [1731];
var $ = require('jquery');
var multer  = require('multer');
app.use(express.json())
let fname = "empty";
let code;
let temp_name;
let rfile;
let current_time
let time
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
  }

});

var upload = multer({ storage: storage });


async function timebomb(_callback) {
  let current_time = 0;
  const temp_code = code

  // download counter websocket
  let downloads = 0


  codearray.push(temp_code);

  while (current_time < time)
  {
    current_time++;
    await new Promise(resolve => setTimeout(resolve, 1000));  
  }

  codearray = codearray.filter(item => item !== temp_code)

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


app.post('/public/filename', function(req, res) {
  res.send(temp_name);
});

app.post('/public/openfile', function(req, res) {
  fs.readdir("./uploads/" + r_code + "/", (err, files) => {
    if (err)
      console.log(err);
    else {
      files.forEach(rfile => {
        temp_name = rfile 
        res.attachment(path.join(__dirname, "/uploads/" + r_code + "/" + temp_name));
        const contentType = mime.lookup(temp_name);
        if (contentType) {
          res.type(contentType);
        }
        res.sendFile(path.join(__dirname, "/uploads/" + r_code + "/" + temp_name));
      });

    }
  })
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


app.post('/public/time', function(req, res) {
  time = req.body.time;
  try {
    console.log("time saved : " + time);
  } catch (err) {
    console.error(err);
  }
  res.send(time);

  timebomb(function() {
    console.log('huzzah, I\'m done!');
});    

});

app.post('/public/name', function(req, res) {
  fname = req.body.name;

  try {
    console.log("filename is: " + fname);
  } catch (err) {
    console.error(err);
  }
  res.send(fname);
});

app.post('/public/check_code', function(req, res) {
  let check_code = req.body.r_code;

  if (codearray.indexOf(check_code) !== -1) {
    res.send("Top");
  }else{
    res.send("Blä");
  }
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
});


app.post('/public/file', upload.single('file'), function(req, res) {
  var file = req.file;
  
  try {
    console.log("file saved successfully at : " + file.path);
  } catch (err) {
    console.error(err);
  }
  console.log(file.type)
  res.send(file);
});

