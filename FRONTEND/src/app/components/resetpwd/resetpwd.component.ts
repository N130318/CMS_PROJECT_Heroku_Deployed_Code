import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.css']
})
export class ResetpwdComponent implements OnInit {
 token:String;
 newpassword:String;
 confirmpassword:String;

  constructor(
    private activatedRouter:ActivatedRoute,
    private flashmessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router
  ) { }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(params =>{
      this.token = params['token'];
      console.log(this.token);
    });
    if(this.token==""||this.token==undefined||this.token==null){
      this.flashmessage.show("Invalid Route Access",{cssClass:'alert-danger text-center',timeOut:2000});
      this.router.navigate(['/home']);
    }
  }

  onResetPwdSubmit(){
    if(this.newpassword==""||this.newpassword==undefined||this.confirmpassword==""||this.confirmpassword==undefined){
      this.flashmessage.show("All fields are required.",{cssClass:'alert-danger text-center',timeOut:2000});
    }
    else if(this.newpassword!=this.confirmpassword)
    {
      this.flashmessage.show("Password Mismatch.",{cssClass:'alert-danger text-center',timeOut:2000});
      this.newpassword=undefined;
      this.confirmpassword=undefined; 
    }
    else{
      this.authService.resetPwd(this.token,this.newpassword).subscribe(result=>{
        if(result.success){
          this.flashmessage.show(result.msg,{cssClass:'alert-success text-center',timeOut:2000});
          this.router.navigate(['/login']);
        }
        else{
          this.flashmessage.show(result.msg,{cssClass:'alert-danger text-center',timeOut:2000});
          this.router.navigate(['/forgot']);
        }
      });
    }
  }
}
