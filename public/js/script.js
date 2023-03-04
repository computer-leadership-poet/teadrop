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
const cheattext = document.getElementById("cheattext");
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
const popupcommand = document.getElementById("popup-command");
const overlaycommand = document.getElementById("overlay-command");
const reloadBtn = document.getElementById("reloadBtn");
let maxFileSize = true
let maxTime = false

async function download() {
  await new Promise(resolve => setTimeout(resolve, 10));  
  download_file = window.URL.createObjectURL(new Blob([file]));
  const link = document.createElement('a');
  link.href = download_file;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
}

function removeOverlay() {
  overlaycommand.classList.remove("show-overlay");
  overlaycommand.classList.remove("show");
  overlaycommand.classList.remove("animate__animated");
  overlaycommand.classList.remove("animate__fadeIn");
  overlaycommand.classList.remove("animate__fadeOut");
  document.body.style.overflow = "auto";
}

async function popupclose() {
  overlaycommand.classList.remove("animate__fadeIn");
  popupcommand.classList.remove("animate__slideInDown");
  overlaycommand.classList.add("animate__fadeOut");
  popupcommand.classList.add("animate__backOutUp");

  await new Promise(resolve => setTimeout(resolve, 1000)); 

  popupcommand.classList.remove("show");
  removeOverlay();
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

  if (maxTime == true) {

  // sharing code trotz viel zeit//
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

    cheattext.innerHTML="✅  Aber Harry, was ist mit den anderen Kindern, die gerne Zeit haben wollen?"
    time = 99999999999999;
    startBtn.disabled = true;
    startBtn.classList.add("btn-disabled");
    startBtn.classList.remove("btn-dark");


     // execute saving
    save()

    time_left.innerHTML = "Time left: 🦆"  ;
    time_left.classList.add("animate__animated")
    time_left.classList.add("animate__rubberBand")

  } else {
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

}

// Input-Feld für Minuten
let inputMinutes = document.getElementById("minutes");
inputMinutes.oninput = function() {
  this.value = this.value.replace(/[^0-9]/g, ''); // entfernt alle Zeichen, die keine Ziffern sind
  if (this.value.length > 1) {
    this.value = this.value.slice(0, 1); // beschränkt die Länge des Inputs auf 1 Zeichen
  }
};

// Input-Feld für Sekunden
let inputSeconds = document.getElementById("seconds");
inputSeconds.oninput = function() {
  this.value = this.value.replace(/[^0-9]/g, ''); // entfernt alle Zeichen, die keine Ziffern sind
  if (this.value > 59) {
    this.value = 59; // beschränkt den Input auf maximal 59
  } else if (this.value.length > 2) {
    this.value = this.value.slice(0, 2); // beschränkt die Länge des Inputs auf 2 Zeichen
  }
};

function checkFileSize() {
  if (file.size > 1000000000) {
    overlay.classList.add("show")
    overlay.classList.add("show-overlay")
    overlay.classList.add("animate__animated")
    overlay.classList.add("animate__fadeIn")
    overlaycommand.classList.add("show-overlay")
    popup.classList.add("animate__animated");
    popup.classList.add("show");
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
  if (maxFileSize == true)
  { 
    checkFileSize()
  }
   
  var reader = new FileReader();
  console.log(file)
  upload_btn.style.display = "none"
  startBtn.classList.add("btn-dark");
  startBtn.classList.remove("btn-disabled");
  startBtn.textContent = "Initiate";
  if (maxTime == true)
    startBtn.textContent = "WIR HÄTTEN GERNE ALLES";
  startBtn.disabled = false;

  // create sharing code

  function formatFileSize(size) {
    if (size < 1024) {
      return size + " B";
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + " KB";
    } else if (size < 1024 * 1024 * 1024) {
      return (size / (1024 * 1024)).toFixed(2) + " MB";
    } else {
      return (size / (1024 * 1024 * 1024)).toFixed(2) + " GB";
    }
  }

  document.getElementById("name").innerHTML = "Name: " + file.name;
  document.getElementById("size").innerHTML = "Größe: " + formatFileSize(file.size);
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


//////////////////////////////////////////////////////////////////
//    ____ _   _ _____    _  _____ ____ ___  ____  _____ ____   //
//  /_ __| | | | ____|  / \|_   _/ ___/ _ \|  _ \| ____/ ___|   //
// | |   | |_| |  _|   / _ \ | || |  | | | | | | |  _| \___ \   //
// | |___|  _  | |___ / ___ \| || |__| |_| | |_| | |___ ___) |  //
//  \____|_| |_|_____/_/   \_\_| \____\___/|____/|_____|____/   //
//                                                              //
//////////////////////////////////////////////////////////////////
let check_key = false

var keys = {};

function mobile_cheats(){
  overlaycommand.classList.add("show-overlay")
      overlaycommand.classList.add("show")
      overlaycommand.classList.add("animate__animated")
      overlaycommand.classList.add("animate__fadeIn")
      popupcommand.classList.add("show")
      popupcommand.classList.add("animate__animated");
      popupcommand.classList.add("animate__slideInDown");
      document.body.style.overflow = "hidden"; // disable scrolling
}

$(this).keypress((e) => {
  if (e.keyCode == 13)
  check_key = true
})

$(this).keypress((e) => {
  if (e.keyCode == 48)
  {
    if (check_key == true)
    {
      // use e.keyCode

      overlaycommand.classList.add("show-overlay")
      overlaycommand.classList.add("show")
      overlaycommand.classList.add("animate__animated")
      overlaycommand.classList.add("animate__fadeIn")
      popupcommand.classList.add("show")
      popupcommand.classList.add("animate__animated");
      popupcommand.classList.add("animate__slideInDown");
      document.body.style.overflow = "hidden"; // disable scrolling
  
    }
  }
});

function cheatcodecheck(){
  r_code = document.getElementById('cheat-input').value;
  if (r_code == "") {
    cheattext.innerHTML="🦆 Gib was ein du Kek."
  } else {
    $.ajax({
      type: 'POST',
      async : true,
      cache: false,
      data:{'r_code': r_code},
      url: '/public/check_cheat_code',
      success: function(response) {
        console.log("prossesing")
        if (response == "0"){
          cheattext.innerHTML="✅  You can upload files bigger than the Saarland now."
          maxFileSize = false
        }
        else if (response == "1"){
          cheattext.innerHTML="✅  You entered the secret MEME mode!"
        }
        else if (response == "2"){
          maxTime = true;
          startBtn.textContent = "WIR HÄTTEN GERNE ALLES";
          document.getElementById("minutes").disabled = true;
          document.getElementById("seconds").disabled = true;
          document.getElementById("minutes").value = "";
          document.getElementById("seconds").value = "";
          document.getElementById("minutes").placeholder = "Infinity";
          document.getElementById("seconds").placeholder = "...and beyond";
          startBtn.classList.add("animate__animated")
          startBtn.classList.add("animate__rubberBand")


        }
        else if (response == "wrong"){
          cheattext.innerHTML="❌ The code you entered doesn't exist. You may or may not try again."
        }
      }
    });
  }
}
