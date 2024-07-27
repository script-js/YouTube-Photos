function share(id,addon) {
  gapi.client.youtube.videos.update({
      "part": [
        "snippet,status,localizations"
      ],
      "resource": {
        "id": id,
        },
        "status": {
          "privacyStatus": "unlisted"
        }
    })
    return "https://www.youtube.com/embed/" + id + addon
}

function getShares() {
      gapi.client.youtube.playlistItems.list({
      "part": [
        "snippet,contentDetails"
      ],
      "maxResults": 25,
      "playlistId": playlist
    })
        .then(function(response) {
          var arr = JSON.parse(response.body).items;
           var videos = {}
           var ct = 0
           arr.forEach(function(k) {
                gapi.client.youtube.videos.list({
                  "part": [
                    "snippet,contentDetails,status"
                  ],
                  "id": k.snippet.resourceId.videoId
                })
        .then(function(response) {
            if (JSON.parse(response.body).items[0]) {
              if (JSON.parse(response.body).items[0].status.privacyStatus == "unlisted") {
                var elem = document.createElement("div")
                if (JSON.parse(JSON.parse(response.body).items[0].snippet.description).type.includes("image")) {
                  var addon = "?control=0&rel=0"
                } else if (JSON.parse(JSON.parse(response.body).items[0].snippet.description).type.includes("video")) {
                  var addon = "?color=white&autoplay=1&rel=0"
                }
                elem.innerHTML = `
                  <img src="${JSON.parse(response.body).items[0].snippet.thumbnails.default.url}"><a style="padding-left:1.5em" target="_blank" href="https://www.youtube.com/embed/${k.snippet.resourceId.videoId + addon}">${JSON.parse(response.body).items[0].snippet.title}</a>
                `
                elem.style = "margin-bottom: 20px;display:flex;align-items:center;"
                document.body.appendChild(elem)
              }
            }
              },
              function(err) { console.error("Execute error", err); });
              ct += 1;
           })
        },
              function(err) { console.error("Execute error", err); });
}
