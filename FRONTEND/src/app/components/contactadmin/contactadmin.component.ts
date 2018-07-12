import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';

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
    private validate:ValidateService
  ) { }

  ngOnInit() {
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
      alert("all fields are required.");
    }
    else{
      this.authService.user_request(obj).subscribe(res=>{
        if(res.success)
        {
          //this.flash.show(res.msg,{cssClass:'alert-success text-center',timeOut:2000});
          alert(res.msg);
        }
        else{
          //this.flash.show("Something went wrong.",{cssClass:'alert-alert text-center',timeOut:2000});
          alert(res.msg);
        }
      });
      this.message="";
      this.subject="";
      this.emailoruid="";
      this.role="";
    }
  }
}