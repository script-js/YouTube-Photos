function getChannel(handoff) {
  gapi.client.youtube.channels.list({
      "part": [
        "snippet,contentDetails"
      ],
      "mine": true
    }).then(function(data) {handoff(JSON.parse(data.body).items[0])})
} 
