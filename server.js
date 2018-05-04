'use strict';

// Application dependencies
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const pg = require('pg');

// Application Setup
const app = express();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


// Application Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// app.use(express.static('./public'));


app.get('/test', (req, res) => res.send('hello world, it works'));
