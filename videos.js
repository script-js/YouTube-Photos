// Replace 'YOUR_API_KEY' and 'YOUR_VIDEO_ID' with actual values
async function getVideo(videoId,handoff) {
    gapi.client.youtube.videos.list({
      "part": [
        "snippet,contentDetails"
      ],
      "id": videoId
    })
        .then(function(response) {
           handoff(JSON.parse(response.body).items[0].snippet)
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
