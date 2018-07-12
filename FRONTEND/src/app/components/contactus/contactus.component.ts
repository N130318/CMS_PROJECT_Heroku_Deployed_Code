import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';

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
    private validate:ValidateService
  ) { }

  ngOnInit() {
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
      alert("all fields are required.");
    }
    else{
      this.authService.feedback(obj).subscribe(res=>{
        if(res.success)
        {
          //this.flash.show(res.msg,{cssClass:'alert-success text-center',timeOut:2000});
          alert(res.msg);
        }
        else{
          //this.flash.show("Something went wrong.",{cssClass:'alert-alert text-center',timeOut:2000});
          alert("Something went wrong");
        }
      });
      this.firstname="";
      this.lastname="";
      this.address="";
      this.email="";
      this.country="";
      this.zip="";
      this.state="";
      this.feedback="";
    }
  }


}
