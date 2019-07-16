const express = require('express');
const express_graphql = require('express-graphql');
const http = require('http');
const formidable = require('formidable');
const util = require('util');
const os = require('os');

const { loggerFactory } = require('./logger-factory');
const { uploadGraphqlFile } = require('./upload-client');

const { PORT, ROUTE } = require('./upload-server-config');
const logger = loggerFactory('upload-server');

// https://nodejs.org/api/http.html#http_server_settimeout_msecs_callback
const serverTimeout = process.env.UPLOAD_SERVER_TIMEOUT
  ? parseInt(process.env.UPLOAD_SERVER_TIMEOUT, 10)
  : 120000;

const createUploadApp = service => {
  const app = express();
  app
    .use(`/${ROUTE}`, (req, res, next) => {
      logger.info(
        'new %s request to %s, transfer-encoding: %s',
        req.method,
        `/${ROUTE}`,
        req.headers['transfer-encoding']
      );

      if (req.method != 'POST') {
        return res.sendStatus(404);
      }

      const form = new formidable.IncomingForm();

      form.uploadDir = os.tmpdir();

      form
        .on('fileBegin', (name, file) => {
          logger.info(
            '[%s] multipart file (%s) begin: -> %s',
            file.name,
            file.type,
            file.path
          );
        })
        .on('file', (name, file) => {
          logger.info(
            '[%s] multipart file (%s) end: -> %s',
            file.name,
            file.type,
            file.path
          );
        })
        /*
        .on('progress', (bytesReceived, bytesExpected) => {
          logger.info(
            'multipart file bytes: %d/%d',
            bytesReceived,
            bytesExpected
          );
        })
        */
        .on('aborted', () => {
          logger.error('multipart request aborted by the client');
        })
        .on('error', error => {
          logger.error('multipart error: %o', error);
          res.status(500).send({ error });
        })
        .on('end', () => {
          res.status(200).send({ ok: true });
        });

      form.parse(req);
    })
    .use((err, req, res, next) => {
      res.status(500).send(err);
    });

  return app;
};

const server = http.createServer(createUploadApp());
server.setTimeout(serverTimeout);
server.listen({ port: PORT }, () => {
  logger.info('📂  Server ready at %d (timeout: %d)', PORT, serverTimeout);
});
