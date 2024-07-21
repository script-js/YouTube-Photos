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
        }
      }
    }.bind(this)
  });
}

// Replace 'YOUR_API_KEY' and 'YOUR_CHANNEL_ID' with your actual API key and channel ID
async function createPlaylist() {
    const playlistTitle = 'YouTubePhotosLibrary';

    try {
        // Create the playlist
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                snippet: {
                    title: playlistTitle,
                    description: 'A collection of awesome photos and memories!',
                },
            }),
        });
        playlist = await response.json().id
    } catch (error) {
        console.error('Error creating playlist:', error);
    }
}
