const mongoose = require('mongoose');

// User Schema
const PostSchema = mongoose.Schema ({
  postedby: {
    type: String,
    required:true
  },
  postedon: {
        type: Date,
        required:true
      },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  year:
  {
    type:String
  },
  dept:
  {
    type:String
  },
  prole:{
    type:String,
    default:'abc'
  }
});

const POSTS = module.exports = mongoose.model("notifications",PostSchema);

module.exports.getPostByPostId = function(userid,callback){
  POSTS.findOne({_id:userid},callback);
}