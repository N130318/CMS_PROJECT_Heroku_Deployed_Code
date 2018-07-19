var express = require('express');
var router = express.Router();
var mergejson = require('merge-json');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/db');
const User = require('../models/usermodel');
const Student = require('../models/studentmodel');
const HOD = require('../models/hodmodel');
const TPO = require('../models/tpomodel');
const multer = require('multer');
var nodemailer = require('nodemailer');
var randomstring = require("randomstring");
var upperCase = require('upper-case');
var crypto=require('crypto');
var fs=require('fs');
var mime=require('mime');
var path=require('path');
var DIR = './public/uploads/';

var useremail;
var userpassword;

const storage = multer.diskStorage({
  destination: function(req, image, cb) {
    cb(null,  DIR);
  },
  filename: function(req, image, cb) {
    // cb(null, new Date().toISOString() + image.originalname);
    // crypto.pseudoRandomBytes(16, function (err, raw) {
    //   cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(image.mimetype));
    // });
    crypto.pseudoRandomBytes(6, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(image.originalname));
      
    })
  }
});

const fileFilter = (req, image, cb) => {
  // reject a file
  if (image.mimetype === 'image/jpeg' || image.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload = multer({
  // destination:'../uploads/',
  
storage: storage,
// limits: {
//   fileSize: 1024 * 1024 * 5
// },
fileFilter: fileFilter
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource:users');
});

router.post('/login', function(req, res, next) {
  var userid = req.body.userid;
  var password = req.body.password;
  var token;
  User.getUserByUserId(userid,function(err,user){
    if(err) throw err;
    // console.log(userid);
    if(!user){
      return res.json({success:false,msg:"user not found."});
    }
    User.compareUserPassword(password,user.password,function(err,ismatch){
      if(err) throw err;
      if(ismatch){
        //code to get profile
        if(user.role=='student'){
          Student.getStudentByUserId(userid,function(err,userdata){
            if(err) throw err;
            if(!userdata){
              return res.json({success: false,msg:"student not found."});
            }else{
              token = jwt.sign(userdata.toObject(), config.secret, {expiresIn: 3600 });
              return res.json({success:true,msg:"Student login success.",token: "Bearer "+token,user:userdata});
            }
          });
        }
        else if(user.role=='hod'){
          HOD.getHodByUserId(userid,function(err,userdata){
            if(err) throw err;
            if(!userdata){
              return res.json({success: false,msg:"HOD not found."});
            }else{
              token = jwt.sign(userdata.toObject(), config.secret, {expiresIn: 3600 });
              return res.json({success:true,msg:"HOD login success.",token: "Bearer "+token,user:userdata});
            }
          });
        }
        else if(user.role=='tpo'){
          TPO.getTpoByUserId(userid,function(err,userdata){
            if(err) throw err;
            if(!userdata){
              return res.json({success: false,msg:"TPO not found."});
            }else{
              token = jwt.sign(userdata.toObject(), config.secret, {expiresIn: 3600 });
              return res.json({success:true,msg:"TPO login success.",token: "Bearer "+token,user:userdata});
            }
          });
        }
        else if(user.role=='admin'){
          token = jwt.sign(user.toObject(), config.secret, {expiresIn: 3600 });
          return res.json({success:true,msg:"Admin login success.",token: "Bearer "+token,user:user});
        }
        else{
          return res.json({success: false,msg:"unknown role found"});
        }
        
      }else{
        return res.json({success:false,msg:"wrong password."});
      }
    });
  });
});

router.post('/adduser',function(req,res,next){
  var newuser = new User();
  newuser.userid =req.body.userid;
  newuser.password =req.body.password;
  newuser.role =req.body.role;
  userpassword =newuser.password;
  if(newuser.role=="hod"|| newuser.role=="tpo"||newuser.role=="student"){
    newuser.password=randomstring.generate({length: 8,charset: 'alphanumeric'});;
    userpassword=newuser.password;
  }
  console.log(userpassword);
  console.log(newuser.password);
  // User.addUser(newuser, function(err,user){
  //       if(err){
  //         res.json({success:false , msg:"UserID Already Exist in users."});
  //       }else{
  //         res.json({success:true , msg:"added in users."});
  //       }
  //     });
  //   });
  var roleUser;
  if(newuser.role=="student"){
    roleUser = new Student();
    roleUser.userid =req.body.userid;
    //roleUser.password =req.body.password;
    roleUser.role = req.body.role;
    roleUser.dept = req.body.dept;
    roleUser.email = req.body.email;
    useremail = req.body.email;
    User.addUser(newuser, function(err,user){
      if(err){
        res.json({success:false , msg:"UserID Already Exist in users."});
      }else{
        Student.addStudent(roleUser,function(err,user){
          if(err){
            res.json({success:false , msg:"Some Student Already Existed with Same UserID"});
          }else{
            const output = `<p>Dear ${upperCase(req.body.role)},</p>
                            <h2>Login Credentials</h2>
                            <p>Please find your Login Credentials to CMS Account is</p>
                            <ul>  
                              <li>User Name: ${req.body.userid}</li>
                              <li>Password: ${userpassword}</li>
                            </ul>
                            <p>You can login into your CMS Account form <a href="https://cryptic-temple-72625.herokuapp.com/#/login">here</a></p>
                            <h3>Note:</h3>
                            <p>Please Don't Share these credentials with anyone</p>
                            <p>Please Use Google Chrome For better Experience`;
            let transporter = nodemailer.createTransport({
              host:"smtp.gmail.com",
              service: "Gmail",
              secure: false,
              port: 465,
              auth: {
                type:"OAuth2",
                user: "cms.feedback9144@gmail.com", // Your gmail address.
                clientId: "308394806162-05urrln2cdalmn3ulnfoh0timj0uf51q.apps.googleusercontent.com",
                clientSecret: "MaP1MuS2exIikaIyIuDk9uWq",
                refreshToken: "1/WStdUMULUA5lEXrEUKtbxEYVHNiXATvjetJuu4MaFZs"
                },
              tls:
              {
                    rejectUnauthorized:false
                }
              });
          
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: useremail,
                subject: 'CMS Credentials', // Subject line
                html: output // html body
            };
          
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                //res.json({"msg":"Mail Sent Successfully","succcess":"true"});
                });
                res.json({success:true , msg:"success in add student"});
          }
        });
      }
    });
  }
  else if(newuser.role=='hod'){
    roleUser = new HOD();
    roleUser.userid =req.body.userid;
    //roleUser.password =req.body.password;
    roleUser.role = req.body.role;
    roleUser.dept = req.body.dept;
    roleUser.email = req.body.email;
    useremail = req.body.email;
    User.addUser(newuser, function(err,user){
      if(err){
        console.log(err);
        res.json({success:false , msg:"UserID Already Exist in users."});
      }
      else{
        HOD.addHod(roleUser,function(err,hoduser){
          if(err){
            User.removeUserByUserId(req.body.userid,function(err,result){
              if(err){
                console.log(err);
              }
              else{
                console.log(result);
              }
            })
            res.json({success:false , msg:"HOD For this Dept Already exist."});
          }
          else{
            const output = `<p>Dear ${upperCase(req.body.role)},</p>
                            <h2>Login Credentials</h2>
                            <p>Please find your Login Credentials to CMS Account is</p>
                            <ul>  
                              <li>User Name: ${req.body.userid}</li>
                              <li>Password: ${userpassword}</li>
                            </ul>
                            <p>You can login into your CMS Account form <a href="https://cryptic-temple-72625.herokuapp.com/#/login">here</a></p>
                            <h3>Note:</h3>
                            <p>Please Don't Share these credentials with anyone</p>
                            <p>Please Use Google Chrome For better Experience`;
            let transporter = nodemailer.createTransport({
              host:"smtp.gmail.com",
              service: "Gmail",
              secure: false,
              port: 465,
              auth: {
                type:"OAuth2",
                user: "cms.feedback9144@gmail.com", // Your gmail address.
                clientId: "308394806162-05urrln2cdalmn3ulnfoh0timj0uf51q.apps.googleusercontent.com",
                clientSecret: "MaP1MuS2exIikaIyIuDk9uWq",
                refreshToken: "1/WStdUMULUA5lEXrEUKtbxEYVHNiXATvjetJuu4MaFZs"
                },
              tls:
              {
                    rejectUnauthorized:false
                }
              });
          
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: useremail,
                subject: 'CMS Credentials', // Subject line
                html: output // html body
            };
          
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                //res.json({"msg":"Mail Sent Successfully","succcess":"true"});
                });
                res.json({success:true , msg:"success in add HOD."});
          }
        });
      }
    });
  }
  else if(newuser.role=='tpo'){
    roleUser = new TPO();
    roleUser.userid =req.body.userid;
    //roleUser.password =req.body.password;
    roleUser.role = req.body.role;
    roleUser.email = req.body.email;
    useremail = req.body.email;
    User.addUser(newuser, function(err,user){
      if(err){
        res.json({success:false , msg:"UserID Already Exist in users."});
      }else{
        TPO.addTpo(roleUser,function(err,user){
          if(err){
            res.json({success:false , msg:"add TPO failed."});
          }else{
            const output = `<p>Dear ${upperCase(req.body.role)},</p>
                            <h2>Login Credentials</h2>
                            <p>Please find your Login Credentials to CMS Account is:</p>
                            <ul>  
                              <li>User Name: ${req.body.userid}</li>
                              <li>Password: ${userpassword}</li>
                            </ul>
                            <p>You can login into your CMS Account form <a href="https://cryptic-temple-72625.herokuapp.com/#/login">here</a></p>
                            <h3>Note:</h3>
                            <p>Please Don't Share these credentials with anyone</p>
                            <p>Please Use Google Chrome For better Experience`;
            let transporter = nodemailer.createTransport({
              host:"smtp.gmail.com",
              service: "Gmail",
              secure: false,
              port: 465,
              auth: {
                type:"OAuth2",
                user: "cms.feedback9144@gmail.com", // Your gmail address.
                clientId: "308394806162-05urrln2cdalmn3ulnfoh0timj0uf51q.apps.googleusercontent.com",
                clientSecret: "MaP1MuS2exIikaIyIuDk9uWq",
                refreshToken: "1/WStdUMULUA5lEXrEUKtbxEYVHNiXATvjetJuu4MaFZs"
                },
              tls:
              {
                    rejectUnauthorized:false
                }
              });
          
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: useremail,
                subject: 'CMS Credentials', // Subject line
                html: output // html body
            };
          
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                //res.json({"msg":"Mail Sent Successfully","succcess":"true"});
                });
                res.json({success:true , msg:"success in add TPO."});
          }
        });
      }
    });
  }
  else if(newuser.role=="admin"){
    User.addUser(newuser, function(err,user){
      if(err){
        res.json({success:false , msg:"UserID Already Exist."});
      }else{
        const output = `<p>Dear Developer / Maintainer,</p>
                        <h2>New Admin Added</h2>
                        <p>Please Check New Added Admin Data</p>
                        <ul>  
                          <li>User Name: ${req.body.userid}</li>
                        </ul>
                        <p>This is a Confirmation to you on Adding New Admin By Another Admin</p>
                        <h3>Note:</h3>
                        <p>You can Manage(Update/Delete) Admins Only through <a href="https://mlab.com">https://mlab.com</a></p>
                        <p>You can use <a href="https://bcrypt-generator.com/">https://bcrypt-generator.com/</a>to Uodate Admin Password</p>`;
            let transporter = nodemailer.createTransport({
              host:"smtp.gmail.com",
              service: "Gmail",
              secure: false,
              port: 465,
              auth: {
                type:"OAuth2",
                user: "cms.feedback9144@gmail.com", // Your gmail address.
                clientId: "308394806162-05urrln2cdalmn3ulnfoh0timj0uf51q.apps.googleusercontent.com",
                clientSecret: "MaP1MuS2exIikaIyIuDk9uWq",
                refreshToken: "1/WStdUMULUA5lEXrEUKtbxEYVHNiXATvjetJuu4MaFZs"
                },
              tls:
              {
                    rejectUnauthorized:false
                }
              });
          
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: 'n130318@rguktn.ac.in',
                //to: 'n130318@rguktn.ac.in', Developer or Maintainer E-mail 
                subject: 'Regarding New Admin Creation', // Subject line
                html: output // html body
            };
          
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                //res.json({"msg":"Mail Sent Successfully","succcess":"true"});
                });
                res.json({success:true , msg:"success in add admin."});
      }
    });
  }
  else
    res.json({success:false , msg:"role can't be accepted"});
  });


  //geting user profile
router.get('/profile/:userid', function(req, res, next) {
  User.getUserByUserId(req.params.userid,function(err,user){
    console.log(user);
    if(err)
    {
      res.json({"error":err});
    }
    else if(!user){
     res.json({success:false,msg:"User Not Found"});
    }
    else 
    {
      // console.log(req.file.path);
      //console.log(user);
      if(user.role=="student")
      {
        //console.log(req.file.filename);
        Student.getStudentByUserId(req.params.userid,function(err,result){
            if(err){
              res.json(err);}
            else{
              res.json({success:true,user:result});
            }
          });
      }
      //Update HOD
      else if(user.role=="hod")
      {
        HOD.getHodByUserId(req.params.userid,function(err,result){
          if(err){
            res.json(err);}
          else{
            res.json({success:true,user:result});
          }
          });
      }
      //Update TPO
      else if(user.role=="tpo")
      {
        TPO.getTpoByUserId(req.params.userid,function(err,result){
            if(err){
              res.json(err);}
            else{
              res.json({success:true,user:result});
            }
          });
      }
      else{
        console.log("Invalid Update");
        res.json({success:false,msg:"Invalid Userid:"});
      }
    }
    
  })
});

//GET All Users

router.get('/getallusers', function(req, res, next) {
  User.getAllUsers(function(err,userdata){
    res.json(userdata);
  });
});

//GET Student By Department
router.get('/getstudentbydept/:dept', function(req, res, next) {
  Student.getStudentByDept(req.params.dept,function(err,userdata){
    res.json(userdata);
  });
});

//GET Student By Dept and Id
router.get('/getstudentbydeptuserid/:dept/:id', function(req, res, next) {
  Student.getStudentByDeptUserId(req.params.dept,req.params.id,function(err,userdata){
    res.json(userdata);
  });
});

//GET Students

router.get('/getallstudents', function(req, res, next) {
  Student.getAllStudents(function(err,data){
    res.json(data);
  });
});

//GET all HODs
router.get('/getallhods', function(req, res, next) {
  //res.send('respond with a resource:users');
  HOD.getAllHods(function(err,userdata){
    res.json(userdata);
    console.log(userdata);
  });
});

//GET all TPOs
router.get('/getalltpos', function(req, res, next) {
  //res.send('respond with a resource:users');
  TPO.getAllTpos(function(err,userdata){
    res.json(userdata);
    console.log(userdata);
  });
});

//Update Students Add Remaining fields storing also
router.put('/updateuser/:userid',multer({dest:"./public/uploads/"}).single('image'), function(req, res, next) {
  var uid=req.params.userid;
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
      //console.log(req.file.path);
      //console.log(user);
      if(user.role=="student")
      {
        //console.log(req.file.filename);
        Student.findOne({userid:uid},function(err,reqrddata){
          if(err) throw err;
          else
          {
            if(reqrddata.image=="abc"||(!fs.existsSync('./public/uploads/'+reqrddata.image)&&req.body.pic!="true")||(fs.existsSync('./public/uploads/'+reqrddata.image)&&req.body.pic!="true")||(!fs.existsSync('./public/uploads/'+reqrddata.image)&&req.body.pic=="true"))
            {
              console.log("Profile Pic Unavailable Or Not Selected");
              var stu={
                name:req.body.name,
                dob:req.body.dob,
                phone:req.body.phone, 
                email:req.body.email,
                aggregate:req.body.aggregate,
                address:req.body.address,
                year:req.body.year
              };
              if(req.body.pic=="true"){
                delete stu['pic'];
                stu=Object.assign(stu,{image:req.file.filename});
              }else{
                delete stu['pic'];
              }
              Student.update({userid:req.params.userid},stu,function(err,result){
                  if(err){
                    console.log(err);
                    res.json(err);}
                  else if(result.n==1){
                    res.json({success:true,msg:"Profile Updated Succesfully"});
                    console.log(result); 
                  }
                  else{
                    console.log(result);
                    res.json({success:false,msg:JSON.stringify(result)});
                  }
                });
            }
            else
            {
                try {
                  fs.unlink('./public/uploads/'+reqrddata.image, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted /tmp/hello');
                    var stu={
                      name:req.body.name,
                      dob:req.body.dob,
                      phone:req.body.phone, 
                      email:req.body.email,
                      aggregate:req.body.aggregate,
                      address:req.body.address,
                      year:req.body.year
                    };
                    if(req.body.pic=="true"){
                      delete stu['pic'];
                      stu=Object.assign(stu,{image:req.file.filename});
                    }else{
                      delete stu['pic'];
                    }
                    Student.update({userid:req.params.userid},stu,function(err,result){
                        if(err){
                          console.log(err);
                          res.json(err);}
                        else if(result.n==1){
                          res.json({success:true,msg:"Profile Updated Succesfully"});
                          console.log(result); 
                        }
                        else{
                          console.log(result);
                          res.json({success:false,msg:JSON.stringify(result)});
                        }
                      });
                  });
                } catch (err) {
                  // handle the error
                  if (err.code !== 'ENOENT') throw err;
                }
            }
          }
        });
      }
      //Update HOD
      else if(user.role=="hod")
      {
        HOD.findOne({userid:uid},function(err,reqrddata){
          if(err) throw err;
          else
          {
            if(reqrddata.image=="abc"||(!fs.existsSync('./public/uploads/'+reqrddata.image)&&req.body.pic!="true")||(fs.existsSync('./public/uploads/'+reqrddata.image)&&req.body.pic!="true")||(!fs.existsSync('./public/uploads/'+reqrddata.image)&&req.body.pic=="true"))
            {
              console.log("Profile Pic Unavailable Or Not Selected");
              var hod={
                name:req.body.name,
                qualification:req.body.qualification,
                phone:req.body.phone, 
                email:req.body.email,
                address:req.body.address
              };
              if(req.body.pic=="true"){
                delete hod['pic'];
                hod=Object.assign(hod,{image:req.file.filename});
              }else{
                delete hod['pic'];
              }
              HOD.update({userid:req.params.userid},hod,function(err,result){
                if(err){
                  res.json(err);}
                else if(result.n==1){
                  res.json({success:true,msg:"Profile Updated Succesfully"}); 
                }else{
                  res.json({success:false,msg:JSON.stringify(result)});
                }
              });
            }
            else
            {
                try {
                  fs.unlink('./public/uploads/'+reqrddata.image, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted /tmp/hello');
                    var hod={
                      name:req.body.name,
                      qualification:req.body.qualification,
                      phone:req.body.phone, 
                      email:req.body.email,
                      address:req.body.address
                    };
                    if(req.body.pic=="true"){
                      delete hod['pic'];
                      hod=Object.assign(hod,{image:req.file.filename});
                    }else{
                      delete hod['pic'];
                    }
                    HOD.update({userid:req.params.userid},hod,function(err,result){
                      if(err){
                        res.json(err);}
                      else if(result.n==1){
                        res.json({success:true,msg:"Profile Updated Succesfully"}); 
                      }else{
                        res.json({success:false,msg:JSON.stringify(result)});
                      }
                    });
                  });
                } catch (err) {
                  // handle the error
                    if (err.code !== 'ENOENT') throw err;
                }
            }
          }
        });
      }
      //Update TPO
      else if(user.role=="tpo")
      {
        TPO.findOne({userid:uid},function(err,reqrddata){
          if(err) throw err;
          else
          {
            if(reqrddata.image=="abc"||(!fs.existsSync('./public/uploads/'+reqrddata.image)&&req.body.pic!="true")||(fs.existsSync('./public/uploads/'+reqrddata.image)&&req.body.pic!="true")||(!fs.existsSync('./public/uploads/'+reqrddata.image)&&req.body.pic=="true"))
            {
              console.log("Profile Pic Unavailable Or Not Selected");
              var tpo={
                name:req.body.name,
                qualification:req.body.qualification,
                phone:req.body.phone, 
                email:req.body.email,
                address:req.body.address
              }
              if(req.body.pic=="true"){
                delete tpo['pic'];
                tpo=Object.assign(tpo,{image:req.file.filename});
              }else{
                delete tpo['pic'];
              }
              console.log(tpo.image);
              TPO.update({userid:req.params.userid},tpo,function(err,result){
                  if(err){
                    res.json(err);}
                  else if(result.n==1){
                    res.json({success:true,msg:"Profile Updated Succesfully"}); 
                  }else{
                    res.json({success:false,msg:json.stringify(result)});
                  }
                });
            }
            
            else
            {
                try {
                  fs.unlink('./public/uploads/'+reqrddata.image, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted /tmp/hello');
                    var tpo={
                        name:req.body.name,
                        qualification:req.body.qualification,
                        phone:req.body.phone, 
                        email:req.body.email,
                        address:req.body.address
                      }
                      if(req.body.pic=="true"){
                        delete tpo['pic'];
                        tpo=Object.assign(tpo,{image:req.file.filename});
                      }else{
                        delete tpo['pic'];
                      }
                      TPO.update({userid:req.params.userid},tpo,function(err,result){
                          if(err){
                            res.json(err);}
                          else if(result.n==1){
                            res.json({success:true,msg:"Profile Updated Succesfully"}); 
                          }else{
                            res.json({success:false,msg:json.stringify(result)});
                          }
                        });
                    });
                  } catch (err) {
                                // handle the error
                                if (err.code !== 'ENOENT') throw err;
                            }
                          }
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


router.post('/changepassword', function(req, res, next) {
  var userrole;
  var userid = req.body.userid;
  var oldpassword = req.body.oldpassword;
  var newpassword = req.body.newpassword;
  var confirmpassword = req.body.confirmpassword;
  if(newpassword==confirmpassword){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newpassword, salt, (err, hash) => {
        if(err) throw err;
        newpassword = hash;
      });
    });
    User.getUserByUserId(userid,function(err,user){
      if(err) throw err;
      if(!user)
      {
        return res.json({success:false,msg:"user not found."});
      }
      userrole=user.role;
      User.compareUserPassword(oldpassword,user.password,function(err,ismatch){
        if(err) throw err;
        if(ismatch)
        {
          User.findOneAndUpdate({userid:userid},{$set:{password:newpassword}},function(err,result){
            if(err){
              res.json(err);
            }
            else{
              if(userrole=="student")
              {
                Student.getStudentByUserId(userid,function(err,usersdata){
                  if(err) throw err;
                  if(!usersdata)
                  {
                    return res.json({success:false,msg:"Student not found."});
                  }
                const output = `
                <p>Dear ${upperCase(usersdata.role)},</p>
                <p>Your password for CMS Account has been succesfully changed.</p><br><br>
                <h3>Note</h3>
                <p>If you Not did this please click on <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">forgot password</a> to change your Immidiately,Kindly Cooperate with us.</p>
                `;
            
            let  transporter = nodemailer.createTransport({
              host:"smtp.gmail.com",
              service: "Gmail",
              secure: false,
              port: 465,
              auth: {
                type:"OAuth2",
                user: "cms.feedback9144@gmail.com", // Your gmail address.
                clientId: "308394806162-05urrln2cdalmn3ulnfoh0timj0uf51q.apps.googleusercontent.com",
                clientSecret: "MaP1MuS2exIikaIyIuDk9uWq",
                refreshToken: "1/WStdUMULUA5lEXrEUKtbxEYVHNiXATvjetJuu4MaFZs"
                },
              tls:
              {
                    rejectUnauthorized:false
                }
              });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: usersdata.email,
                subject: 'Regarding CMS Account Password Changed' , // Subject line
                text: 'Hello world?', // plain text body
                html: output, // html body
                replyTo:'cms.feedback9144@gmail.com'
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                res.json({success:true,msg:"Password Updated Succesfully."});
                });
              });
              }
              else if(userrole=="hod")
              {
                HOD.getHodByUserId(userid,function(err,usersdata){
                  if(err) throw err;
                  if(!usersdata)
                  {
                    return res.json({success:false,msg:"HOD not found."});
                  }
                console.log(usersdata);
                //Send Password Change E-Mail
                const output = `
                <p>Dear ${upperCase(usersdata.role)},</p>
                <p>Your password for CMS Account has been succesfully changed.</p><br><br>
                <h3>Note</h3>
                <p>If you Not did this please click on <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">forgot password</a> to change your Immidiately,Kindly Cooperate with us.</p>
                `;
            
            let  transporter = nodemailer.createTransport({
              host:"smtp.gmail.com",
              service: "Gmail",
              secure: false,
              port: 465,
              auth: {
                type:"OAuth2",
                user: "cms.feedback9144@gmail.com", // Your gmail address.
                clientId: "308394806162-05urrln2cdalmn3ulnfoh0timj0uf51q.apps.googleusercontent.com",
                clientSecret: "MaP1MuS2exIikaIyIuDk9uWq",
                refreshToken: "1/WStdUMULUA5lEXrEUKtbxEYVHNiXATvjetJuu4MaFZs"
                },
              tls:
              {
                    rejectUnauthorized:false
                }
              });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: usersdata.email,
                subject: 'Regarding CMS Account Password Changed' , // Subject line
                text: 'Hello world?', // plain text body
                html: output, // html body
                replyTo:'cms.feedback9144@gmail.com'
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                res.json({success:true,msg:"Password Updated Succesfully."});
                });
              });
              }
              else if(userrole=="tpo")
              {
                TPO.getTpoByUserId(userid,function(err,usersdata){
                  if(err) throw err;
                  if(!usersdata)
                  {
                    return res.json({success:false,msg:"TPO not found."});
                  }
                //Send Password Change E-Mail
                const output = `
                <p>Dear ${upperCase(usersdata.role)},</p>
                <p>Your password for CMS Account has been succesfully changed.</p><br><br>
                <h3>Note</h3>
                <p>If you Not did this please click on <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">forgot password</a> to change your Immidiately,Kindly Cooperate with us.</p>
                `;
            
            let  transporter = nodemailer.createTransport({
              host:"smtp.gmail.com",
              service: "Gmail",
              secure: false,
              port: 465,
              auth: {
                type:"OAuth2",
                user: "cms.feedback9144@gmail.com", // Your gmail address.
                clientId: "308394806162-05urrln2cdalmn3ulnfoh0timj0uf51q.apps.googleusercontent.com",
                clientSecret: "MaP1MuS2exIikaIyIuDk9uWq",
                refreshToken: "1/WStdUMULUA5lEXrEUKtbxEYVHNiXATvjetJuu4MaFZs"
                },
              tls:
              {
                    rejectUnauthorized:false
                }
              });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: usersdata.email,
                subject: 'Regarding CMS Account Password Changed' , // Subject line
                text: 'Hello world?', // plain text body
                html: output, // html body
                replyTo:'cms.feedback9144@gmail.com'
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                res.json({success:true,msg:"Password Updated Succesfully."});
                });
              });
              }
              else{     //Admin Password Changed response
                res.json({success:true,msg:"Password Updated Succesfully."});
              }
            }
          });
        }
        else{
          return res.json({success:false,msg:"password update failed,Invalid Old Password."});
        }
      });
    });
  }
  else{
    res.json({success:false,msg:"Confirm Password and New Password Need to be Matched"});
  }
});


module.exports = router;
