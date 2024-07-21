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
          var playlist = response.items.forEach(function(k) {
             if (k.snippet.title == "YouTubePhotosLibrary") {
                return k;
             }
          })
         console.log(playlist)
        }
      }
    }.bind(this)
  });
}

// Call the function
getPlaylists();
