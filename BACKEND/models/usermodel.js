var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var dbconfig = require("../config/db");

var UserSchema = mongoose.Schema({
  userid:{
    type: String,
    unique: true,
    require: true
  },
  password:{
    type: String,
    require:true
  },
  role: {
    type: String,
    require: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: String
  // profile:{
  //   type:Boolean,
  //   default: false

  // }
});

const User = module.exports = mongoose.model("users",UserSchema);


// module.exports.getUserById = function(id,callback){
//   User.findById(id,callback);
// }

module.exports.getUserByUserId = function(userid,callback){
  User.findOne({userid:userid},callback);
}

module.exports.removeUserByUserId = function(userid,callback){
  User.remove({userid:userid},callback);
}

module.exports.addUser = function(newuser,callback){
  bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(newuser.password,salt,function(err,hash){
      if(err) throw err;
      newuser.password = hash;
      newuser.save(callback);
      });
    });
}

module.exports.compareUserPassword = function(Password,hash,callback){
  bcrypt.compare(Password,hash,function(err,ismatch){
    if(err) throw err;
    callback(null, ismatch);
  });
}