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
          "defaultLanguage": "en"
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
