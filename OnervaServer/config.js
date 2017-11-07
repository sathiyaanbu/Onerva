var prod_config = {};
prod_config.production = true;
prod_config.port    = process.env.PORT || 8668;
prod_config.db_name = 'onerva2';
prod_config.api_url = 'https://onervahoiva.fi/onerva2/api';

var test_config = {};
test_config.production = false;
test_config.port    = process.env.PORT || 8778;
test_config.db_name = 'onerva2_test';
test_config.api_url = 'http://onervahoiva.fi/onerva2dev/api';

var local_config = {};
local_config.production = false;
local_config.port    = process.env.PORT || 8778;
local_config.db_name = 'onerva2_test';
local_config.api_url = 'http://localhost:' + local_config.port + '/api';

//module.exports = test_config;
module.exports = prod_config;
