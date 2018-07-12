var express = require('express');
var router = express.Router();
const User = require('../models/usermodel');
const Student = require('../models/studentmodel');
const HOD = require('../models/hodmodel');
const TPO = require('../models/tpomodel');
const POSTS = require('../models/postmodel');

router.get('/', function(req, res, next) {
    res.send('respond with a resource:users');
  });

//POST Notification
  
router.post('/sendpost', (req, res) => {
    var now=new Date();
    
    var post = new POSTS();
    post.postedby = req.body.postedby;
    post.postedon = now;
    post.title = req.body.title;
    post.content = req.body.content;
    post.year=req.body.year;
    post.dept=req.body.dept;
    post.prole=req.body.prole;
    console.log(post);
    post.save(function(err,result){
      if(err)
      {
        console.log(result);
        res.json({"error":err});
        }
      else{
        console.log(" posted successfully...");
        res.json({msg:"posted successfully",result:result});
    }
  });
  });
  
  //GET Notification
  
  router.get('/postsforstudents/:dept/:year',function(req,res)
   {
     var quary= {$and:[{$or:[ {dept:req.params.dept},{dept:'all'}]},{$or:[{year:req.params.year},{year:'all'}]}]};

    POSTS.find(quary,function(err,posts){
        if(err){
            return res.json({"error":err});}
            else{
            //console.log(posts);
            return res.json(posts);
            }
   });});

router.get('/postsforhods/:dept',function(req,res)
{
    //var quary= {$or:[ {dept:'all'},{dept:req.params.dept}]}; //To get TPO and HOD posts as well
    var quary= {$and:[ {prole:'hod'},{dept:req.params.dept}]}; // To get only HOD Posts
    POSTS.find(quary,function(err,posts){
        if(err){
            return res.json({"error":err});}
            else{
            //console.log(posts);
            return res.json(posts);
            }
    });
});

router.get('/postsfortpos',function(req,res)
{
    var quary = {prole:'tpo'};
    POSTS.find(quary,function(err,posts){
        if(err){
            return res.json({"error":err});}
            else{
            //console.log(posts);
            return res.json(posts);
            }
    });
});
  
  //GET Notification By Year
  
  router.get('/viewposts/:dept/:year',function(req,res)
   {
             
    POSTS.find({year:req.params.year,dept:req.params.dept},function(err,posts){
        if(err){
            return res.json({"error":err});}
            else{
            return res.json({"output":posts})
            }
   });
  });
  
  //GET Notification By Role
  
  router.get('/postsbyrole/:dept/:year/:role',function(req,res)
   {
    var quary= {$and:[{$or:[ {dept:req.params.dept},{dept:'all'}]},{$or:[{year:req.params.year},{year:'all'}]},{prole:req.params.role}]};
    POSTS.find(quary,function(err,posts){
        if(err){
            return res.json({"error":err});}
            else{
            return res.json(posts)
            }
   });
  });

  //Delete Users
router.delete('/deleteposts/:postid', function(req, res, next) {
    POSTS.getPostByPostId(req.params.postid,function(err,user){
      if(err)
      {
        res.json({"error":err});
      }
      else if(!user){
       res.json({success:false,msg:"Post Not Found"});
      }
      else 
      {
        POSTS.remove({_id:req.params.postid},function(err,result){
          if(err){
            res.json(err);}
          else if(result.n==1){
            //res.json({success:true,msg:"Deleted in All Users"}); 
            res.json({success:true,msg:"POST Delted Succesfully"}); 
              }
          else{
            res.json({success:false,msg:"Something Went Wrong"});
          }
          
    });
    }
  });
});
  
  //Update Admin
  router.put('/updateposts/:postid', function(req, res, next) {
    POSTS.getPostByPostId(req.params.postid,function(err,user){
      //console.log(user);
      if(err)
      {
        res.json({"error":err});
      }
      else if(!user){
       res.json({success:false,msg:"POST Not Found"});
      }
      else 
      {
        var now=new Date();
        var newpost={
            postedby:req.body.postedby,
            postedon:now,
            title:req.body.title,
            content:req.body.content,
            year:req.body.year,
            dept:req.body.dept,
            prole:req.body.prole
        };

        //console.log(req.file.path);
        //console.log(user);
          POSTS.update({_id:req.params.postid},newpost,function(err,result){
            if(err)
            {
              console.log(err);
              res.json(err);
            }
            else if(result.n==1)
            {
              //res.json({success:true,msg:"Profile Updated Succesfully"});
              console.log(result); 
                  res.json({success:true,msg:"updated succesfully"});
                  console.log(result); 
            }
            else
            {
                  console.log(reslt);
                  res.json({success:false,msg:JSON.stringify(result)});
            }
        });
    }
    });
});

module.exports = router;
