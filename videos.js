// Replace 'YOUR_API_KEY' and 'YOUR_VIDEO_ID' with actual values
async function getPrivateVideoThumbnail(videoId) {

    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`);
        const data = await response.json();

        // Extract the default thumbnail URL (other sizes available in 'data.snippet.thumbnails')
        const thumbnailUrl = data.items[0]?.snippet?.thumbnails?.default?.url;

        if (thumbnailUrl) {
            console.log('Thumbnail URL:', thumbnailUrl);
            return thumbnailUrl;
        } else {
            console.error('Thumbnail not found for the specified video.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching video details:', error);
        return null;
    }
    gapi.client.youtube.videos.list({
      "part": [
        "snippet,contentDetails"
      ],
      "id": videoId
    })
        .then(function(response) {
           console.log(response)
           })
              },
              function(err) { console.error("Execute error", err); });
}

function updateVid(id,desc,title) {
    return gapi.client.youtube.videos.update({
      "part": [
        "snippet,status,localizations"
      ],
      "resource": {
        "id": id,
        "snippet": {
          "categoryId": 22,
          "defaultLanguage": "en",
          "description": desc,
          "tags": [
            "new tags"
          ],
          "title": title
        },
        "status": {
          "privacyStatus": "private"
        },
        "localizations": {
          "es": {
            "title": "no hay nada a ver aqui",
            "description": "Esta descripcion es en español."
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
