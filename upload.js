        const imageInput = document.getElementById('file');
        var filesLength = 0;
        var imageIndex = 0;
        var images = [];
var imageDone = true
var canvas = document.createElement("canvas");
          var ctx = canvas.getContext('2d');

        imageInput.addEventListener('change',
                                    function () {
                                            images = []
                                            imageindex = 0
                                            imageDone = true
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
                      vMetadata.width = this.width
                      vMetadata.height = this.height
                      images.push([img,vMetadata,document.getElementById("file").files.item(0).name])
                        if (imageDone) {
                                createVid();
                                imageDone = false
                        }
                    };
                    uploadText.innerHTML = "Converting..."
                } else if (file.type.match('video.*')) {
                    showLink(file,vMetadata,document.getElementById("file").files.item(0).name)
                }
            }
        });

        function createVid() {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          var meta = images[imageIndex][1];
          canvas.width = meta.width
          canvas.height = meta.height

            const frameRate = 10; // Frames per second
            const recorder = new MediaRecorder(canvas.
              captureStream(frameRate),
              { mimeType: 'video/webm' });
            const chunks = [];

            recorder.ondataavailable = function (e) {
              chunks.push(e.data);
            };

            recorder.onstop = function () {
              if (chunks[0].size > 217) {
                var blob = new Blob(chunks,
                                      { type: 'video/webm' })
                showLink(blob,meta,images[imageIndex][2])
                if (imageIndex < (images.length + 1)) {
                  createVid()
                }
                imageIndex += 1;
              } else {
                createVid()
              }
            };
            ctx.drawImage(images[imageIndex][0], 0, 0, canvas.width, canvas.height);
            recorder.start();
            setTimeout(function() {
              recorder.stop()
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
    <p><a href="${url}" download="${title}">Download</a></p>
    <input style="margin-right:20px" placeholder="Video ID">
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
    uploadText.innerHTML = "<b>Done</b>"
  }
}
