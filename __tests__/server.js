const path = require('path');
const mock = require('../index');
const express = require('express');

const app = express();

mock(app, path.resolve(__dirname, './mockData.js'));

app.listen(30801);