import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
  userid:String;

  constructor(
    private authService:AuthService,
    private flashmessage:FlashMessagesService,
    private router:Router
  ) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/home']);
   }
  }

  onResetClick(){
    if(this.userid==""||this.userid==undefined)
    {
      this.flashmessage.show("UserID is required.",{cssClass:'alert-danger text-center',timeOut:1000});
    }
    else{
      var obj={
        userid: this.userid
      }
      this.authService.sendForgotMail(obj).subscribe(result=>{
        if(result.success){
          this.flashmessage.show(result.msg,{cssClass:'alert-info text-center',timeOut:1000});
        }
        else{
          this.flashmessage.show(result.msg,{cssClass:'alert-danger text-center',timeOut:1000});
        }
      });
    }
  }
  cancelClick()
  {
    this.router.navigate(['/login']);
  }
}
