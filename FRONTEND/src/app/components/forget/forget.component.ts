import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
  userid:String;

  constructor(
    private authService:AuthService,
    private flashmessage:FlashMessagesService
  ) { }

  ngOnInit() {
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

}
