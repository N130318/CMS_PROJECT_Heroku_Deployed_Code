import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  pselect:String;

  constructor(
    private authService:AuthService,
    private router:Router,
    private flashmessage:FlashMessagesService
  ) { }

  ngOnInit() {
  }
  onLogoutClick(){
    this.authService.logOut();
    this.flashmessage.show("You are logged out.",{cssClass:"alert-success text-center",timeOut:2000});
  }
  getuser(){
    this.authService.changeUserType(this.pselect);
    localStorage.setItem('type', this.pselect.toString());
    this.router.navigate(['/manageusers']);
  }
}
