function share(id,meta) {
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
      }
    })
    return "https://ytphotos.pages.dev/share?v=" + id
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
                    "snippet,contentDetails"
                  ],
                  "id": k.snippet.resourceId.videoId
                })
        .then(function(response) {
            if (JSON.parse(response.body).items[0]) {
              if (JSON.parse(response.body).items[0].status.privacyStatus == "unlisted") {
                var elem = document.createElement("div")
                elem.innerHTML `
                  <img src="${JSON.parse(response.body).items[0].snippet.thumbnails.default.url}"><a style="padding-left:1.5em" href="https://ytphotos.pages.dev/share?v=${k.snippet.resourceId.videoId}">${JSON.parse(response.body).items[0].snippet.title}</a>
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
