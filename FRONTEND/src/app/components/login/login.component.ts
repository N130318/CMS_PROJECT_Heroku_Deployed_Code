import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {ValidateService } from '../../services/validate.service';
import {Router} from '@angular/router'
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userid: string;
  password: string;
  constructor(
    private authService:AuthService,
    private validateService:ValidateService,
    private router:Router,
    private flashmessage:FlashMessagesService
  ) { }

  ngOnInit() {
  }


  onLoginSubmit()
  {
    var obj={
      userid: this.userid,
      password: this.password
    };
    if(!this.validateService.validateLogin(obj)){
      this.flashmessage.show('All fields are required',{cssClass:'alert-danger text-center',timeOut:2000});
    }else{
      this.authService.authUser(obj).subscribe(data =>{
        if(data.success){
          this.authService.storeUserData(data.token,data.user);
          this.flashmessage.show(data.msg,{cssClass:'alert-success text-center',timeOut:2000});
          this.router.navigate(['dashboard']);
        }else{
          this.flashmessage.show(data.msg,{cssClass:'alert-danger text-center',timeOut:2000});
          this.router.navigate(['login']);
        }
      });
  }
}
}
