async function getVideo(videoId,handoff) {
    console.log(videoId)
    return gapi.client.youtube.videos.list({
      "part": [
        "snippet,contentDetails"
      ],
      "id": videoId
    })
        .then(function(response) {
            console.log(response)
            if (JSON.parse(response.body).items[0]) {
           handoff(JSON.parse(response.body).items[0].snippet)
            }
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

function openViewer(id,metadata) {
    if (metadata.type.includes("image")) {
        var addon = "?control=0"
    } else if (metadata.type.includes("video")) {
        var addon = "?color=white&autoplay=1"
    }
    window.open("https://www.youtube.com/embed/" + id + addon,"","width=" + metadata.width + ",height=" + metadata.height)
  }
