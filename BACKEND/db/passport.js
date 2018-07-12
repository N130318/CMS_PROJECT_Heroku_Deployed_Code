const jwtStrategy = require('passport-jwt').Strategy;
const Extractjwt = require('passport-jwt').ExtractJwt;
const User = require('../models/usermodel');
const Student = require('../models/studentmodel');
const HOD = require('../models/hodmodel');
const TPO = require('../models/tpomodel');
const config = require("../config/db");
const db = require("./dbconnection");

module.exports = function(passport){
    let opts = {};
    opts.jwtFromRequest = Extractjwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    const jwtstrategy=new jwtStrategy(opts,function(jwt_payload,done){
        //console.log(jwt_payload);
        User.getUserByUserId(jwt_payload.userid,function(err,user){
            if(err){
                return done(err,false);
            }
            if(user){
                if(user.role=="student"){
                    Student.getStudentByUserId(jwt_payload.userid,function(err,student){
                        if(err){
                            return done(err, false);
                        }
                        if(student){
                            return done(null,student);
                        }
                        else{
                            return done(null, false);
                        }
                    });
                }
                else if(user.role=='hod'){
                    HOD.getHodByUserId(jwt_payload.userid,function(err,hod){
                        if(err){
                            return done(err, false);
                        }
                        if(hod){
                            return done(null,hod);
                        }
                        else{
                            return done(null, false);
                        }
                    });
                }
                else if(user.role=='tpo'){
                    TPO.getTpoByUserId(jwt_payload.userid,function(err,tpo){
                        if(err){
                            return done(err, false);
                        }
                        if(tpo){
                            return done(null,tpo);
                        }
                        else{
                            return done(null, false);
                        }
                    });
                }
                else{
                    return done(null, user);
                }
            }
            else{
                return done(null, false);
            }
        });
    });
    passport.use(jwtstrategy);

    passport.serializeUser(function(user,done){
        done(null,user.id);
    });
}