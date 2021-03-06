const express = require('express');
const { port, originsAllowed } = require('./config');
const robotoff = require('./routes/robotoff');
const { initCron } = require('./utils/cron');

// init Cron
initCron();

const app = express();

app.use((req, res, next) => {
  if (req.headers.origin) {
    const { origin } = req.headers;

    if (originsAllowed.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Methods', 'GET,POST');
      res.header('Access-Control-Allow-Credentials', true);
    } else
      return res
        .status(403)
        .send(`CORS Same origin (${origin}): modify config.js`);
  }
  return next();
});

app.use('/robotoff', robotoff);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) =>
  res.status(500).json({ error: err.toString() }),
);

app.get('/', (req, res) => res.send('Express server is up and running!'));
app.listen(port, (err) => {
  if (err) throw err;
  process.stdout.write(`Express server listening on ${port}\n`);
});
