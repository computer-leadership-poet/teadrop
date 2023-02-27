const filePicker = document.getElementById("file-picker");
const previewImage = document.getElementById("preview-image");
const previewVideo = document.getElementById("preview-video")
const previewAudio = document.getElementById("preview-audio");
const previewDocument = document.getElementById("preview-document");
const upload_btn = document.getElementById("upload_btn");
const time_left = document.getElementById("time_left");
const timer_container = document.getElementById("timer_container");
const input_tray = document.getElementById("input_tray");
const receive_tray = document.getElementById("receive_tray");
const download_button = document.getElementById("download_button");
var file
let code;
let codearray = [];
const codetext = document.getElementById("Code");
let time = 0;
let r_code
let filename;
let countdown
let startBtn = document.getElementById("initiate")
let blob
const overlay = document.getElementById("overlay");
const popup = document.getElementById("popup");
const reloadBtn = document.getElementById("reloadBtn");


async function download() {
  await new Promise(resolve => setTimeout(resolve, 10));  
  download_file = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = download_file;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
}

function share() {
  window.location.href = "./share"; 
}
function receive() {
  window.location.href = "./receive"; 
}
function check(){
    r_code = document.getElementById('code-input').value;
  
    if (r_code == "") {
      receivetext.innerHTML="🦆 Gib was ein du Kek."
    } else {
      $.ajax({
        type: 'POST',
        async : true,
        cache: false,
        data:{'r_code': r_code},
        url: '/public/check_code',
        success: function(response) {
          console.log("prossesing")
          if (response == "Top")
          {
            console.log(`${r_code} is in the array`);1
            received()
          }else{
            receivetext = document.getElementById("receivetext")
            receivetext.innerHTML="❌ The code you entered doesnt exist. You may try again."
        
          }
        }
      });
    }
}

// executed when code exists
function received() {
  input_tray.style.display = "none";
  receive_tray.style.display = "inline-block";
    
  console.log(r_code)
  
  ajaxreceive()
}



function checkInput(input) {
  if (input.value > parseInt(input.max)) {
    input.value = input.max;
  }
}

async function timer() {

  // create timer 
  let minutes = parseInt(document.getElementById("minutes").value, 10);
  let seconds = parseInt(document.getElementById("seconds").value, 10);


  // sharing code //
  code = Math.floor(Math.random() * 10000);

  if (codearray.indexOf(code) !== -1) {
      console.log(`${r_code} already exists`);
      code = Math.floor(Math.random() * 10000);

  }
  console.log("Sharing Code: " + code);
  codetext.innerHTML = "Sharing Code: " + code;
  codearray.push(code);
  console.log(codearray);
  ////////////////////




  //standard timer (30s)
  if (isNaN(minutes) && isNaN(seconds))
  {
    console.log("Default timer")
    time = 30

    //minuten feld wird freigelassen
  }else if (isNaN(minutes)) {
    console.log("Empty minutes")
    console.log(seconds)
    time = seconds

    //sekunden feld wird freigelassen
  }else if (isNaN(seconds)) {
    console.log("seconds")
    console.log(seconds)
    time = (minutes*60)+30


    //beide felder werden ausgefüllt
  }else{
    time = (Number(minutes)*60)+seconds;
    console.log(time)
  }

  // execute saving
  save()

  // deaktiviert timer einstellungen

  startBtn.textContent = "Initiated";
  startBtn.disabled = true;
  startBtn.classList.add("btn-disabled");
  startBtn.classList.remove("btn-dark");
  document.getElementById("minutes").disabled = true;
  document.getElementById("seconds").disabled = true;
  
  // Input-Feld für Sekunden
  let inputSeconds = document.getElementById("seconds");
  inputSeconds.oninput = function() {
    if (inputSeconds.value > 59) {
      inputSeconds.value = 59;
    }

  };

  console.log("time is: " + time)



  while (0 < time)
  {
    time_left.innerHTML = "Time left: " + time ;
    await new Promise(resolve => setTimeout(resolve, 1000)); 
   time = time-1
  }

  time_left.classList.add("animate__hinge", "animate__hinge");
  timer_container.classList.add("animate__hinge", "animate__hinge");
  time_left.innerHTML = "Time's up!";
  await new Promise(resolve => setTimeout(resolve, 3500));  
  window.location.replace("../")

}

function checkFileSize() {
  if (file.size > 1000000000) {
    overlay.style.display = "block";
    overlay.classList.add("animate__animated")
    overlay.classList.add("animate__fadeIn")
    popup.style.display = "block";
    popup.classList.add("animate__animated");
    popup.classList.add("animate__slideInDown");
    document.body.style.overflow = "hidden"; // disable scrolling
    startBtn.disabled = true;
    startBtn.classList.add("btn-disabled");
    startBtn.classList.remove("btn-dark");

    document.getElementById("minutes").disabled = true;
    document.getElementById("seconds").disabled = true;
    return; // exit the function if file size is too large
  }
}

filePicker.addEventListener("change", function() {
  file = filePicker.files[0];
  checkFileSize()
  var reader = new FileReader();
  console.log(file)
  upload_btn.style.display = "none"
  startBtn.classList.add("btn-dark");
  startBtn.classList.remove("btn-disabled");
  startBtn.textContent = "Initiate";
  startBtn.disabled = false;

  // create sharing code


  document.getElementById("name").innerHTML = "Name: " + file.name;
  document.getElementById("size").innerHTML = "Größe: " + (file.size / (1024 * 1024)).toFixed(2) + " MB";
  document.getElementById("type").innerHTML = "Typ: " + file.type
  ;

  display();
});

/// Pop-Up für File Sizes
  reloadBtn.addEventListener("click", function() {
    location.reload();
  });

function reloadPage() {
  location.reload();
}

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
    document.getElementById("bumm").innerHTML = "No preview available 🫤";
  }
  
}

/////////////////////////////
//                         //
//   _                     //
//  | | ___   __ _  __| |  //
//  | |/ _ \ / _` |/ _` |  //
//  | | (_) | (_| | (_| |  //
//  |_|\___/ \__,_|\__,_|  //
//                         //
//                         //
/////////////////////////////
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
    async : true,
    traditional: true,
    cache: false,
    data:{'r_code': r_code},
    url: '/public/r_code',
  });


  $.ajax({
    url: 'public/openfile',
    method: 'POST',
    xhrFields: {
      responseType: 'blob'
    },
    success: function(data, textStatus, xhr) {
      file = data
      filename = xhr.getResponseHeader('Content-Disposition').split('filename=')[1];
      document.getElementById("filename").innerHTML = filename
      display()
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

  formData.append("file", file);
  $.ajax({
    data: formData,
    traditional: true,
    type: 'POST',
    contentType: false,
    processData: false,
    cache: false,
    url: '/public/file',
  });
    
  $.ajax({
    dataType: "STRING",
    type: 'POST',
    async : false,
    cache: false,
    data:{'time': time},
    url: '/public/time',
  });
  }

