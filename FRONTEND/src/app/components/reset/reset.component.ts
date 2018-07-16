import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  userid:String;
  oldpassword:String;
  newpassword:String;
  confirmpassword:String;

  constructor(
    private authservice:AuthService,
    private flash:FlashMessagesService,
    private router:Router,
    private authService:AuthService
  ) { }

  ngOnInit() {
    var user=JSON.parse(localStorage.getItem('user'));
    this.userid=user.userid;
  }

  onPasswordResetSubmit(){
     if(this.oldpassword==""||this.oldpassword==undefined||this.newpassword==""||this.newpassword==undefined||this.confirmpassword==""||this.confirmpassword==undefined){
       this.flash.show("All fields are required.",{cssClass:'alert-danger text-center',timeOut:2000})
     }
     else 
     {
       var obj={
         userid:this.userid,
         oldpassword:this.oldpassword,
         newpassword:this.newpassword,
         confirmpassword:this.confirmpassword
       }
       this.authservice.changePassword(obj).subscribe(result =>{
         if(result.success){
          this.flash.show(result.msg,{cssClass:'alert-success text-center',timeOut:2000});
            this.authService.logOut();
            this.router.navigate(['/login']);
         }
         else{
          this.flash.show(result.msg,{cssClass:'alert-danger text-center',timeOut:2000});
          this.oldpassword="";
          this.newpassword="";
          this.confirmpassword="";
         }
       });
     }
  }

  back(){
    this.confirmpassword="";
    this.newpassword="";
    this.oldpassword="";
    if(!this.authservice.adminLoggedIn())
      this.router.navigate(['/profile']);
    else
      this.router.navigate(['/add']);
  }

}
