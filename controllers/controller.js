var mongoose = require('mongoose');
var User = mongoose.model('users');

var welcome = function(req,res){
  res.send("hello")
};

var findAllUsers = function(req,res) {
  User.find(function(err, users) {
    if(!err){
      res.send(users)
    } else {
      res.sendStatus(404);
    }
  })
};

var findOneUser = function(req,res) {
  var userId = req.params.id;
  User.findById(userId,function(err,user){
      if(!err){
          res.send(cafe);
      }else{
          res.sendStatus(404);
      }
  });
}

var findUserByName = function(req,res) {
  var userName = req.params.name;
  User.find({name:userName},function(err,user){
      if(!err){
          res.send(user);
      }else{
          res.sendStatus(404);
      }
  });
};

module.exports.welcome = welcome;
module.exports.findAllUsers = findAllUsers;
module.exports.findOneUser = findOneUser;
module.exports.findUserByName = findUserByName;
