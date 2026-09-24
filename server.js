'use strict';

const path = require('path');
const { createStaticServer, listen } = require('./static-server');
const { handleContact } = require('./contact-api');

const port = Number.parseInt(process.env.PORT || '3000', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const server = createStaticServer({
  root: path.join(__dirname, 'site'),
  onRequest: (req, res) => handleContact(req, res)
});
listen(server, port, process.env.HOST);
