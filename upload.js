        const imageInput = document.getElementById('file');
        var imageDone = true
        var currentFile = 0
        var uploadStart;

        imageInput.addEventListener('change',
                                    function () {
                                            uploadUL.style.display = "none"
                                            uploadUL.innerHTML = '<a href="javascript:downloadAll()">Download All</a>'
            const files = this.files;
            document.getElementById("upload-progress").max = files.length
            totalc.innerHTML = files.length
            duringUpload.style.display = "block"
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
  document.getElementById("upload-progress").value = currentFile
  donec.innerHTML = currentFile
  var url = URL.createObjectURL(obj)
  var link = document.createElement("li")
  link.innerHTML = `
    <p><a href="${url}" download="YTPHOTOSUPLOAD${currentFile}">${title}</a></p>
  `
  link.setAttribute("data-meta",JSON.stringify(meta))
  link.setAttribute("data-title",title)
  uploadUL.appendChild(link)
  if (currentFile == file.files.length) {
  getChannel(function(channel) {
    uploadProg(true)
    duringUpload.style.display = "none";
    modal.style.display = "block";
    uploadUL.style.display = "block"
    uploadText.innerHTML = "<b>Done</b><h3>Click the filenames to download, then upload them to <a href='https://studio.youtube.com/channel/" + channel.id + "/videos/upload?d=ud' target='_blank'>YouTube Studio</h3>"
    var btn1 = document.createElement("button")
    btn1.innerHTML = "Update Metadata"
    btn1.onclick = function() {
      getVideoList(file.files.length)
    }
    uploadUL.appendChild(btn1)
  })
  }
}

var videoList;
function getVideoList(max) {
  gapi.client.youtube.search.list({
      "part": [
        "id"
      ],
      "forMine" : true,
      "maxResults": max
    }).then(function(response) {
          var items = []
          JSON.parse(response.body).items.forEach(function(k,index,array) {
            getVideo(k.id.videoId,function(data) {
              items[index] = data
            })
            if (index == (array.length - 1)) {
                    updateMetadata(items)
            }
          })
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

function downloadAll() {
  uploadUL.querySelectorAll("a[download]").forEach(function(k) {
    k.click()
  })
}
