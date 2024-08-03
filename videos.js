async function getVideo(videoId,handoff) {
    return gapi.client.youtube.videos.list({
      "part": [
        "snippet,contentDetails"
      ],
      "id": videoId
    })
        .then(function(response) {
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
          "privacyStatus": "private",
          "selfDeclaredMadeForKids": false
        }
      }
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }

function openViewer(id,metadata,thumbs) {
    if (metadata.type.includes("image")) {
      window.open(thumbs.maxres.url, "","width=" + metadata.width + ", height=" + metadata.height + ", location=0, toolbar=0, menubar=0")
    } else if (metadata.type.includes("video")) {
      window.open("https://www.youtube.com/embed/" + id + "?color=white&autoplay=1&rel=0", "","location=0, toolbar=0, menubar=0")
    }
  }
