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
               if (location.href.includes("shares")) {
                  getShares()
               }
            }
           },100)
      }
      }
    }.bind(this)
  });
}

function getAlbums(handoff) {
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
           var albums = []
             response.items.forEach(function(k,index,array) {
               if (k.snippet.title.includes("YouTubePhotosAlbum:")) {
                 console.log(k)
                 albums.push({"id":k.id,"thumbnail":k.snippet.thumbnails.high.url,"title":k.snippet.title.replace("YouTubePhotosAlbum:","")})
                 console.log(k.snippet.title)
               }
                if (index == (array.length - 1)) {
                   handoff(albums)
                }
             })
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

function createAlbum(name,id) {
    return gapi.client.youtube.playlists.insert({
      "part": [
        "snippet,status"
      ],
      "resource": {
        "snippet": {
          "title": "YouTubePhotosAlbum:" + name,
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
                
           if (id) {
                addVideoToAlbum(id,JSON.parse(response.body).id)
                toggleMenuOff()
           } else {
              location.reload()
           }
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

function addVideoToAlbum(videoId,album) {
    return gapi.client.youtube.playlistItems.insert({
      "part": [
        "snippet"
      ],
      "resource": {
        "snippet": {
          "playlistId": album,
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
           var dateList = [];
           var newint = setInterval(function() {
              if (ct == arr.length) {
                clearInterval(newint)
                var ct2 = 0;
                Object.keys(videos).forEach(async function(k) {
                   await getVideo(videos[k],function(data) {
                      var thumb = data.thumbnails.default.url;
                      var newimg = document.createElement("img")
                      newimg.onclick = function() {
                        openViewer(videos[k],JSON.parse(data.description),data.thumbnails)
                      }
                      newimg.src = thumb
                      if (localStorage.getItem("thumbSize")) {
                         newimg.width = localStorage.getItem("thumbSize")
                      }
                      newimg.addEventListener("contextmenu", function (event) {
                        event.preventDefault();
                        toggleMenuOn();
                        updateMenu(videos[k])
                        positionMenu(event);
                      });
                      var dateObj = new Date(JSON.parse(data.description).date)
                      var date2 = dateObj.getMonth() + "/" + dateObj.getDate() + "/" + dateObj.getFullYear() + "/" + dateObj.getDay()
                      var found = dateList.find((element) => element.readableDate == date2);
                      if (found) {
                         found.values.push(newimg)
                      } else {
                         dateList.push({date:JSON.parse(data.description).date,readableDate: date2,values:[newimg]})
                      }
                })
                   ct2 += 1
                })
                 var newint2 = setInterval(function() {
                   if (ct2 == Object.keys(videos).length) {
                      clearInterval(newint2)
                      console.log(dateList)
                      var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
                      var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
                      var sortedKeys = dateList.sort((a, b) => (a.date > b.date ? 1 : -1)).reverse();
                      loadText.remove()
                      Object.keys(sortedKeys).forEach(function(k2) {
                         var k = sortedKeys[k2];
                         var date = k.readableDate.split("/")
                         var dateString = weekdays[date[3]] + ", " + months[date[0]] + " " + date[1] + ", " + date[2]
                         var dateDiv = document.createElement("div")
                         dateDiv.innerHTML = "<h3>" + dateString + "</h3>"
                         k.values.forEach(function(k,index,array) {
                            dateDiv.appendChild(k)
                            if (index == (array.length - 1)) {document.body.appendChild(dateDiv)}
                         })
                     })
                   }
                },1)
              }
           },1)
              },
              function(err) { console.error("Execute error", err); });
  }
