var express = require('express');
var router = express.Router();
const User = require('../models/usermodel');
const Student = require('../models/studentmodel');
const HOD = require('../models/hodmodel');
const TPO = require('../models/tpomodel');
var fs=require('fs');

router.get('/getstudent/:userid', function(req, res, next) {
    Student.getStudentByUserId(req.params.userid,function(err,student){
      res.json(student);
    });
  });

//GET Students By Dept and Year

router.get('/getstudentbydeptyear/:dept/:year', function(req, res, next) {
  Student.getStudentByDeptYear(req.params.dept,req.params.year,function(err,userdata){
    res.json(userdata);
  });
});

router.get('/tposearch',function(req,res,next){
    let quary;
    var depts=JSON.parse(req.query.depts);
    var years=JSON.parse(req.query.years);
    var minaggrigt=JSON.parse(req.query.minaggrigt);
    if(depts.length!=0&&years.length!=0)
      quary={dept:{$in:depts},year:{$in:years},aggregate:{$gte:minaggrigt}}
    else if(depts.length==0)
      quary={year:{$in:years},aggregate:{$gte:minaggrigt}}
    else if(years.length==0)
      quary={dept:{$in:depts},aggregate:{$gte:minaggrigt}}
    else if(minaggrigt==0||minaggrigt==undefined||minaggrigt=="")
      quary={dept:{$in:depts},year:{$in:years}}
    else
      return res.json([]);
    Student.find(quary,function(err,result){
      if(err) throw err;
      res.json(result);
    })
})

//Delete Users
router.delete('/delete/:userid', function(req, res, next) {
  var uid=req.params.userid;
  User.getUserByUserId(req.params.userid,function(err,user){
    if(err)
    {
      res.json({"error":err});
    }
    else if(!user){
     res.json({success:false,msg:"User Not Found"});
    }
    else 
    {
      User.remove({userid:req.params.userid},function(err,result){
        if(err){
          res.json(err);}
        else if(result.n==1){
          //res.json({success:true,msg:"Deleted in All Users"}); 
          if(user.role=="student")
          {
            Student.findOne({userid:uid},function(err,reqrddata){
              //console.log("comes second here");
              if(err) throw err;
              else
              {
                console.log(reqrddata);
                //console.log(reqrddata.image);
                if(reqrddata.image=="abc")
                {
                  console.log('No Profile Pic Available');
                  Student.remove({userid:req.params.userid},function(err,result1){
                    if(err)
                    {
                      res.json(err);
                    }
                    else if(result1.n==1)
                    { 
                      //console.log("comes first here");
                      res.json({success:true,msg:"Deleted in Allusers And Students"}); 
                    }
                    else{
                      res.json({success:false,msg:json.stringify(result1)});
                    }
                    });
                }
                else{
                  try {
                    fs.unlink('./public/uploads/'+reqrddata.image, (err) => {
                      if (err) throw err;
                      Student.remove({userid:req.params.userid},function(err,result1){
                        if(err)
                        {
                          res.json(err);
                        }
                        else if(result1.n==1)
                        { 
                          console.log("comes first here");
                          res.json({success:true,msg:"Deleted in Allusers And Students"}); 
                        }
                        else{
                          res.json({success:false,msg:json.stringify(result1)});
                        }
                        });
                    });
                    console.log('successfully deleted /tmp/hello');
                  } 
                  catch (err) 
                  {
                    // handle the error
                  }
                }
              }
            });
          }
          //Update HOD
          else if(user.role=="hod")
          {
            HOD.findOne({userid:uid},function(err,reqrddata){
              //console.log("comes second here");
              if(err) throw err;
              else
              {
                //console.log(reqrddata);
                //console.log(reqrddata.image);
                if(reqrddata.image=="abc")
                {
                  console.log('No Profile Pic Available');
                  HOD.remove({userid:req.params.userid},function(err,result1){
                    if(err)
                    {
                      res.json(err);
                    }
                    else if(result1.n==1)
                    { 
                      //console.log("comes first here");
                      res.json({success:true,msg:"Deleted in Allusers And Students"}); 
                    }
                    else{
                      res.json({success:false,msg:json.stringify(result1)});
                    }
                    });
                }
                else{
                  try {
                    fs.unlink('./public/uploads/'+reqrddata.image, (err) => {
                      if (err) throw err;
                      HOD.remove({userid:req.params.userid},function(err,result1){
                        if(err)
                        {
                          res.json(err);
                        }
                        else if(result1.n==1)
                        { 
                          console.log("comes first here");
                          res.json({success:true,msg:"Deleted in Allusers And HOD"}); 
                        }
                        else{
                          res.json({success:false,msg:json.stringify(result1)});
                        }
                        });
                    });
                    console.log('successfully deleted /tmp/hello');
                  } 
                  catch (err) 
                  {
                    // handle the error
                  }
                }
              }
            });
          }
          //Update TPO
          else if(user.role=="tpo")
          {
            TPO.findOne({userid:uid},function(err,reqrddata){
              //console.log("comes second here");
              if(err) throw err;
              else
              {
                console.log(reqrddata);
                //console.log(reqrddata.image);
                if(reqrddata.image=="abc")
                {
                  console.log('No Profile Pic Available');
                  TPO.remove({userid:req.params.userid},function(err,result1){
                    if(err)
                    {
                      res.json(err);
                    }
                    else if(result1.n==1)
                    { 
                      //console.log("comes first here");
                      res.json({success:true,msg:"Deleted in Allusers And Students"}); 
                    }
                    else{
                      res.json({success:false,msg:json.stringify(result1)});
                    }
                    });
                }
                else{
                  try {
                    fs.unlink('./public/uploads/'+reqrddata.image, (err) => {
                      if (err) throw err;
                      TPO.remove({userid:req.params.userid},function(err,result1){
                        if(err)
                        {
                          res.json(err);
                        }
                        else if(result1.n==1)
                        { 
                          console.log("comes first here");
                          res.json({success:true,msg:"Deleted in Allusers And Tpos"}); 
                        }
                        else{
                          res.json({success:false,msg:json.stringify(result1)});
                        }
                        });
                    });
                    console.log('successfully deleted /tmp/hello');
                  } 
                  catch (err) 
                  {
                    // handle the error
                  }
                }
              }
            });
          }
          else if(user.role=="admin")
          {
            res.json({success:true,msg:"Deleted in Allusers"}); 
          }
          else{
            console.log("Invalid Deletion");
            res.json({success:false,msg:"Invalid Role Based Deletion"});
          }
        }
        else{
          res.json({success:false,msg:"Invalid Deletion in AllUsers"});
        }
        
      })
    }
  })
});

//Update Admin
router.put('/updateusers/:userid', function(req, res, next) {
  User.getUserByUserId(req.params.userid,function(err,user){
    //console.log(user);
    if(err)
    {
      res.json({"error":err});
    }
    else if(!user){
     res.json({success:false,msg:"User Not Found"});
    }
    else 
    {
      var user={
        userid:req.body.userid,
        role:req.body.role,
        dept:req.body.dept
      };
      var newuser={
        userid:req.body.userid,
        role:req.body.role,
        dept:req.body.dept,
        email:req.body.email
      };
      //console.log(req.file.path);
      //console.log(user);
      if(user.role=="student")
      {
        User.update({userid:req.params.userid},user,function(err,result){
          if(err){
            console.log(err);
            res.json(err);}
          else if(result.n==1){
            //res.json({success:true,msg:"Profile Updated Succesfully"});
            console.log(result); 
            Student.update({userid:req.params.userid},newuser,function(err,reslt){
              if(err){
                console.log(err);
                res.json(err);}
              else if(reslt.n==1){
                res.json({success:true,msg:"Student Updated Succesfully"});
                console.log(reslt); 
              }
              else{
                console.log(reslt);
                res.json({success:false,msg:JSON.stringify(reslt)});
              }
            });
          }
          else{
            console.log(result);
            res.json({success:false,msg:JSON.stringify(result)});
          }
        });
      }
      //Update HOD
      else if(user.role=="hod")
      {
        User.update({userid:req.params.userid},user,function(err,result){
          if(err){
            console.log(err);
            res.json(err);}
          else if(result.n==1){
            //res.json({success:true,msg:"Profile Updated Succesfully"});
            console.log(result); 
            HOD.update({userid:req.params.userid},newuser,function(err,reslt){
              if(err){
                console.log(err);
                res.json(err);}
              else if(reslt.n==1){
                res.json({success:true,msg:"HOD Updated Succesfully"});
                console.log(reslt); 
              }
              else{
                console.log(reslt);
                res.json({success:false,msg:JSON.stringify(reslt)});
              }
            });
          }
          else{
            console.log(result);
            res.json({success:false,msg:JSON.stringify(result)});
          }
        });
      }
      //Update TPO
      else if(user.role=="tpo")
      {
        User.update({userid:req.params.userid},user,function(err,result){
          if(err){
            console.log(err);
            res.json(err);}
          else if(result.n==1){
            //res.json({success:true,msg:"Profile Updated Succesfully"});
            console.log(result); 
            TPO.update({userid:req.params.userid},newuser,function(err,reslt){
              if(err){
                console.log(err);
                res.json(err);}
              else if(reslt.n==1){
                res.json({success:true,msg:"TPO Updated Succesfully"});
                console.log(reslt); 
              }
              else{
                console.log(reslt);
                res.json({success:false,msg:JSON.stringify(reslt)});
              }
            });
          }
          else{
            console.log(result);
            res.json({success:false,msg:JSON.stringify(result)});
          }
        });
      }
      else{
        console.log("Invalid Update");
        res.json({success:false,msg:"Invalid Update"});
      }
    }
    
  })
});
module.exports = router;