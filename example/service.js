const express = require('express');

const app = express();

const router = new express.Router();

router.get('/hello', (request, response) => response.send('Hello World'));

app.use('/api/v1.0', router);

app.listen(2001, () => {
    console.log('simple service started');
});