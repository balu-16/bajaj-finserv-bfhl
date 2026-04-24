const cors = require('cors');
const express = require('express');

const bfhlRouter = require('./routes/bfhl');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/bfhl', bfhlRouter);
app.use('/api/bfhl', bfhlRouter);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found.',
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    error: 'Internal server error.',
  });
});

module.exports = app;
