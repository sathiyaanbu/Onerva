var config = {};
config.port    = process.env.PORT || 8778;
config.db_name = 'onerva2_test_temp';
config.api_url = 'http://localhost:' + config.port + '/api';

module.exports = config;
