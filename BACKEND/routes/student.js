var express = require('express');
var router = express.Router();
const User = require('../models/usermodel');
const Student = require('../models/studentmodel');
const HOD = require('../models/hodmodel');
const TPO = require('../models/tpomodel');
var fs=require('fs');
const accountSid = 'AC185b0e6905c3b98ed0f49dbc1aedbda5';
const authToken = 'a0205c20c7ab323e31d0bb286c228047';
const client = require('twilio')(accountSid, authToken);
const nodemailer=require('nodemailer');

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

router.get('/send_resp_to_phone/:userid/:role', function(req, res, next) {
  if(req.params.role=="student")
  Student.getStudentByUserId(req.params.userid,function(err,userdata){
    console.log(userdata);
    client.messages.create({
      from: '+17062568730',
      //to:userdata.phone
      to: '+919494918564',
      body:"Dear User,Your Email is:"+userdata.email+",with userid:"+userdata.userid+",Thanks for Contacting"
    }).then((message) => console.log(message.sid)); res.json({success:true,msg:"Message Sent Suucessfully"});
  });
  else if(req.params.role=="hod")
  HOD.getHodByUserId(req.params.userid,function(err,userdata){
    console.log(userdata);
    client.messages.create({
      from: '+17062568730',
      //to:userdata.phone
      to: '+919494918564',
      body:"Dear User,Your Email is:"+userdata.email+",with userid:"+userdata.userid+",Thanks for Contacting"
    }).then((message) => console.log(message.sid)); res.json({success:true,msg:"Message Sent Suucessfully"});
  });
  else if(req.params.role=="tpo")
  TPO.getTpoByUserId(req.params.userid,function(err,userdata){
    console.log(userdata);
    client.messages.create({
      from: '+17062568730',
      //to:userdata.phone
      to: '+919494918564',
      body:"Dear User,Your Email is:"+userdata.email+",with userid:"+userdata.userid+",Thanks for Contacting"
    }).then((message) => console.log(message.sid)); res.json({success:true,msg:"Message Sent Suucessfully"});
  });
  else{
    res.json({success:false,msg:"User Role Not Found"})
  }
});

router.get('/tposearch',function(req,res,next){
    let quary;
    var depts=JSON.parse(req.query.depts);
    var years=JSON.parse(req.query.years);
    var minaggrigt=JSON.parse(req.query.minaggrigt);
    if(depts.length!=0&&years.length!=0)
      quary={dept:{$in:depts},year:{$in:years},aggregate:{$gte:minaggrigt},plcmntinterst:"yes"}
    else if(depts.length==0)
      quary={year:{$in:years},aggregate:{$gte:minaggrigt},plcmntinterst:"yes"}
    else if(years.length==0)
      quary={dept:{$in:depts},aggregate:{$gte:minaggrigt},plcmntinterst:"yes"}
    else if(minaggrigt==0||minaggrigt==undefined||minaggrigt=="")
      quary={dept:{$in:depts},year:{$in:years},plcmntinterst:"yes"}
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
                if(reqrddata.image=="abc"||!fs.existsSync('./public/uploads/'+reqrddata.image))
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
                if(reqrddata.image=="abc"||!fs.existsSync('./public/uploads/'+reqrddata.image))
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
                if(reqrddata.image=="abc"||!fs.existsSync('./public/uploads/'+reqrddata.image))
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
            Student.findOne({userid:req.params.userid},function(err,reqrddata){
              //console.log("comes second here");
              if(err) throw err;
              else
              {
                Student.update({userid:req.params.userid},newuser,function(err,reslt){
                if(err){
                  console.log(err);
                  res.json(err);}
                else if(reslt.n==1)
                {
                  //Confirmation to Student Email
                  if(reqrddata.email!=newuser.email){
                  const output = `
              <p>Dear Student, This is a Confirmation that your Basic Details Updated</p>
              <h3>Profile Details</h3>
              <ul>  
                  <li>E-mail: ${newuser.email}</li>
                  <li>User Id: ${newuser.userid}</li>
                  <li>Role: ${newuser.role}</li>
                  <li>Department: ${newuser.dept}</li>
              </ul>
              <h3>Note:</h3>
              <p>If you not requested this please write a request at <a href="https://cryptic-temple-72625.herokuapp.com/#/contactadmin">contact admin</a>, To again update it</p>
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
                  to: reqrddata.email, // list of receivers
                  subject: 'Regarding CMS Basic Profile Update', // Subject line
                  html: output
              };
          
              // send mail with defined transport object
              transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log("The message was sent!");
                  console.log(info);
                  });
                  const output2 = `
              <p>Dear Student, This is a Confirmation that your Basic Details Updated</p>
              <h3>Profile Details</h3>
              <ul>  
                  <li>E-mail: ${newuser.email}</li>
                  <li>User Id: ${newuser.userid}</li>
                  <li>Role: ${newuser.role}</li>
                  <li>Department: ${newuser.dept}</li>
              </ul>
              <h3>Note:</h3>
              <p>If you forgot your password, <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">click here</a></p>
              `;
              
              let  transporter2 = nodemailer.createTransport({
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
              let mailOptions2 = {
                  from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                  to: newuser.email, // list of receivers
                  subject: 'Regarding CMS Basic Profile Update', // Subject line
                  html: output2
              };
          
              // send mail with defined transport object
              transporter2.sendMail(mailOptions2, (error, info) => {
                  if (error) {
                      return console.log(error);
                  }
                  console.log("The message was sent!");
                  console.log(info);
                  });
                    res.json({success:true,msg:"Student Updated Succesfully"});
                    console.log(reslt); 
                  }
                  else{
                    const output2 = `
            <p>Dear Student, This is a Confirmation that your Basic Details Updated</p>
            <h3>Profile Details</h3>
            <ul>  
                <li>E-mail: ${newuser.email}</li>
                <li>User Id: ${newuser.userid}</li>
                <li>Role: ${newuser.role}</li>
                <li>Department: ${newuser.dept}</li>
            </ul>
            <h3>Note:</h3>
            <p>If you forgot your password, <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">click here</a></p>
            `;
            
            let  transporter2 = nodemailer.createTransport({
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
            let mailOptions2 = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: newuser.email, // list of receivers
                subject: 'Regarding CMS Basic Profile Update', // Subject line
                html: output2
            };
        
            // send mail with defined transport object
            transporter2.sendMail(mailOptions2, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                });
                  res.json({success:true,msg:"Student Updated Succesfully"});
                  console.log(reslt);
                  }
                }
                else{
                  console.log(reslt);
                  res.json({success:false,msg:JSON.stringify(reslt)});
                }
              });
            }
          });}
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
          else if(result.n==1)
          {
            //res.json({success:true,msg:"Profile Updated Succesfully"});
            console.log(result); 
            HOD.findOne({userid:req.params.userid},function(err,reqrddata){
              //console.log("comes second here");
              if(err) throw err;
              else
              {
                HOD.update({userid:req.params.userid},newuser,function(err,reslt){
                if(err){
                  console.log(err);
                  res.json(err);}
                else if(reslt.n==1){
                  if(reqrddata.email!=newuser.email){
                  const output = `
                  <p>Dear HOD, This is a Confirmation that your Basic Details Updated</p>
                  <h3>Profile Details</h3>
                  <ul>  
                      <li>E-mail: ${newuser.email}</li>
                      <li>User Id: ${newuser.userid}</li>
                      <li>Role: ${newuser.role}</li>
                      <li>Department: ${newuser.dept}</li>
                  </ul>
                  <h3>Note:</h3>
                  <p>If you not requested this please write a request at <a href="https://cryptic-temple-72625.herokuapp.com/#/contactadmin">contact admin</a>, To again update it</p>
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
                      to: reqrddata.email, // list of receivers
                      subject: 'Regarding CMS Basic Profile Update', // Subject line
                      html: output
                  };
              
                  // send mail with defined transport object
                  transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      console.log("The message was sent!");
                      console.log(info);
                      });
                      const output2 = `
                  <p>Dear HOD, This is a Confirmation that your Basic Details Updated</p>
                  <h3>Profile Details</h3>
                  <ul>  
                      <li>E-mail: ${newuser.email}</li>
                      <li>User Id: ${newuser.userid}</li>
                      <li>Role: ${newuser.role}</li>
                      <li>Department: ${newuser.dept}</li>
                  </ul>
                  <h3>Note:</h3>
                  <p>If you forgot your password, <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">click here</a></p>
                  `;
                  
                  let  transporter2 = nodemailer.createTransport({
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
                  let mailOptions2 = {
                      from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                      to: newuser.email, // list of receivers
                      subject: 'Regarding CMS Basic Profile Update', // Subject line
                      html: output2
                  };
              
                  // send mail with defined transport object
                  transporter2.sendMail(mailOptions2, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      console.log("The message was sent!");
                      console.log(info);
                      });
                  res.json({success:true,msg:"HOD Updated Succesfully"});
                  console.log(reslt); 
                  }
                  else{
                    const output2 = `
                  <p>Dear HOD, This is a Confirmation that your Basic Details Updated</p>
                  <h3>Profile Details</h3>
                  <ul>  
                      <li>E-mail: ${newuser.email}</li>
                      <li>User Id: ${newuser.userid}</li>
                      <li>Role: ${newuser.role}</li>
                      <li>Department: ${newuser.dept}</li>
                  </ul>
                  <h3>Note:</h3>
                  <p>If you forgot your password, <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">click here</a></p>
                  `;
                  
                  let  transporter2 = nodemailer.createTransport({
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
                  let mailOptions2 = {
                      from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                      to: newuser.email, // list of receivers
                      subject: 'Regarding CMS Basic Profile Update', // Subject line
                      html: output2
                  };
              
                  // send mail with defined transport object
                  transporter2.sendMail(mailOptions2, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      console.log("The message was sent!");
                      console.log(info);
                      });
                  res.json({success:true,msg:"HOD Updated Succesfully"});
                  console.log(reslt); 

                  }
                }
                else{
                  console.log(reslt);
                  res.json({success:false,msg:JSON.stringify(reslt)});
                }
              });
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
            TPO.findOne({userid:req.params.userid},function(err,reqrddata){
              //console.log("comes second here");
              if(err) throw err;
              else
              {
                TPO.update({userid:req.params.userid},newuser,function(err,reslt){
                if(err){
                  console.log(err);
                  res.json(err);}
                else if(reslt.n==1){
                  if(reqrddata.email!=newuser.email){
                  const output = `
                  <p>Dear Tpo, This is a Confirmation that your Basic Details Updated</p>
                  <h3>Profile Details</h3>
                  <ul>  
                      <li>E-mail: ${newuser.email}</li>
                      <li>User Id: ${newuser.userid}</li>
                      <li>Role: ${newuser.role}</li>
                  </ul>
                  <h3>Note:</h3>
                  <p>If you not requested this please write a request at <a href="https://cryptic-temple-72625.herokuapp.com/#/contactadmin">contact admin</a>, To again update it</p>
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
                      to: reqrddata.email, // list of receivers
                      subject: 'Regarding CMS Basic Profile Update', // Subject line
                      html: output
                  };
              
                  // send mail with defined transport object
                  transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      console.log("The message was sent!");
                      console.log(info);
                      });
                      const output2 = `
                  <p>Dear Tpo, This is a Confirmation that your Basic Details Updated</p>
                  <h3>Profile Details</h3>
                  <ul>  
                      <li>E-mail: ${newuser.email}</li>
                      <li>User Id: ${newuser.userid}</li>
                      <li>Role: ${newuser.role}</li>
                  </ul>
                  <h3>Note:</h3>
                  <p>If you forgot your password, <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">click here</a></p>
                  `;
                  
                  let  transporter2 = nodemailer.createTransport({
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
                  let mailOptions2 = {
                      from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                      to: newuser.email, // list of receivers
                      subject: 'Regarding CMS Basic Profile Update', // Subject line
                      html: output2
                  };
              
                  // send mail with defined transport object
                  transporter2.sendMail(mailOptions2, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      console.log("The message was sent!");
                      console.log(info);
                      });
                  res.json({success:true,msg:"TPO Updated Succesfully"});
                  console.log(reslt); 
                    }
                  else{
                    const output2 = `
                    <p>Dear Tpo, This is a Confirmation that your Basic Details Updated</p>
                    <h3>Profile Details</h3>
                    <ul>  
                        <li>E-mail: ${newuser.email}</li>
                        <li>User Id: ${newuser.userid}</li>
                        <li>Role: ${newuser.role}</li>
                    </ul>
                    <h3>Note:</h3>
                    <p>If you forgot your password, <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">click here</a></p>
                    `;
                    
                    let  transporter2 = nodemailer.createTransport({
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
                    let mailOptions2 = {
                        from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                        to: newuser.email, // list of receivers
                        subject: 'Regarding CMS Basic Profile Update', // Subject line
                        html: output2
                    };
                
                    // send mail with defined transport object
                    transporter2.sendMail(mailOptions2, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log("The message was sent!");
                        console.log(info);
                        });
                    res.json({success:true,msg:"TPO Updated Succesfully"});
                    console.log(reslt);

                  }
                }
                else{
                  console.log(reslt);
                  res.json({success:false,msg:JSON.stringify(reslt)});
                }
              });
            }
          });}
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