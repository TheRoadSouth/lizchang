var nconf = require('nconf');

var nconf_setup = (function(nconf) {
  // command line conf overrides both config.json and defaults
  nconf.env().argv();
  // config.json will override defaults
  nconf.file('./config.json');
  // if no other config default to this
  nconf.defaults({
    "database": {
      "protocol": "mongodb://",
      "host": "127.0.0.1",
      "port": "27017",
      "name": "lizchang"
    },
    "email": "your@email.com"
  })
})(nconf);

module.exports = nconf_setup;
