        const imageInput = document.getElementById('file');
        var filesLength = 0;

        imageInput.addEventListener('change',
                                    function () {
            const files = this.files;
            filesLength = files.length;
            uploadProg()
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                var vMetadata = {
                  date: document.getElementById("file").files[0].lastModified,
                  type: document.getElementById("file").files[0].type
                }
                if (file.type.match('image.*')) {
                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    img.onload = function () {
                      createVid(img,{
                        width: this.width,
                        height: this.height
                      },vMetadata,document.getElementById("file").files.item(0).name)
                    };
                    uploadText.innerHTML = "Converting..."
                    vMetadata.imageSize = `${this.width} x ${this.height}`
                } else if (file.type.match('video.*')) {
                    showLink(k,vMetadata,document.getElementById("file").files.item(0).name)
                }
            }
        });

        function createVid(image,dimensions,meta,title) {
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext('2d');
          canvas.width = dimensions.width
          canvas.height = dimensions.height

            const frameRate = 10; // Frames per second
            const recorder = new MediaRecorder(canvas.
              captureStream(frameRate),
              { mimeType: 'video/webm' });
            const chunks = [];

            recorder.ondataavailable = function (e) {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = function () {
              if (chunks[0].size > 217) {
                var blob = new Blob(chunks,
                                      { type: 'video/webm' })
                showLink(blob,meta,title)
              } else {
                setTimeout(function() {createVid(uploadFile)},500)
              }
            };
            const drawFrame = () => {
                    ctx.drawImage(image, 0, 0,
                                  canvas.width, canvas.height);
            };
            drawFrame()
            recorder.start();
            setTimeout(function() {
              recorder.stop()
               return;
            },1000)
        }

function uploadProg(off) {
  if (off) {
    btn.onclick = null
    upload.innerHTML = "check"
    setTimeout(function () {
      upload.innerHTML = "backup"
      btn.onclick = function() {file.click()}
    },1500)
  } else {
    btn.onclick = function() {modal.style.display = "block"}
    upload.innerHTML = "<span class='spin'>progress_activity</span>"
  }
}

function showLink(obj,meta,title) {
  filesLength -= 1;
  var url = URL.createObjectURL(obj)
  var link = document.createElement("li")
  link.innerHTML = `
    <p><a href="${url}">Download</a></p>
    <input style="margin-right:10px" placeholder="Video ID">
  `
  var newbtn = document.createElement("button")
  newbtn.onclick = function() {
    var vid = this.parentElement.querySelector("input").value;
    addVideoToPlaylist(vid)
    updateVid(vid,JSON.stringify(meta),title)
  }
  newbtn.innerHTML = "Add to library"
  link.appendChild(newbtn)
  uploadUL.appendChild(link)
  if (filesLength == 0) {
    uploadProg(true)
    modal.style.display = "block";
    uploadText.innerHTML = "<u>Done</u>"
  }
}
