function getPlaylist(id) {
   const url = ' https://www.googleapis.com/youtube/v3/playlists';
   var authToken = gapi.auth.getToken();
   if (self.fetch) {
      var setHeaders = new Headers();
      setHeaders.append('Authorization', 'Bearer ' + authToken.access_token);
      setHeaders.append('Content-Type', "text/json");

      var setOptions = {
         method: 'GET',
         headers: setHeaders
      };
      return fetch(url, setOptions)
         .then(response => {
            if (response.ok) {
               var reader = response.body.getReader();
               var decoder = new TextDecoder();
               return reader.read().then(function (result) {
                  var data = decoder.decode(result.value, {
                     stream: !result.done
                  });
                  return data;
               });
            } else {
               console.error("Response error");
            }
         })
         .catch(error => {
            console.error(error.message);
         });
   }
}
