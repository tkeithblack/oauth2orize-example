
var mongoose=require('mongoose');
var con = mongoose.createConnection();
var connecting = function(err){
console.log("Please Wait connecting \t"+con.readyState);
};
var disconnecting = function(err){
console.log("Please Wait Disconnecting \t"+con.readyState);
};
var connected = function(err){
console.log("Connection Connected\t"+con.readyState);
};
var disconnected= function(err){
console.log("Connection DisConnected \t"+con.readyState);
};
con.on("connecting",connecting);
con.on("disconnecting",disconnecting);
con.on("connected",connected);
con.on("disconnected",disconnected);
// con.open("mongodb://127.0.0.1:27017/oauth2orize");
con.open("mongodb://localhost/oauth2orize");

// mongoose.connect('mongodb://127.0.0.1:27017/one2many');

// mongoose.connection.once('open', function() {
//     console.log('MongoDB event open');
//     console.log('MongoDB connected [%s]', url);

//     mongoose.connection.on('connected', function() {
//         console.log('MongoDB event connected');
//     });

//     mongoose.connection.on('disconnected', function() {
//         logger.warn('MongoDB event disconnected');
//     });


//     mongoose.connection.on('reconnected', function() {
//         console.log('MongoDB event reconnected');
//     });

//     mongoose.connection.on('error', function(err) {
//         console.log('MongoDB event error: ' + err);
//     });

//     return server.start();
// });

// mongoose.connect('mongodb://localhost/oauth2orize', {}, function(err) {
//   console.log("Inside: mongoose.connectl...");
//     if (err) {
//         console.log('MongoDB connection error: ' + err);
//         process.exit(1);
//     }
// });

// User
var UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String }
});
UserSchema.methods.comparePassword = function (password) {
  return this.password === password;
};
UserSchema.methods.getRoleId = function () {
  return this.role || 'guest';
};


UserSchema.statics.nothing = function() {
    return ;
};


UserSchema.statics.findAll = function(err, callback) {

try {
  console.error.bind(console, 'test console error')
  console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);

    this.find({}, function(error, users){
        users.forEach(function(user){
            console.log(user.userName) // ... works fine
        })
        callback(error, usersLessThan10);
    })
} 
catch (exception) {
  console.log("find call exception: " + exception);
}
}

UserSchema.statics.authenticate = function (email, password, next) {
console.log("In UserSchema.statics.authenticate");

console.log("mongoose.connection.readyState: " + mongoose.connection.readyState);

  this.findOne({ email: email }, function (err, user) {
console.log("UserSchema.statics.authenticate 1");
    if (err)
      return next(500, 'Internal service error');

console.log("UserSchema.statics.authenticate 2");
    if (!user || !user.comparePassword(password))
      return next(403, 'E-mail or password invalid');

console.log("UserSchema.statics.authenticate 3");
    return next(null, user);
  });
};
exports.User = mongoose.model('User', UserSchema);

// Client
var ClientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.ObjectId, ref: 'User' },
  secret: { type: String },
  redirect_uri: { type: String }
});
exports.Client = mongoose.model('Client', ClientSchema);

// AuthorizationCode
var AuthorizationCodeSchema = new mongoose.Schema({
  code: { type: String },
  client_id: { type: mongoose.Schema.ObjectId, ref: 'Client' },
  user_id: { type: mongoose.Schema.ObjectId, ref: 'User' },
  redirect_uri: { type: String },
  scope: { type: String }
});
exports.AuthorizationCode = mongoose.model('AuthorizationCode', AuthorizationCodeSchema);

// AccessToken
var AccessTokenSchema = new mongoose.Schema({
  oauth_token: { type: String },
  user_id: { type: mongoose.Schema.ObjectId, ref: 'User' },
  client_id: { type: mongoose.Schema.ObjectId, ref: 'Client' },
  expires: { type: Number },
  scope: { type: String }
});
exports.AccessToken = mongoose.model('AccessToken', AccessTokenSchema);
