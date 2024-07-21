function getChannel() {
   gapi.client.request({
    path: '/youtube/v3/channels',
    params: {
      part: 'snippet',
      mine: true
    },
    callback: function(response) {
      if (response.error) {
        console.log(response.error.message);
      } else {
        return response.items[0].id
      }
    }.bind(this)
  });
}

async function getPlaylists() {
    const channelId = 'YOUR_CHANNEL_ID';

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${channelId}&key=${API_KEY}`);
        const data = await response.json();

        // Extract relevant information from the API response
        const playlists = data.items.map(item => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.default.url,
        }));

        // Create a JSON variable with the playlists
        const playlistsJSON = JSON.stringify(playlists, null, 2);
        console.log(playlistsJSON); // You can replace this with any other action you want

        return playlistsJSON;
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return null;
    }
}

function getPlaylists2() {
   this.gapi.client.request({
    path: '/youtube/v3/playlists',
    params: {
      part: 'snippet',
      mine: true
    },
    callback: function(response) {
      if (response.error) {
        console.log(response.error.message);
      } else {
        console.log(response)
      }
    }.bind(this)
  });
}

// Call the function
getPlaylists();
