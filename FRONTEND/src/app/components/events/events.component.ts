import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private authService:AuthService,
  private router:Router) { }

  ngOnInit() {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/home']);
   }
  }

}
