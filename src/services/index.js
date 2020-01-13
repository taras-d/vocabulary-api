const users = require('./users/users.service.js');
const me = require('./me/me.service.js');
const words = require('./words/words.service.js');
const randomWords = require('./random-words/random-words.service.js');
const wordsStats = require('./words-stats/words-stats.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(me);
  app.configure(words);
  app.configure(randomWords);
  app.configure(wordsStats);
};
