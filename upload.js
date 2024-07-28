        const imageInput = document.getElementById('file');
        var filesLength = 0;
        var imageDone = true
        var currentFile = -1

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
                      createVid(img,vMetadata,file.name)
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
  currentFile += 1;
  var url = URL.createObjectURL(obj)
  var link = document.createElement("li")
  link.innerHTML = `
    <p><a href="${url}" download="YTPHOTOSUPLOAD${currentFile}">${title}</a></p>
  `
  var newbtn = document.createElement("button")
  link.setAttribute("data-meta",JSON.stringify(meta))
  link.setAttribute("data-title",title)
  newbtn.innerHTML = "Add to library"
  link.appendChild(newbtn)
  uploadUL.appendChild(link)
  if (filesLength == file.files.length) {
    uploadProg(true)
    modal.style.display = "block";
    uploadUL.style.display = "block"
    uploadText.innerHTML = "<b>Done</b><br>Click the filenames to download, then upload them to <a href='https://studio.youtube.com/'>YouTube Studio</a>"
    var btn1 = document.createElement("button")
    btn1.innerHTML = "Update Metadata"
    btn1.onclick = function() {
      getVideoList()
    }
  }
}

var videoList;
function getVideoList(max) {
  gapi.client.youtube.playlistItems.list({
      "part": [
        "snippet,contentDetails"
      ],
      "maxResults": max
    }).then(function(response) {
      updateMetadata(response.items)
    }).catch((err) => console.error(err))
}

function updateMetadata(items) {
  uploadUL.querySelectorAll("li").forEach(function(k) {
    var video = items.find((element) => element.snippet.title.includes(k.querySelector("a").download)).snippet.id
    var meta = k.getAttribute("data-meta")
    var title = k.getAttribute("data-title")
    updateVid(video,meta,title)
    addVideoToPlaylist(video)
  })
}
