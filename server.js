'use strict';
const express = require('express'); // Express web server framework
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const pg = require('pg');

require('dotenv').config();


let access_token = '';
let refresh_token = '';

// ************ Application Setup *************
const PORT = process.env.PORT || 8888;
const CLIENT_URL = process.env.CLIENT_URL;
const app = express();

// ************ Database Setup *************
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

let redirect_uri =
process.env.REDIRECT_URI ||
'http://localhost:8888/callback';


// ************ Application Middleware ************
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));


// ************ Spotify OAuth & API Calls ************
const stateKey = 'spotify_auth_state';
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


app.use(express.static(__dirname + '/public'))
  .use(cookieParser());

app.get('/login', function(req, res) {

  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  let scope = 'user-top-read';
  console.log('checking /login');
  console.log('redirect_uri', redirect_uri);
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        // let access_token = body.access_token,
        //   refresh_token = body.refresh_token;
        access_token = body.access_token;
        refresh_token = body.refresh_token;


        // const options = {
        //   url: 'https://api.spotify.com/v1/me',
        //   headers: { 'Authorization': 'Bearer ' + access_token },
        //   json: true
        // };

        const options2 = {
          url: 'https://api.spotify.com/v1/me/top/artists?time_range=medium_range&limit=1',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(options2, function(error, response, body) {
          console.log(body);
          console.log(response);
        });

        // use the access token to access the Spotify Web API

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/test', (req, res) => res.send('It\'s working!'));

//test database info being stored

app.post('/feedback', express.urlencoded({ extended: true }), (request, response) => {

  const { comment } = request.body; 

  client.query(`
        INSERT INTO feedback 
        (comment)
        VALUES ($1);
    `,
    [
      comment,
    ])
    // function(err) {
    // if (err) console.error('error',err);
    // response.send(result)
    .then(() => response.sendStatus(201));
});


//   client.query(`
//         INSERT INTO feedback (comment) VALUES ('$comment');
//     `).then(result => response.send(result));
// })

// let url = 'https://api.spotify.com/v1/me/top/artists/';

// app.get(url, (req, res) => console.log(res));

app.post('/feedback', (req, res) => {
const b = req.body
console.log('test' + b)
res.send(b)
})


console.log('Listening on 8888');
app.listen(PORT, () => console.log(`Server started on port ${PORT}!`));

// app.post('/index', (request, response) => {
//   response.send('test post');
// });
