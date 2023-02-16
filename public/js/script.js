const filePicker = document.getElementById("file-picker");
const previewImage = document.getElementById("preview-image");
const previewVideo = document.getElementById("preview-video")
const previewAudio = document.getElementById("preview-audio");
const previewDocument = document.getElementById("preview-document");
const upload_btn = document.getElementById("upload_btn");
const time_left = document.getElementById("time_left");
const input_tray = document.getElementById("input_tray");
const receive_tray = document.getElementById("receive_tray");
var file;
let code;
let codearrey = [];
const codetext = document.getElementById("Code");
let time = 0;
let r_code
let filename;
let countdown
load()


async function download() {
  var write_file = function(data) {
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(data);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  write_file(file)  
}

function share() {
  window.location.href = "./share"; 
}
function receive() {
  window.location.href = "./receive"; 
}
function check(){
    r_code = document.getElementById('code-input').value;

    if (codearray.indexOf(r_code) !== -1 && r_code != "") {
      console.log(`${r_code} is in the array`);1
      received()
    } else if (r_code == "") {
      receivetext.innerHTML="🦆 Gib was ein du Kek."
    } else {
      receivetext = document.getElementById("receivetext")
      receivetext.innerHTML="❌ The code you entered doesnt exist. You may try again."
    }
}

// executed when code exists
function received() {
  input_tray.style.display = "none";
  receive_tray.style.display = "inline-block";
    
  console.log(r_code)
  
  ajaxreceive()
}


async function timer() {
// create timer 
  let minutes = document.getElementById("minutes").value;
  let seconds = document.getElementById("seconds").value;
  if (minutes > 9 || seconds > 59) {
    alert("Gib eine Zeit innerhalb von 10 Minuten an");
    return;
  }

  if (minutes == 0 )
  {
    console.log("Empty minutes")
    time = seconds
  }else{
    time = minutes*6+seconds
  }
  
  console.log("time is: " + minutes*6+seconds)

  while (0 < time)
  {
    time_left.innerHTML = "Time left: " + time ;
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    time = time-1
  }

  time_left.classList.add("animate__hinge", "animate__hinge");
  time_left.innerHTML = "Time's up!";
  await new Promise(resolve => setTimeout(resolve, 4500));  
  window.location.replace("../")


  console.log("puff");
}

filePicker.addEventListener("change", function() {
  file = filePicker.files[0];
  var reader = new FileReader();
  console.log(file)
  upload_btn.style.display = "none"

  // create sharing code
  code = Math.floor(Math.random() * 10000);

  if (codearray.indexOf(code) !== -1) {
      console.log(`${r_code} already exists`);
      code = Math.floor(Math.random() * 10000);

  }
  console.log("Sharing Code: " + code);
  codetext.innerHTML = "Sharing Code: " + code;
  codearrey.push(code);
  console.log(codearrey);

  document.getElementById("name").innerHTML = "Name: " + file.name;
  document.getElementById("size").innerHTML = "Größe: " + (file.size / (1024 * 1024)).toFixed(2) + " MB";
  document.getElementById("type").innerHTML = "Typ: " + file.type
  ;

  display();
  save();
  timer();
});

function display() {

  if (file.type.match("image.*")) {
    // Datei ist ein Bild
    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";
    previewAudio.style.display = "none";
    previewDocument.style.display = "none";

  } else if (file.type.match("audio.*")) {
    // Datei ist eine Audio-Datei
    previewAudio.src = URL.createObjectURL(file);
    previewAudio.style.display = "block";
    previewImage.style.display = "none";
    previewDocument.style.display = "none";

  } else if (file.type.match("video.*")) {
    // Datei ist eine Video-Datei
    previewVideo.src = URL.createObjectURL(file);
    previewVideo.style.display = "block";

  } else if (file.type.match("application/pdf")) {
    // Datei ist eine pdf-Datei
    previewDocument.style.display = "block";
    previewDocument.src = URL.createObjectURL(file);

  } else if (file.type.match("application/zip") || file.type.match("application/x-zip-compressed"))  {
    // Datei ist eine zip-Datei
    previewImage.src = "/public/assets/zip.png";
    previewImage.style.display = "block";
    previewAudio.style.display = "none";
    previewImage.style.width = "25%";
    previewDocument.style.display = "none";

  } else {
    document.getElementById("bumm").innerHTML = "Keine Vorschau verfügbar 😥";
  }
  
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
function load(){

  $.ajax({
    dataType: "text",
    traditional: true,
    type: 'POST',
    url: '/public/codearray',
    async : false,

    success: function (lcodearray) {
      codearray = lcodearray
      console.log(codearray)
    }
  });
}

async function ajaxreceive() { 


  $.ajax({
    dataType: "text",
    traditional: true,
    type: 'POST',
    url: '/public/filename',
    async : false,

    success: function (rfile) {
      filename = rfile
      console.log(filename)
    }
  });

  $.ajax({
    dataType: "text",
    type: 'POST',
    async : false,
    traditional: true,
    cache: false,
    data:{'r_code': r_code},
    url: '/public/r_code',

    success: function (r_code) {
      file = new File([r_code], filename);
      console.log(file)
      //display();
    }
  });


}


/////////////////////////////
//                         //
//   ___  ______   _____   //
//  / __|/ _` \ \ / / _ \  //
//  \__ \ (_| |\ V /  __/  //
//  |___/\__,_| \_/ \___|  //
//                         //                                      
//                         //                                        
/////////////////////////////

function save(){
    var formData = new FormData();
    let name = file.name;

    $.ajax({
      dataType: "STRING",
      type: 'POST',
      async : false,
      cache:false,
      data:{'name': name},
      url: '/public/name',
    });
    
    $.ajax({
      dataType: "STRING",
      type: 'POST',
      async : false,
      cache:false,
      data:{'code': code},
      url: '/public/code',
    });



    formData.append("file", filePicker.files[0]);
    $.ajax({
      data: formData,
      traditional: true,
      type: 'POST',
      contentType: false,
      processData: false,
      cache: false,
      url: '/public/file',
  
    });
    

  }

