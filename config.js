'use strict';
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

exports.DATABASE_URL = process.env.DATABASE_URL ||
                      'mongodb://user:password1@ds119930.mlab.com:19930/phillyjournal';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      '';
exports.PORT = process.env.PORT || 8080;

