const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const data = require('./data');

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    details: 'The service is operating as expected.',
    timestamp: (new Date()).toISOString()
  });
});

app.get('/data', (req, res) => {
  res.status(200).json({
    count: 100,
    data: data
  });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});

