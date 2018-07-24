import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactadmin',
  templateUrl: './contactadmin.component.html',
  styleUrls: ['./contactadmin.component.css']
})
export class ContactadminComponent implements OnInit {
  emailoruid:String;
  subject:String;
  message:String;
  role:String;



  constructor(
    private authService:AuthService,
    private flash:FlashMessagesService,
    private validate:ValidateService,
    private router:Router
  ) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/home']);
   }
   this.flash.show('If you have any Technical Issue you use Contact-Admin You can Post it from here, If you want to send feedback/Educational Query use Contact-us, Some one will assist you Soon',{cssClass:'alert-info text-center',closeOnClick: true,showCloseBtn: true,timeout:5000});
  }

  onRequest(){
    var obj={
    subject:this.subject,
    message:this.message,
    emailoruid:this.emailoruid,
    role:this.role
    };
    console.log(obj);
    if(!this.validate.validateRequest(obj)){
      alert("Please Provide Correct Input Data in All Fields.");
    }
    else{
      this.authService.user_request(obj).subscribe(res=>{
        if(res.success)
        {
          //this.flash.show(res.msg,{cssClass:'alert-success text-center',timeOut:2000});
          alert(res.msg);
          this.message="";
          this.subject="";
          this.emailoruid="";
          this.role="";
        }
        else{
          //this.flash.show("Something went wrong.",{cssClass:'alert-alert text-center',timeOut:2000});
          alert(res.msg);
        }
      });
    }
  }
  keyPressText(event: any) {
    const pattern = /[a-zA-Z0-9 \-\'\_\@\.\,\"]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}