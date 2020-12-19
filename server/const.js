const env = process.env.NODE_ENV || 'development';
const config = require('./config/config.json')[env];

// config.user = "gtajvjctgkvloj";
// config.password = "9b529dec30fd11bbd8594fc19cbc7fb0158ab45101904228d9a8a5dadf03c3b6";
// config.database = "dc0mj5nvn9mbe4";

module.exports = {
    CONST_page_limit: 10,
    version: 'FYP2 V1.1_1912A',
    dbPool: config
};
