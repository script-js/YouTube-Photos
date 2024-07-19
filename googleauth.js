const CLIENT_ID = '1042189889229-ecp73b2drihjcm65930381l07m3qm24a.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAdAjrwSHXXNIrq5XqcI6NACfO8UDVwjfY';
var FNAME = "syncjsdata.json"

// Discovery URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

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
   }
   if (!location.href.includes("login")) {setInterval(expireCheck,500)}
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
