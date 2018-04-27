'use strict';

/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework

// require('dotenv').config();

// let redirect_uri =
//   process.env.REDIRECT_URI ||
//   'http://localhost:8888/callback';

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Database Setup
// const client = new pg.Client(process.env.DATABASE_URL);
// client.connect();
// client.on('error', err => console.error(err));

// Application Middleware
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(express.static('./public'));


app.get('/test', (req, res) => res.send('hello world, it works'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));