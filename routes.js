module.exports = function () {
  var models = require('./models'),
    passport = require('passport');

  function _login(req, res) {
console.log("In _login");
    if (req.session.user)
      return res.json({error: "You'r logged in!"});

console.log("_login 1");
console.log("req.body");
console.log(req.body);
console.log("req.query");
console.log(req.query);

    if (!req.body || !req.body.email || !req.body.password) {
      if (req.query && req.query.email && req.query.password) {
        req.body = {};
        req.body.email = req.query.email;
        req.body.password = req.query.password;
      } 
      else 
        return res.status(400).json({error: "Bad request"});
    }

console.log("_login 2");

    models.User.nothing();
    models.User.findAll(function(error, users){});

    models.User.authenticate(req.body.email, req.body.password, function (err, user) {
console.log("_login 3");
      if ('number' === typeof err)
        return res.status(err).json({error: user});

console.log("_login 4");
      if (!user || err)
        return res.status(400).json({error: err});

      req.session.user = {
        id: user._id,
        name: user.name,
        email: user.email
      };

console.log("_login 5");
      res.json(req.session.user);
    });
  };

  function _logout(req, res) {
console.log("In _logout");
    req.session.destroy(function (err) {
      if (err)
        return res.status(500).json({error: "Internal service error."});
      delete req.session;
      res.json({success: "Good bye!"});
    });
  };

  function _info() {
    return [
      passport.authenticate('bearer', { session: false }),
      function (req, res) {
        res.json({ user_id: req.user.id, name: req.user.name, scope: req.authInfo.scope })
      }
    ];
  };

  return {
    login: _login,
    logout: _logout,
    info: _info
  };
}