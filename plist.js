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
                playlist = k.id
             }
          })
        }
      }
    }.bind(this)
  });
}

// Replace 'YOUR_API_KEY' and 'YOUR_CHANNEL_ID' with your actual API key and channel ID
// Replace 'YOUR_API_KEY', 'YOUR_PLAYLIST_ID', and 'YOUR_VIDEO_ID' with actual values
async function addVideoToPlaylist(videoId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                snippet: {
                    playlist,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId,
                    },
                },
            }),
        });

        const data = await response.json();
        console.log('Video added to playlist:', data);

        // You can handle the response as needed (e.g., show a success message)
        return data;
    } catch (error) {
        console.error('Error adding video to playlist:', error);
        return null;
    }
}
