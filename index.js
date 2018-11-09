const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db/index.js')
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


app.post('/login',function(req, res){
  //searching if the user exist in the schema and checking if the password is right, and create session for him.  
  var userName = req.body.username;
  var password = req.body.password;
  db.User.findOne({userName:userName}, function(err, data){
    if(err){
        console.log(err);
      }
      else {
        if (!data) {
          res.sendStatus(404)
        }
        else {
          bcrypt.compare(password, data.passWord, function(err, match){
            if(match) {  
          jwt.sign({user}, 'secretkey', (err, token) => {
            res.json({
              token
            });
          }); 
             
            }
            else {
              console.log('err');
              res.sendStatus(404)
            }
          })
        }

      }
    })
  })


app.post('/signup', function(req, res){
  //checking if the user exist in the schema, if not, hashing his passowrd and create session for him and save his data inside our schema 
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  
  db.User.find({
    userName: username
  }, function(err, data){

    if (err) {
      console.log(err);
    }
    else {
     
        bcrypt.genSalt(10, function (err, salt) {
        if (err) console.log(err);
        bcrypt.hash(password, salt, function(err, hash) {
          let user = db.User({
            userName: username,
            passWord: hash,
            email: email
           
          })
          user.save((err, data) =>{
            if (err){
              console.log(err);
            }
            else {
              console.log(data);
             jwt.sign({user}, 'secretkey', (err, token) => {
            res.json({
              token
            });
          });
            }
          })
        })
      })
      
    }
  })
})


app.post('/api/posts', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      console.log(req.token)
      console.log("verify error")
      res.sendStatus(403);
    } else {

      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    console.log("header error")
    res.sendStatus(403);
  }

}

app.listen(3000, () => console.log('Server started on port 3000'));