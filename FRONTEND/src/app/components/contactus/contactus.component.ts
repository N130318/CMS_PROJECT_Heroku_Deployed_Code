import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  firstname:String;
  lastname:String;
  email:String;
  address:String;
  feedback:String;
  state:String;
  country:String;
  zip:String;



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
   this.flash.show('If you want to send Feedack or want to send Any Educational Query You can post it from here, If you have any Technical Issue you use Contact-Admin, Some one will assist you soon.',{cssClass:'alert-info text-center',closeOnClick: true,showCloseBtn: true,timeout:5000});
  }

  onFeed(){
    var obj={
  firstname:this.firstname,
  lastname:this.lastname,
  email:this.email,
  address:this.address,
  feedback:this.feedback,
  state:this.state,
  country:this.country,
  zip:this.zip
    }
    if(!this.validate.validateFeed(obj)){
      alert("Please Provide Correct Input Data in All Fields.");
    }
    else{
      this.authService.feedback(obj).subscribe(res=>{
        if(res.success)
        {
          //this.flash.show(res.msg,{cssClass:'alert-success text-center',timeOut:2000});
          alert(res.msg);
          this.firstname="";
          this.lastname="";
          this.address="";
          this.email="";
          this.country="";
          this.zip="";
          this.state="";
          this.feedback="";
        }
        else{
          //this.flash.show("Something went wrong.",{cssClass:'alert-alert text-center',timeOut:2000});
          alert("Something went wrong");
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
