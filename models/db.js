var mongoose  = require("mongoose");

mongoose.connect('mongodb+srv://test:test@cluster1-sfksn.mongodb.net/test?retryWrites=true',function(err){
  if(!err){
      console.log('Connected to mongo');
  }else{
      console.log('Failed to connect to mongo');
  }
});

require('./user.js');
