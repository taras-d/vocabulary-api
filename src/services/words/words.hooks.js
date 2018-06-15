const { authenticate } = require('@feathersjs/authentication').hooks;
const { disableMultiItemChange, disallow } = require('feathers-hooks-common');
const errors = require('@feathersjs/errors');
const _ = require('lodash');

const findWord = (text, model) => {
  return model.findOne({
    text: new RegExp(`^${text}$`, 'i')
  }).exec();
};

const skipDuplicates = async context => {
  const models = context.app.get('mongooseClient').models;
  const words = Array.isArray(context.data)? context.data: [context.data];
  const unique = [];

  for (let i = 0; i < words.length; ++i) {
    const word = words[i];
    if (
      !unique.find(w => _.toLower(w.text) === _.toLower(word.text)) &&
      !await findWord(word.text, models.words)
    ) {
      unique.push(word);
    }
  }

  context.data = unique;

  const result = {
    inserted: unique.length,
    duplicates: words.length - unique.length
  };

  if (unique.length) {
    context.dispatch = result;
  } else {
    context.result = result;
  }
};

const checkWordBeforePatch = async context => {
  const data = context.data;

  if ('text' in data) {
    const models = context.app.get('mongooseClient').models;
    const word = await findWord(data.text, models.words);

    if (word && word.id !== context.id) {
      throw new errors.BadRequest(`Word with text "${data.text}" already exist`);
    }
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      skipDuplicates
    ],
    update: [
      disallow('external')
    ],
    patch: [
      disableMultiItemChange(),
      checkWordBeforePatch
    ],
    remove: [
      disableMultiItemChange()
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
