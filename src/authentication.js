const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');
const errors = require('@feathersjs/errors');
const _ = require('lodash');

class CustomVerifier extends jwt.Verifier {

  verify(req, payload, done) {
    const userId = payload.userId;
    if (!userId) {
      done(new errors.NotAuthenticated('No user'));
    }

    this.service.get(userId).then(user => {
      done(null, user, { userId });
    }).catch(() => {
      done(new errors.NotAuthenticated('No user'));
    });
  }

}

module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(
    jwt({ Verifier: CustomVerifier })
  );
  app.configure(local());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        context => {
          _.defaults(context.data, { strategy: 'local' });
        },
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    },
    after: {
      create: [
        context => {
          context.result.user = _.omit(context.params.user, ['password']);
        }
      ]
    }
  });
};
