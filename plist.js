var playlist;

async function getPlaylist() {
   await gapi.client.request({
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
          response.items.forEach(function(k) {
             console.log(k)
             if (k.snippet.title == "YouTubePhotosLibrary") {
                console.log("found")
                console.log(k)
             }
          })
         
        }
      }
    }.bind(this)
  });
}
