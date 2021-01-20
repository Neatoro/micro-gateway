const express = require('express');

const app = express();

app.get('/hello', (request, response) => response.send('Hello World'));

app.listen(2001, () => {
    console.log('simple service started');
});