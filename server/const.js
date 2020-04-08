const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];

module.exports = {
    CONST_page_limit: 10,
    version: 'BETA V1.2.22B',
    dbPool: config
};
