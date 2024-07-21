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
   }
}
