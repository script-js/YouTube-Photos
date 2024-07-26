        const imageInput = document.getElementById('file');
        var filesLength = 0;
        var imageDone = true

        imageInput.addEventListener('change',
                                    function () {
                                            uploadUL.style.display = "none"
                                            uploadUL.innerHTML = ""
            const files = this.files;
            filesLength = files.length;
            uploadProg()
            Object.keys(files).forEach(function(k) {
                const file = files[k];
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
                      createVid(img,vMetadata,document.getElementById("file").files.item(0).name)
                    };
                    uploadText.innerHTML = "Converting..."
                } else if (file.type.match('video.*')) {
                    showLink(file,vMetadata,document.getElementById("file").files.item(0).name)
                }
            })
        });

function createVid(img,meta,title) {
        var frame1 = document.createElement("iframe")
        frame1.style = "display:none"
        frame1.onload = function() {
          this.contentWindow.createVid(img,meta,title,frame1)
        }
        frame1.src = "createvid"
        document.documentElement.appendChild(frame1)
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
    <p><a href="${url}" download="${title}">${title}</a></p>
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
    uploadUL.style.display = "block"
    uploadText.innerHTML = "<b>Done</b>"
  }
}
