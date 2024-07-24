var playlist;
function getPlaylist() {
   gapi.client.request({
    path: '/youtube/v3/playlists',
    params: {
      part: 'snippet',
      mine: true
    },
    callback: function(response) {
      if (response.error) {
        console.log(response.error.message);
      } else {
        if (response.kind == "youtube#playlistListResponse") {
           var ct = 0
             response.items.forEach(function(k) {
               if (k.snippet.title == "YouTubePhotosLibrary") {
                 playlist = k.id;
               }
               ct += 1
             })
           var int1 = setInterval(function() {
            if (ct == response.items.length || ct > response.items.length) {
               clearInterval(int1)
              if (!playlist) {
                 createPlaylist()
              }
               if (location.href.includes("gallery")) {
                    getItems()
                 }
            }
           },100)
      }
      }
    }.bind(this)
  });
}

// Replace 'YOUR_API_KEY' and 'YOUR_CHANNEL_ID' with your actual API key and channel ID
function createPlaylist() {
    return gapi.client.youtube.playlists.insert({
      "part": [
        "snippet,status"
      ],
      "resource": {
        "snippet": {
          "title": "YouTubePhotosLibrary",
          "description": "YouTube Photos Library. DO NOT DELETE: If you delete this playlist, YouTube photos cannot see any assets that were uploaded before you deleted it.",
          "tags": [
            "YouTube Photos"
          ],
          "defaultLanguage": "en-us"
        },
        "status": {
          "privacyStatus": "private"
        }
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                playlist = JSON.parse(response.body).id
              },
              function(err) { console.error("Execute error", err); });
}

function addVideoToPlaylist(videoId) {
    return gapi.client.youtube.playlistItems.insert({
      "part": [
        "snippet"
      ],
      "resource": {
        "snippet": {
          "playlistId": playlist,
          "position": 0,
          "resourceId": {
            "kind": "youtube#video",
            "videoId": videoId
          }
        }
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
}

function getItems() {
    gapi.client.youtube.playlistItems.list({
      "part": [
        "snippet,contentDetails"
      ],
      "maxResults": 25,
      "playlistId": playlist
    })
        .then(function(response) {
           var arr = JSON.parse(response.body).items;
           var videos = {}
           var ct = 0
           arr.forEach(function(k) {
              videos[k.id] = k.snippet.resourceId.videoId;
              ct += 1;
           })
           var dateList = {};
           var newint = setInterval(function() {
              if (ct == arr.length) {
                clearInterval(newint)
                var ct2 = 0;
                Object.keys(videos).forEach(async function(k) {
                   console.log(videos[k])
                   await getVideo(videos[k],function(data) {
                      var thumb = data.thumbnails.default.url;
                      var date = JSON.parse(data.description).date;
                      var newimg = document.createElement("img")
                      newimg.onclick = function() {
                        openViewer(videos[k],JSON.parse(data.description))
                      }
                      newimg.src = thumb
                      if (dateList[date]) {
                         dateList[date][dateList[date].length + 1] = newimg
                      }
                })
                   ct2 += 1
                })
                 var newint2 = setInterval(function() {
                   if (ct2 == Object.keys(videos).length) {
                      clearInterval(newint2)
console.log(dateList)
                      Object.keys(dateList).forEach(function(k) {
                         let dateObj = new Date(k * 1000);
                         let utcString = dateObj.toUTCString();
                         var elem = document.createElement("div").innerHTML = "<h3>" + utcString + "</h3>"
                         dateList[k].forEach(function(k) {
                            elem.appendChild(k)
                         })
                         document.body.appendChild(elem)
                      })
                   }
                },1)
              }
           },1)
              },
              function(err) { console.error("Execute error", err); });
  }
