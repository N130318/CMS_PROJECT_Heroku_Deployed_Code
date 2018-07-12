var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var dbconfig = require("../config/db");

var TpoSchema = mongoose.Schema({
  userid:{ 
      type: String, 
      unique: true, 
      require: true 
  },
  name:{ 
      type: String 
  },
  qualification:{
      type:String
  },
  phone:{
      type: String 
  },
  email:{
      type: String 
  },
  address:{
      type:String
  },
  role:{
    type: String,
    required: true
  },
  image:{
    type:String
  }
});

const TPO = module.exports = mongoose.model("tpos",TpoSchema);

// module.exports.getHodById = function(id,callback){
//   TPO.findById(id,callback);
// }

module.exports.getTpoByUserId = function(userid,callback){
  TPO.findOne({userid:userid},callback);
}


module.exports.addTpo = function(newtpo,callback){
      newtpo.save(callback);
}

module.exports.getAllTpos = function(callback) {
    //const query = {userid: userid};
    TPO.find({},callback);
  }
