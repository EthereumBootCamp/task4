const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect('mongodb://localhost/jwt');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connect');
});

const userSchema = mongoose.Schema({
  //for the users
  userName: String,
  passWord: String,
  email: String
});

const User = mongoose.model('User', userSchema);

module.exports.User = User;
