const CLIENT_ID = '1042189889229-ecp73b2drihjcm65930381l07m3qm24a.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAdAjrwSHXXNIrq5XqcI6NACfO8UDVwjfY';

// Discovery URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'

// Set API access scope before proceeding authorization request
const SCOPES = 'https://www.googleapis.com/auth/youtube.download \ https://www.googleapis.com/auth/youtube.upload \ https://www.googleapis.com/auth/youtube.force-ssl';
let tokenClient;
let gapiInited = false;
let gisInited = false;

function gapiLoaded() {
   gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
   await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
   });
   gapiInited = true;
   var token = localStorage.getItem('gapi_token');
   if (token) {
      gapi.client.setToken(JSON.parse(token));
      startup()
   } else {
      window.onclick = null;
      document.querySelector(".close").style.display = "none";
      modal.style.display = "block"
   }
   setInterval(expireCheck,500)
}


function gisLoaded() {
   tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      access_type: 'offline',
      expires_in: 43200,
      callback: ''
   });
   gisInited = true;
}

async function expireCheck() {
  if (gapi.auth.getToken()) {
    var data = await (await fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + gapi.auth.getToken().access_token)).json();
    if (data.error == "invalid_token") {
       localStorage.setItem("gapi_token","")
       location.reload()
    }
  }
}

function handleAuthClick() {
   tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
         throw (resp);
      }
      localStorage.setItem('gapi_token', JSON.stringify(gapi.client.getToken()));
      location.reload()
   }
   if (gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({
         prompt: 'consent',
         access_type: 'offline',
         expires_in: '3600'
      });
   } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({
         prompt: ''
      });
   }
}
function handleSignoutClick() {
   const token = gapi.client.getToken();
   if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      localStorage.setItem("gapi_token","")
      window.top.location.reload()
   }
}
