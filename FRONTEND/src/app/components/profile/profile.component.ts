import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../models/Student';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { ValidateService } from '../../services/validate.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  validateoutput:boolean;
  userid:String;
  name:String;
  dob: String;
  qualification:String;
  email:String;
  phone:String;
  aggregate:String;
  address:String;
  year:String;
  dept:String;
  role:String;
  profile:any;
  image:any;
  call:Boolean;
  files:any;
  selected:Boolean;

  constructor(
    private authService:AuthService,
    private flashmessage:FlashMessagesService,
    private router:Router,
    private validate:ValidateService,
    private location:Location
  ) { }

  ngOnInit() {
    this.selected=false;
    this.call=false;
    var data=JSON.parse(localStorage.getItem('user'));
    this.userid=data.userid;
    this.name=data.name;
    this.dob = data.dob;
    this.email=data.email;
    this.phone=data.phone;
    this.aggregate=data.aggregate;
    this.address=data.address;
    this.dept = data.dept;
    this.role=data.role;
    this.year=data.year;
    this.qualification=data.qualification;
    this.image=data.image;
  }

  selectFile($event) {
    this.selected=true;
    if(this.selected)
      this.files = $event.target.files || $event.srcElement.files;
  }

  buildProfile(){
    if(this.role=='student'){
        this.profile=new FormData();
        this.profile.append("userid",this.userid);
        this.profile.append("name",this.name);
        this.profile.append("dob",this.dob);
        this.profile.append("email",this.email);
        this.profile.append("phone",this.phone);
        this.profile.append("aggregate",this.aggregate);
        this.profile.append("address",this.address);
        this.profile.append("year",this.year);
        this.profile.append("dept",this.dept);
        this.profile.append("role",this.role);
        this.profile.append('pic',this.selected);
        var studnt_profile={
          name:this.name,
          dob:this.dob,
          email:this.email,
          phone:this.phone,
          aggregate:this.aggregate,
          address:this.address,
          year:this.year
        };
        this.validateoutput=this.validate.studentProfilevalidation(studnt_profile);
        // email:this.email,
        // phone:this.phone,
        // aggregate:this.aggregate,
        // address:this.address,
        // year:this.year,
        // dept:this.dept,
        // role:this.role
        // image:this.files[0]['name']
    }
    else if(this.role=="hod"){
      this.profile=new FormData();
        this.profile.append("userid",this.userid);
        this.profile.append("name",this.name);
        this.profile.append("email",this.email);
        this.profile.append("qualification",this.qualification);
        this.profile.append("phone",this.phone);
        this.profile.append("address",this.address);
        this.profile.append("dept",this.dept);
        this.profile.append("role",this.role);
        this.profile.append('pic',this.selected);
        var hod_profile={
          name:this.name,
          qualification:this.qualification,
          email:this.email,
          phone:this.phone,
          address:this.address
        };
        this.validateoutput=this.validate.hodProfilevalidation(hod_profile);
      // this.profile={
      //   userid:this.userid,
      //   name:this.name,
      //   qualification:this.qualification,
      //   email:this.email,
      //   phone:this.phone,
      //   address:this.address,
      //   dept:this.dept,
      //   role:this.role
      // }
    }
      else if(this.role=="tpo"){
        this.profile=new FormData();
        this.profile.append("userid",this.userid);
        this.profile.append("name",this.name);
        this.profile.append("qualification",this.qualification);
        this.profile.append("email",this.email);
        this.profile.append("phone",this.phone);
        this.profile.append("address",this.address);
        this.profile.append("role",this.role);
        this.profile.append('pic',this.selected);
        var tpo_profile={
          name:this.name,
          qualification:this.qualification,
          email:this.email,
          phone:this.phone,
          address:this.address
        };
        this.validateoutput=this.validate.tpoProfilevalidation(tpo_profile);
        // this.profile={
        //   userid:this.userid,
        //   name:this.name,
        //   qualification:this.qualification,
        //   email:this.email,
        //   phone:this.phone,
        //   address:this.address,
        //   role:this.role
        // }
      }
  }

  onProfileSubmit(){
    this.buildProfile();
    if(this.validateoutput)
    {
      if(this.selected){
        this.profile.append("image",this.files[0], this.files[0]['name']);
      }
      // if(!this.validate.studentProfilevalidation(this.profile)){
      //   this.flashmessage.show("all fields are required.",{cssClass:'alert-danger text-center',timeOut:2000});
      // }
      // else{
        this.authService.updateProfile(this.userid,this.profile).subscribe(data =>{
          if(data.success)
          {
            this.flashmessage.show(data.msg,{cssClass:'alert-success text-center',timeOut:2000});
            this.router.navigate(['home']);
            this.authService.getProfile(this.userid).subscribe(profiledata => {
              console.log(profiledata);
              localStorage.setItem('user',JSON.stringify(profiledata.user))});
            this.profileUpdateCall()
            if(this.selected){
            location.reload();}
          }
          else
          {
            this.flashmessage.show(data.msg,{cssClass:'alert-danger text-center',timeOut:2000});
          }
        });
    }
    else
    {
      this.flashmessage.show("Please Provide Correct Input in All Fields",{cssClass:'alert-danger text-center',timeOut:2000});
    }
}

  profileUpdateCall(){
    this.call=!this.call;
    this.selected=false;
  }

  checkProfileUpdateCall(){
    if(this.call)
      return true;
    else
      return false;
  }
}