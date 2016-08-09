'use strict';

const extend = require('extend');
const fs = require('fs');

const logger = require('../logger');
const route_helper = require('../helper/route');
const scanner = require('../scanner');

const file_max_size = require('../config').get('FILE:MAX_SIZE');
const router = require('express').Router();
const upload = require('multer')({limits: {fileSize: file_max_size}, dest: '/tmp/'});


function handle_err(res, err) {
  logger.warn(err);
  res.status(err.status || 500).render("error", {
    message: err.message || "Oops, something bad happened.",
    error: err
  });
}



router.get('/', (req, res) => {
  route_helper.do_render(res, 'usage-scan');
});

router.get('/file', (req, res) => {
  route_helper.do_render(res, 'usage-scan-file');
});

router.post('/file', upload.single('file'), (req, res) => {
  scanner.scan_file(
    req.file ? req.file.path : undefined,
    route_helper.collect_options(req)
  ).then(
    (result) => {
      logger.info(result);
      res.send(result);
    }, (err) => {
      handle_err(res, err);
    });
});


router.get('/uri', (req, res) => {
  route_helper.do_render(res, 'usage-scan-uri');
});

router.post('/uri', (req, res) => {
  scanner.scan_uri(
    req.body.uri,
    route_helper.collect_options(req)
  ).then(
    (result) => {
      logger.info(result);
      res.send(result);
    }, (err) => {
      return handle_err(res, err);
    });
});


router.get('/text', (req, res) => {
  route_helper.do_render(res, 'usage-scan-text');
});

router.post('/text', (req, res) => {
  scanner.scan_text(
    req.body.text,
    route_helper.collect_options(req)
  ).then(
    (result) => {
      logger.info(result);
      res.send(result);
    }, (err) => {
      return handle_err(res, err);
    });
});

module.exports = router;
