'use strict';

// Production entry point: serves the generated site in public/ and handles the contact form API.
// Run `npm run build` first after editing anything in src/.
const path = require('path');
const { createStaticServer, listen } = require('./lib/static-server');
const { handleContact } = require('./lib/contact-api');

const port = Number.parseInt(process.env.PORT || '3000', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

const server = createStaticServer({
  root: path.join(__dirname, 'public'),
  notFound: '404.html',
  onRequest: (req, res) => handleContact(req, res)
});
listen(server, port, process.env.HOST);

// Hosts stop a container with SIGTERM on every deploy: finish requests in flight, then exit.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, () => {
    server.close(() => process.exit(0));
    server.closeIdleConnections();
    setTimeout(() => process.exit(0), 10_000).unref();
  });
}
