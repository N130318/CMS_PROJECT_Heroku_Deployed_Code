var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var dbconfig = require("../config/db");

var StudentSchema = mongoose.Schema({
  userid:{ 
    type: String, 
    unique: true, 
    require: true 
  },
  name:{ 
    type: String 
  },
  dob:{ 
    type: String 
  },
  phone:{ 
    type: String 
  },
  email:{ 
    type: String 
  },
  aggregate:{
    type: String
  },
  address:{
    type: String
  },
  year:{
    type: String
  },
  dept:{
    type: String,
    require: true
  },
  role:{
    type: String,
    required: true
  },
  image:{
    type:String,
    default:'abc'
  }
});

const Student = module.exports = mongoose.model("students",StudentSchema);

// module.exports.getStudentById = function(id,callback){
//   Student.findById(id,callback);
// }

module.exports.getStudentByUserId = function(userid,callback){
  Student.findOne({userid:userid},callback);
}


module.exports.addStudent = function(newstudent,callback){
      newstudent.save(callback);
}

module.exports.getAllStudents = function(callback){
  Student.find(callback);
}

module.exports.getStudentByDept = function(dept,callback){
  Student.find({dept:dept},callback);
}
module.exports.getStudentByDeptYear = function(dept,year,callback){
  if(year=='all'){
    Student.find({dept:dept},callback);
  }else{
  Student.find({dept:dept,year:year},callback);
  }
}