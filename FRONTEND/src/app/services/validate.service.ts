import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() { }

  validateRegister(user){
    if(user.username==undefined||user.password==undefined||user.copypassword==undefined||user.role==undefined){
      return false;
    }else{
      return true;
    }
  }

  validateEmail(email){
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email);
  }

  validatePassword(password,copypassword){
    if(password.length <8 || password!=copypassword)
    return false;
    else
    return true;
  }

  validateLogin(user){
    if(user.userid==undefined||user.password==undefined){
      return false;
    }
    else if(user.userid==""||user.password==""){
      return false;
    }
    else{
      return true;
    }
  }
  validateUpdateFields(user){
    if((user.role=="hod"||user.role=="student")&&(user.dept==undefined||user.dept==""))
      return false;
    else if((user.role=="hod"||user.role=="student"||user.role=="tpo")&&((user.email==undefined||user.email=="")||!this.validateEmail(user.email)))
      return false;
    else
      return true;
  }

  validateAddFields(user){
    if(user.userid==undefined||user.role==undefined)
      return false;
    else if(user.userid==""||user.role=="")
      return false;
    else if((user.role=="hod"||user.role=="student")&&(user.dept==undefined||user.dept==""))
      return false;
    else if((user.role=="hod"||user.role=="tpo"||user.role=="student")&&((user.email==undefined||user.email=="")||!this.validateEmail(user.email)))
      return false;
    else if((user.role=="admin")&&(user.password==undefined||user.password==""))
      return false;
    else
    return true;
  }

  studentProfilevalidation(student){
    if(student.name==undefined||student.dob==undefined||student.year==undefined||student.aggregate==undefined||student.email==undefined||student.phone==undefined||student.address==undefined||student.plcmntinterst==undefined)
     return false;
    else if(student.name==""||student.dob==""||student.year==""||student.aggregate==""||student.email==""||student.phone==""||student.address==""||student.plcmntinterst=="")
      return false;
    else if((student.email==""||student.email==undefined)||!this.validateEmail(student.email)){
        return false;
    }
    else 
      return true;
  }

  hodProfilevalidation(hod){
    if(hod.name==undefined||hod.qualification==undefined||hod.email==undefined||hod.phone==undefined||hod.address==undefined)
     return false;
    else if(hod.name==""||hod.qualification==""||hod.email==""||hod.phone==""||hod.address=="")
      return false;
    else if((hod.email==""||hod.email==undefined)||!this.validateEmail(hod.email)){
        return false;
    }
    else 
      return true;
  }

  tpoProfilevalidation(tpo){
    if(tpo.name==undefined||tpo.qualification==undefined||tpo.email==undefined||tpo.phone==undefined||tpo.address==undefined)
     return false;
    else if(tpo.name==""||tpo.qualification==""||tpo.email==""||tpo.phone==""||tpo.address=="")
      return false;
    else if((tpo.email==""||tpo.email==undefined)||!this.validateEmail(tpo.email)){
        return false;
    }
    else 
      return true;
  }


  validateFeed(obj){
    if(obj.firstname==""||obj.lastname==""||obj.country==""||obj.state==""||obj.zip==""||obj.feedback==""||obj.address==""){
      return false;
    }
    else if(obj.firstname==undefined||obj.lastname==undefined||obj.country==undefined||obj.state==undefined||obj.zip==undefined||obj.feedback==undefined||obj.address==undefined){
      return false;
    }
    else if((obj.email==""||obj.email==undefined)||!this.validateEmail(obj.email)){
      return false; 
    }
    else {
      return true;
    }
  }
  validateRequest(obj){
    if(obj.subject==""||obj.role==""||obj.emailoruid==""||obj.message==""){
      return false;
    }
    else if(obj.subject==undefined||obj.role==undefined||obj.emailoruid==undefined||obj.message==undefined){
      return false;
    }
    else {
      return true;
    }
  }
}