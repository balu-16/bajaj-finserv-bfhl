const express = require('express');

const { buildResponse } = require('../modules/bfhl/buildResponse');

const router = express.Router();

router.post('/', (req, res) => {
  if (!req.body || !Array.isArray(req.body.data)) {
    return res.status(400).json({
      error: 'Request body must include a data array.',
    });
  }

  return res.json(buildResponse(req.body.data));
});

module.exports = router;
