var playlist;

async function getPlaylist() {
   await gapi.client.request({
    path: '/youtube/v3/playlists',
    params: {
      part: 'snippet',
      mine: true
    },
    callback: async function(response) {
      if (response.error) {
        console.log(response.error.message);
      } else {
        if (response.kind == "youtube#playlistListResponse") {
          await response.items.forEach(function(k) {
             if (k.snippet.title == "YouTubePhotosLibrary") {
                console.log(k)
             }
          })
         alert()
        }
      }
    }.bind(this)
  });
}
