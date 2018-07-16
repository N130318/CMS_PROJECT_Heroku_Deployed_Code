import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Student } from '../../models/Student';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit,OnDestroy {
  usertype:String="USER";
  userid: String;
  password: string;
  role: String;
  dept: String;
  email:String;
  toggleform:boolean;
  selectedUser:Student;
  compoType:String;
  constructor(
    private validateService:ValidateService,
    private authService:AuthService,
    private router:Router,
    private flashmessage:FlashMessagesService
  ) { }
  ngOnInit() {
    this.toggleform=this.authService.toggleForm;
    this.selectedUser=this.authService.selectedUser;
    this.compoType=this.authService.compType;
    //console.log(this.selectedUser);
    if(this.toggleform)
    {
      this.usertype=this.selectedUser.role;
    }
  }
  ngOnDestroy()
  {
      var retVal = confirm("Do you want to Leave The Page ?");
        if( retVal == true ){
          if(this.compoType=="update")
          {
            this.authService.toggleForm=!this.authService.toggleForm;
            this.usertype="USER";
            console.log ("User does not wants to continue!");
            return ;
          }
          else
          {
            this.authService.toggleForm=false;
          }
        }
        else{
        console.log ("User want to continue!");
        //this.authService.toggleForm=!this.authService.toggleForm;
        this.router.navigate(['/add']);  
        }
  }
  onAddSubmit(){
    var obj={
      userid: this.userid,
      password: this.password,
      role: this.role,
      dept: this.dept,
      email:this.email
    };
    if(!this.validateService.validateAddFields(obj)){
      this.flashmessage.show('Please Provide Correct Input in All Fields',{cssClass:'alert-danger text-center',timeOut:2000});
    }
    else{
      this.authService.addUser(obj).subscribe(data =>{
        console.log(data);
        if(data.success){
          this.flashmessage.show(data.msg,{cssClass:'alert-success text-center',timeOut:2000});
          this.router.navigate(['/add']);
          this.userid="";
          this.password="";
          this.role="";
          this.dept="";
          this.email="";
        }else{
          this.flashmessage.show(data.msg,{cssClass:'alert-danger text-center',timeOut:2000});
          this.router.navigate(['/add']);
        }
      });
    }
  }

  onUpdateSubmit(form){
    console.log(form.value.userid);
    var obj={
      userid: form.value.userid,
      role: form.value.role,
      dept: form.value.dept,
      email:form.value.email
    };
    console.log(obj);
    if(!this.validateService.validateUpdateFields(obj)){
      this.flashmessage.show('Please Provide Correct Input in All Fields',{cssClass:'alert-danger text-center',timeOut:2000});
    }
    else{
      this.authService.updateUser(form.value.userid,obj).subscribe(data =>{
        console.log(data);
        if(data.success){
          this.flashmessage.show(data.msg,{cssClass:'alert-success text-center',timeOut:2000});
          setTimeout((router: Router) => { //Delays Execution for 5 Seconds
              this.router.navigate(['/home']);
              this.authService.toggleForm=!this.authService.toggleForm;
              form.reset();
          }, 1000);
        }else{
          this.flashmessage.show(data.msg,{cssClass:'alert-danger text-center',timeOut:2000});
          this.router.navigate(['/add']);
        }
      });
    }
  }
  public onChange(event : any): void {  // event will give you full breif of action
    this.usertype=event;
    console.log(this.usertype);
    if(this.usertype=="undefined"){
      this.usertype="USER";
    }
  }
  isStudentOrHod(){
    if(this.role=='student'||this.role=='hod')
      return true;
    else
      return false;
  }
  isStudentOrTpoOrHod(){
    if(this.role=='tpo'||this.role=='hod'||this.role=='student')
      return true;
    else
      return false;
  }
  isStuOrHod(){
    if(this.selectedUser.role=='student'||this.selectedUser.role=='hod')
      return true;
    else
      return false;
  }
  isStuOrTpoOrHod(){
    if(this.selectedUser.role=='tpo'||this.selectedUser.role=='hod'||this.selectedUser.role=='student')
      return true;
    else
      return false;
  }

  isAdmin(){
    if(this.role=='admin')
      return true;
    else
      return false;
  }
  addback(){
    this.userid="";
    this.role="";
    this.dept="";
    this.email="";
    this.password="";
    this.authService.toggleForm=false;
    this.router.navigate(['/home']);
  }
  updateback()
  {
    this.userid="";
    this.role="";
    this.dept="";
    this.email="";
    this.authService.toggleForm=!this.authService.toggleForm;
    this.router.navigate(['/home']);
  }
}
