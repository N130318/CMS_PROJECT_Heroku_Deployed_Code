import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  role:String;
  constructor(private authService:AuthService) { 
    this.role=authService.role;
  }

  ngOnInit() {
  }

}
