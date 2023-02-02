const filePicker = document.getElementById("file-picker");
const previewImage = document.getElementById("preview-image");
const previewAudio = document.getElementById("preview-audio");
const upload_btn = document.getElementById("upload_btn");
const time_left = document.getElementById("time_left");
var file;
let code;
const codetext = document.getElementById("Code");
let time = 0;



function share() {
  window.location.href = "./share"; 
}
  

async function timer() {
// create timer 
  console.log("time is: " + time)
  let tl = 0

  while (time < 30)
  {
    time++;
    tl = 30 - time  
    time_left.innerHTML = "Time left: " + tl;
    await new Promise(resolve => setTimeout(resolve, 1000));  
  }

  console.log("puff");
}

filePicker.addEventListener("change", function() {
  file = filePicker.files[0];
  var reader = new FileReader();
  upload_btn.style.display = "none"
  // create sharing code
  code = Math.floor(Math.random() * 10000); 
  console.log("Sharing Code: " + code);
  codetext.innerHTML = "Sharing Code: " + code;
  document.getElementById("name").innerHTML = "Name: " + file.name;
  document.getElementById("size").innerHTML = "Größe: " + (file.size / (1024 * 1024)).toFixed(2) + " MB";
  document.getElementById("type").innerHTML = "Typ: " + file.type;




  if (file.type.match("image.*")) {
    // Datei ist ein Bild
    reader.onload = function() {
      previewImage.src = reader.result;
      previewImage.style.display = "block";
      previewAudio.style.display = "none";
      previewDocument.style.display = "none";
    };
    reader.readAsDataURL(file);
  } else if (file.type.match("audio.*")) {
    // Datei ist eine mp3-Datei
    previewAudio.src = URL.createObjectURL(file);
    previewAudio.style.display = "block";
    previewImage.style.display = "none";
    previewDocument.style.display = "none";

  } else if (file.type.match("application/pdf")) {
    // Datei ist eine pdf-Datei
    previewDocument = document.getElementById("preview-document");
    previewDocument.style.display = "block";
    previewDocument.src = URL.createObjectURL(file);
  }

  else {
    document.getElementById("bumm").innerHTML = "Keine Vorschau verfügbar 😥";
  }
  

  save();

  timer();
});





function load(){

    $.ajax({
      data: formData,
      traditional: true,
      type: 'POST',
      async : false,
      url: '/public/file',
      success: function (loaded_file) {
        file = loaded_file
      }
    });
}

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