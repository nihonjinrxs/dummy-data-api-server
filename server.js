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
  let queryFrom, queryCount, startId, endId;

  console.log(req.query);

  if (req.query.count) {
    queryCount = parseInt(req.query.count, 10);
    if (isNaN(queryCount)) { queryCount = 100; }
    queryCount = Math.max(Math.min(queryCount, 500), 1);
  } else {
    queryCount = 100;
  }

  if (req.query.from) {
    queryFrom = parseInt(req.query.from, 10);
    if (isNaN(queryFrom)) { queryFrom = 1000 - queryCount; }
  } else {
    queryFrom = 1000 - queryCount;
  }

  startId = Math.max(Math.min(queryFrom, 1000), 1);
  endId = Math.min(startId + queryCount, 1000);

  res.status(200).json({
    count: endId - startId,
    data: data.filter(
      (record) => record.id >= startId && record.id < endId
    )
  });
});

async function closeGracefully (signal) {
  console.log(`Received signal to terminate: ${signal}`)
  process.exit(1)
}
process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});