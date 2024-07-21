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
async function createPlaylist() {
    const playlistTitle = 'YouTubePhotosLibrary';

    try {
        // Create the playlist
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + gapi.client.getToken().access_token
            },
            body: JSON.stringify({
                snippet: {
                    title: playlistTitle,
                    description: 'The playlist used by YouTube Photos. DO NOT DELETE THIS PLAYLIST.',
                },
            }),
        });

        const data = await response.json();
        const playlistId = data.id;

        console.log(`Playlist "${playlistTitle}" created with ID: ${playlistId}`);
        playlist = playlistId;
    } catch (error) {
        console.error('Error creating playlist:', error);
        return null;
    }
}

async function addVideoToPlaylist(videoId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + gapi.client.getToken().access_token
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
