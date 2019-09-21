var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var async = require('async');
const User = require('../models/usermodel');
const Student = require('../models/studentmodel');
const HOD = require('../models/hodmodel');
const TPO = require('../models/tpomodel');
var xoauth2 = require('xoauth2');
var store=require("store");
var upperCase = require('upper-case');
const accountSid = 'AC185b0e6905c3b98ed0f49dbc1aedbda5';
const authToken = 'a0205c20c7ab323e31d0bb286c228047';
const client = require('twilio')(accountSid, authToken);
var conf;

router.get('/', function(req, res, next) {
    res.send('respond with a resource:mail');
  });

router.post('/feedback_send', (req, res) => {
    const output = `
      <p>You have a new contact request / Feedback</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>First Name: ${req.body.firstname}</li>
        <li>Last Name: ${req.body.lastname}</li>
        <li>Email: ${req.body.email}</li>
        <li>Address: ${req.body.address}</li>
        <li>Country: ${req.body.country}</li>
        <li>State: ${req.body.state}</li>
        <li>Zip: ${req.body.zip}</li>
        
      </ul>
      <h3>User Feedback / Request</h3>
      <p>${req.body.feedback}</p>
    `;
    
    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         xoauth2: xoauth2.createXOAuth2Generator({
    //             user: 'ch.mani9144@gmail.com',
    //             clientId: '1065186352070-05v0q1uaqo7qnrg5r4h766s7jjh1eotc.apps.googleusercontent.com',
    //             clientSecret: 'pg2rvLZRizl16_FnAWH4dLEh',
    //             refreshToken: '1/ZHtxyETfHzCvTWY0RD_yS-0TXnyGVa7e8h0_zUwLXa0'
    //         })
    //     }
    // });
    // let transporter = nodemailer.createTransport({
    //     host:"smtp.gmail.com",
    //     service: "gmail",
    //     secure: true,
    //     port: 465,
    //     auth: {
    //         type:"OAuth2",
    //         user: "cms.feedback9144@gmail.com", // Your gmail address.
    //         clientId: "1081972092385-qduabb5miam91ps1cqhfcqbigcujlstk.apps.googleusercontent.com",
    //         clientSecret: "-CvRFs4sBiazvyljL64kDuFk",
    //         refreshToken: "1/E8EVEFRxYZ1DyeDee6WsK8CWN71GCowdGbim2y6ckh8",
    //         accessToken: "ya29.GluKB4b_bQS6uHLYWFq_OnIXIWHGsaq-LWWIRpL9pP0Kq2zwCAQi1AsSugvVMS7bF6q24QYZnHvIZ10RhpC6v8_gsdH-jCa1HBozIVq7G8Nkga_jUA1vFRYN1yoA",
    //         expires: 1484314697598
    //     }
    // });
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
          user: 'cms.feedback9144@gmail.com',
          pass: 'password@9144'
        },
        tls:{
            rejectUnauthorized:false
        }
    });
  
    // setup email data with unicode symbols
    let mailOptions = {
        from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
        to: 'n130318@rguktn.ac.in', // list of receivers
        subject: 'CMS New User Educational Request / Feedback', // Subject line
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("The message was sent!");
        console.log(info);
        res.json({msg:"Feedback Sent Successfully",success:"true"});
        });
});

router.post('/send_user_req', (req, res) => {
    let useremail;
    var useremailoruid=req.body.emailoruid;
    var subject=req.body.subject;
    var userrole=req.body.role;
    if(userrole=='student')
    {
        Student.findOne({ $or: [ { email: useremailoruid }, {userid:useremailoruid } ] },function(err,user){
            //console.log(useremail);
            console.log(user);
            if(err)
            {
                throw err;
                console.log(err);
            }
            else if(user==[]||user==""||user==undefined)
            {
                res.json({sucess:false,msg:"No User Existed with Given User Id and Role combination. Please Provide Valid Details"})
            }
            else
            {
                useremail=user.email;
                const output = `
            <p> Dear Admin, You have a new Technical Issue</p>
            <h3>Request Details</h3>
            <ul>  
                <li>E-mail: ${useremail}</li>
                <li>Role: ${req.body.role}</li>
                <li>User Id: ${user.userid}</li>
                <li>Subject: ${req.body.subject}</li>
            </ul>
            <h3>User Request</h3>
            <p>${req.body.message}</p>
            `;
            
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                  user: 'cms.feedback9144@gmail.com',
                  pass: 'password@9144'
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: 'n130318@rguktn.ac.in', // list of receivers
                subject: req.body.subject , // Subject line
                text: 'Hello world?', // plain text body
                html: output, // html body
                replyTo:useremail
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                //if(req.body.message.indexOf("forgot userid")>0||req.body.message.indexOf("lost userid")>0||req.body.message.indexOf("userid")>0)
                //Send same mail with to as reply-to in mail with auto reply in case of forgot user name
                //is-autoreply
                });
                if(user.phone!=undefined){
                client.messages.create({
                    from: '+17062568730',
                    to: '+919494918564',
                    //to:user.phone
                    body: "Dear User,Your Request succefully sent,Regarding"+subject+",If you not did this write request at contact-admin"
                  }).then((message) => console.log(message.sid));conf=true;}
                else{
                    console.log();
                    conf=false;
                }
                  //Sending Confirmation to user e-mail
                  const output1 = `
            <p>Dear Student, Your Request Confirmation</p>
            <h3>Request Details</h3>
            <ul>  
                <li>Role: ${req.body.role}</li>
                <li>User Id or E-mail: ${useremailoruid}</li>
                <li>Subject: ${req.body.subject}</li>
            </ul>
            <h3>User Request</h3>
            <p>${req.body.message}</p>
            <h4>Note:</h4>
            <p>If not did this please write a request at <a href="https://cryptic-temple-72625.herokuapp.com/#/contactadmin"> contact-admin </a></p>
            `;
            
            let transporter1 = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                  user: 'cms.feedback9144@gmail.com',
                  pass: 'password@9144'
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions1 = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: useremail, // list of receivers
                subject: req.body.subject , // Subject line
                text: 'Hello world?', // plain text body
                html: output1, // html body
                replyTo:useremail
            };
        
            // send mail with defined transport object
            transporter1.sendMail(mailOptions1, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                //if(req.body.message.indexOf("forgot userid")>0||req.body.message.indexOf("lost userid")>0||req.body.message.indexOf("userid")>0)
                //Send same mail with to as reply-to in mail with auto reply in case of forgot user name
                //is-autoreply
                });
                if(conf){
                    res.json({msg:"Request Sent Successfully and a Confirmation Sent your Mobile and E-mail",success:"true"});
                }
                else{
                    res.json({msg:"Request Sent Successfully and a Confirmation Sent your E-mail.In case if you forgot email or lost email,Then ask chat bot as forgot password or update password you will get guidelines.",success:"true"});
                }
            }
        });
    }
    else if(userrole=='hod')
    {
        HOD.findOne({ $or: [ { email: useremailoruid }, {userid:useremailoruid } ] },function(err,user){
            if(err)
            {
                throw err;
                console.log(err);
            }
            else if(!user)
            {
                res.json({sucess:false,msg:"No User Existed with Given User Id and Role combination. Please Provide Valid Details"})
            }
            else{
                useremail=user.email;
                const output = `
            <p>Dear Admin, You have a new Technical Issue:</p>
            <h3>Request Details</h3>
            <ul>  
                <li>E-mail: ${useremail}</li>
                <li>Role: ${req.body.role}</li>
                <li>User Id: ${user.userid}</li>
                <li>Subject: ${req.body.subject}</li>
            </ul>
            <h3>User Request</h3>
            <p>${req.body.message}</p>
            `;
            
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                  user: 'cms.feedback9144@gmail.com',
                  pass: 'password@9144'
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: 'n130318@rguktn.ac.in', // list of receivers
                subject: req.body.subject, // Subject line
                text: 'Hello world?', // plain text body
                html: output, // html body
                replyTo:useremail
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                });
                if(user.phone!=undefined){
                client.messages.create({
                    from: '+17062568730',
                    to: '+919494918564',
                    //to:userdata.phone
                    body: "Dear User,Your Request succefully sent,Regarding"+subject+",If you not did this write request at contact-admin"
                  }).then((message) => console.log(message.sid));conf=true;
                }
                else{
                    console.log("Phone Number Unavailable");
                    conf=false;
                }
                  //Sending Confirmation to user e-mail
                  const output1 = `
            <p>Dear HOD, Your Request Confirmation</p>
            <h3>Request Details</h3>
            <ul>  
                <li>Role: ${req.body.role}</li>
                <li>User Id or E-mail: ${useremailoruid}</li>
                <li>Subject: ${req.body.subject}</li>
            </ul>
            <h3>User Request</h3>
            <p>${req.body.message}</p>
            <h4>Note:</h4>
            <p>If not did this please write a request at <a href="https://cryptic-temple-72625.herokuapp.com/#/contactadmin"> contact-admin </a></p>
            `;
            
            let transporter1 = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                  user: 'cms.feedback9144@gmail.com',
                  pass: 'password@9144'
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions1 = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: useremail, // list of receivers
                subject: req.body.subject , // Subject line
                text: 'Hello world?', // plain text body
                html: output1, // html body
                replyTo:useremail
            };
        
            // send mail with defined transport object
            transporter1.sendMail(mailOptions1, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                //if(req.body.message.indexOf("forgot userid")>0||req.body.message.indexOf("lost userid")>0||req.body.message.indexOf("userid")>0)
                //Send same mail with to as reply-to in mail with auto reply in case of forgot user name
                //is-autoreply
                });
                if(conf){
                    res.json({msg:"Request Sent Successfully and a Confirmation Sent your Mobile and E-mail",success:"true"});
                }
                else{
                    res.json({msg:"Request Sent Successfully and a Confirmation Sent your E-mail.In case if you forgot email or lost email,Then ask chat bot as forgot password or update password you will get guidelines.",success:"true"});
                }
            }
        });
    }
    else if(userrole=='tpo')
    {
        TPO.findOne({ $or: [ { email: useremailoruid }, {userid:useremailoruid } ] },function(err,user){
            if(err)
            {
                throw err;
                console.log(err);
            }
            else if(!user)
            {
                res.json({sucess:false,msg:"No User Existed with Given User Id and Role combination. Please Provide Valid Details"})
            }
            else{
                useremail=user.email;
                const output = `
            <p>Dear Admin, You have a new Technical Issue:</p>
            <h3>Request Details</h3>
            <ul>  
                <li>E-mail: ${useremail}</li>
                <li>User Id: ${user.userid}</li>
                <li>Role: ${req.body.role}</li>
                <li>Subject: ${req.body.subject}</li>
            </ul>
            <h3>User Request</h3>
            <p>${req.body.message}</p>
            `;
            
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                  user: 'cms.feedback9144@gmail.com',
                  pass: 'password@9144'
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: 'n130318@rguktn.ac.in', // list of receivers
                subject: req.body.subject, // Subject line
                text: 'Hello world?', // plain text body
                html: output, // html body
                replyTo:useremail
            };
        
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                });
                if(user.phone!=undefined){
                client.messages.create({
                    from: '+17062568730',
                    to: '+919494918564',
                    //to:userdata.phone
                    body: "Dear User,Your Request succefully sent,Regarding"+subject+",If you not did this write request at contact-admin"
                  }).then((message) => console.log(message.sid));conf=true;
                }
                else{
                    console.log("Phone Number Unavailable");
                    conf=false;
                }
                  //Sending Confirmation to user e-mail
                  const output1 = `
            <p>Dear TPO, Your Request Confirmation</p>
            <h3>Request Details</h3>
            <ul>  
                <li>Role: ${req.body.role}</li>
                <li>User Id or E-mail: ${useremailoruid}</li>
                <li>Subject: ${req.body.subject}</li>
            </ul>
            <h3>User Request</h3>
            <p>${req.body.message}</p>
            <h4>Note:</h4>
            <p>If not did this please write a request at <a href="https://cryptic-temple-72625.herokuapp.com/#/contactadmin"> contact-admin </a></p>
            `;
            
            let transporter1 = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                  user: 'cms.feedback9144@gmail.com',
                  pass: 'password@9144'
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
        
            // setup email data with unicode symbols
            let mailOptions1 = {
                from: '"college manager" <cms.feedback9144@gmail.com>', // sender address
                to: useremail, // list of receivers
                subject: req.body.subject , // Subject line
                text: 'Hello world?', // plain text body
                html: output1, // html body
                replyTo:useremail
            };
        
            // send mail with defined transport object
            transporter1.sendMail(mailOptions1, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log("The message was sent!");
                console.log(info);
                //if(req.body.message.indexOf("forgot userid")>0||req.body.message.indexOf("lost userid")>0||req.body.message.indexOf("userid")>0)
                //Send same mail with to as reply-to in mail with auto reply in case of forgot user name
                //is-autoreply
                });
                if(conf){
                    res.json({msg:"Request Sent Successfully and a Confirmation Sent your Mobile and E-mail",success:"true"});
                }
                else{
                    res.json({msg:"Request Sent Successfully and a Confirmation Sent your E-mail.In case if you forgot email or lost email,Then ask chat bot as forgot password or update password you will get guidelines.",success:"true"});
                }
            }
        });
    }
    else{
        res.json({msg:"Please Choose Valid Role",success:"false"});
    }
});

router.post('/forgot', function(req, res, next) {
    var usermail;
    var usrrole;
    var usrid;
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
        User.findOne({userid: req.body.userid }, function(err, user) {
            if (!user) {
            return res.json({success:false, msg:'No account with that userID exists.'});
            }
            else if(user.role=='student'){
                Student.findOne({ userid: req.body.userid }, function(err , userdata){
                    if(err) return next(err);
                    //console.log(user);
                    usermail = userdata.email;
                    usrrole=userdata.role;
                    usrid=userdata.userid;
                });
            }
            else if(user.role=='hod'){
                HOD.findOne({ userid: req.body.userid }, function(err , userdata){
                    if(err) return next(err);
                    //done(err, token, user);
                    usermail = userdata.email;
                    usrrole=userdata.role;
                    usrid=userdata.userid;
                });
            }
            else if(user.role=='tpo'){
                TPO.findOne({ userid: req.body.userid }, function(err , userdata){
                    if(err) return next(err);
                    //done(err, token, user);
                    usermail = userdata.email;
                    usrrole=userdata.role;
                    usrid=userdata.userid;
                });
            }
            else{
                return res.json({success:false, msg:'Something went wrong.'});
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            
            user.save(function(err) {
            done(err, token, user);
            });
        });
        },
        function(token, user, done) {
            let smtpTransport = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                port: 25,
                auth: {
                  user: 'cms.feedback9144@gmail.com',
                  pass: 'password@9144'
                },
                tls:{
                    rejectUnauthorized:false
                }
            });
            const output_text = `
              <p>Dear ${upperCase(usrrole)},</p>
              <p>You are receiving this e-mail because you (or someone else) have requested to </p>
              <p>Reset the password for your CMS account with user id: ${usrid}</p>
              <p>Please click on the following link, or paste this into your browser to complete the reset password process:</p>
              <p><a href="https://${req.headers.host}/mail/reset/${token}">https://${req.headers.host}/mail/reset/${token}</a></p>
              <br>
              <h3>Note</h3>
              <p>The Link will be Expires After <b>One Hour</b>, Please Complete The Process Before One hour.</p>
              <p>In case The link is Expired, Please Click <a href="https://cryptic-temple-72625.herokuapp.com/#/forgot">forgot password</a> to go and get new link.</p>
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
              `;
        var mailOptions = {
            to: usermail,
            from: 'cms.feedback9144@gmail.com',
            subject: 'Password Reset',
            html: output_text
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            if(!err)
            return res.json({success:true, msg:'An e-mail has been sent to ' + usermail + ' with further instructions.'});
            done(err, 'done');
        });
        }
    ], function(err) {
        if (err) return next(err);
        return res.json({success:false, msg:'Something went wrong'});
    });
    });

router.post('/reset/:token', function(req, res) {
    var usermail;
    async.waterfall([
        function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
            //req.flash('error', '');
            //return res.redirect('back');
            return res.json({success:false,msg:"Password reset token is invalid or has expired."})
            }
            else if(user.role=='student'){
                Student.findOne({ userid: user.userid }, function(err , userdata){
                    if(err) return next(err);
                    //console.log(user);
                    usermail = userdata.email;
                });
            }
            else if(user.role=='hod'){
                HOD.findOne({ userid: user.userid }, function(err , userdata){
                    if(err) return next(err);
                    //done(err, token, user);
                    usermail = userdata.email;
                });
            }
            else if(user.role=='tpo'){
                TPO.findOne({ userid: user.userid }, function(err , userdata){
                    if(err) return next(err);
                    //done(err, token, user);
                    usermail = userdata.email;
                });
            }
            else{
                return res.json({success:false, msg:'Something went wrong.'});
            }


            bcrypt.genSalt(10,function(err,salt){
                bcrypt.hash(req.body.password,salt,function(err,hash){
                  if(err) throw err;
                  user.password = hash;
                  user.resetPasswordToken = undefined;
                  user.resetPasswordExpires = undefined;
                  user.save(function(err) {
                        done(err, user);
                    });
                  });
                });
    
            //user.password = req.body.password;
        });
        },
        function(user, done) {
        //console.log(user);
        let smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            secure: false,
            port: 25,
            auth: {
              user: 'cms.feedback9144@gmail.com',
              pass: 'password@9144'
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        var mailOptions = {
            to: usermail,
            from: 'cms.feedback9144@gmail.com',
            subject: 'Your password has been changed',
            text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account with userid : ' + user.userid + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            res.json({success: true, msg: 'Success! Your password has been changed.'});
            done(err,'done');
        });
        }
    ], function(err) {
        res.json({success: false, msg: 'somthing went wrong.'});
    });
    });

router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
        //req.flash('error', 'Password reset token is invalid or has expired.');
        //res.json({msg:"not user"});
        return res.redirect('https://cryptic-temple-72625.herokuapp.com/#/forgot');
        }
        store.set("token",req.params.token);
        //console.log(store.get("token"));
        res.redirect('https://cryptic-temple-72625.herokuapp.com/#/resetpwd?token='+req.params.token);
    });
    });

    router.get('/getpwdresettoken', function(req, res) {
       
    });

module.exports = router;