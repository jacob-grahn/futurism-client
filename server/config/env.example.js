/**
 * These are the env variables that will need to be set
 * @type {string}
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

process.env.MONGO_URI = 'mongodb://user:pass@host.com:port/futurism-development';
process.env.REDIS_URI = 'redis://user:pass@host.com:port/';

process.env.S3_KEY = '';
process.env.S3_SECRET_KEY = '';