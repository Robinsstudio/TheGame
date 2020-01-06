const express = require('express');
const app = express();

app.use('/', require('./thegame'));

app.listen(8080);