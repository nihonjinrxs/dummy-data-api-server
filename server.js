const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const data = require('./data')
  .sort((a, b) => {
    return (a.last_reading < b.last_reading) ? -1 : (
      (a.last_reading > b.last_reading) ? 1 : 0);
  })
  .map((record, index) => {
    record.id = index + 1;
    return record;
  });

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
  const dataLength = data.length;
  const maxPageSize = 500;
  const defaultPageSize = 100;

  if (req.query.count) {
    queryCount = parseInt(req.query.count, 10);
    if (isNaN(queryCount)) {
      queryCount = defaultPageSize;
    }
    queryCount = Math.max(Math.min(queryCount, maxPageSize), 1);
  } else {
    queryCount = defaultPageSize;
  }

  if (req.query.from) {
    queryFrom = parseInt(req.query.from, 10);
    if (isNaN(queryFrom)) {
      queryFrom = dataLength - queryCount + 1;
    }
  } else {
    queryFrom = dataLength - queryCount + 1;
  }

  startId = Math.max(Math.min(queryFrom, dataLength), 1);
  endId = Math.min(startId + queryCount, dataLength + 1);

  res.status(200).json({
    count: endId - startId,
    data: data.filter(
      (record) => record.id >= startId && record.id < endId
    )
  });
});

async function closeGracefully (signal) {
  console.log(`Received signal to terminate: ${signal}`)
  process.exit(1);
}
process.on('SIGINT', closeGracefully)
process.on('SIGTERM', closeGracefully)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});