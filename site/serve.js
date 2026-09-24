'use strict';

// Local preview for the active static site: node site/serve.js (http://localhost:3100)
const { createStaticServer, listen } = require('../static-server');
const { handleContact } = require('../contact-api');

const port = Number.parseInt(process.env.PORT || '3100', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const server = createStaticServer({
  root: __dirname,
  onRequest: (req, res) => handleContact(req, res)
});
listen(server, port, process.env.HOST);
