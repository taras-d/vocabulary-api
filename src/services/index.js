const users = require('./users/users.service.js');
const me = require('./me/me.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(me);
};
