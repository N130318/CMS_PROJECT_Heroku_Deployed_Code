import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { componentFactoryName } from '@angular/compiler';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { FlashMessagesModule, FlashMessagesService } from 'angular2-flash-messages';
import { JwtModule } from '@auth0/angular-jwt';
import {MatButtonModule, MatInputModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatSelectModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {AuthService } from './services/auth.service';
import {ValidateService } from './services/validate.service';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutComponent } from './components/about/about.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { HomeComponent } from './components/home/home.component';
import { EventsComponent } from './components/events/events.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AddComponent } from './components/add/add.component';
import { SearchComponent } from './components/search/search.component';
import { ForgetComponent } from './components/forget/forget.component';
import { PostService } from './services/post.service';
import { ChatComponent } from './components/chat/chat.component';
import { ResetComponent } from './components/reset/reset.component';
import { ResetpwdComponent } from './components/resetpwd/resetpwd.component';
import { ContactadminComponent } from './components/contactadmin/contactadmin.component';
import { ManageusersComponent } from './components/manageusers/manageusers.component';




export function tokenGetter() {
  return localStorage.getItem('id_token');
}

var appRoutes:Routes=[
    { path:"", component:HomeComponent },
    { path:"home", component:HomeComponent },
    { path:"events", component:EventsComponent },
    { path:"about", component:AboutComponent },
    { path:"contact", component:ContactusComponent },
    { path:"contactadmin", component:ContactadminComponent },
    { path:"login", component:LoginComponent },
    { path:"dashboard", component:DashboardComponent, canActivate:[AuthGuard]},
    { path:"welcome", component:WelcomeComponent,canActivate:[AuthGuard]},
    { path:"search", component:SearchComponent},
    { path:"profile", component:ProfileComponent,canActivate:[AuthGuard]},
    { path:"add", component:AddComponent,canActivate:[AdminGuard]},
    { path:"forgot", component:ForgetComponent},
    { path:"chat", component:ChatComponent},
    { path:"reset", component:ResetComponent,canActivate:[AuthGuard]},
    { path:"resetpwd", component:ResetpwdComponent},
    { path:"manageusers", component:ManageusersComponent,canActivate:[AdminGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ContactusComponent,
    HomeComponent,
    EventsComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent,
    WelcomeComponent,
    SearchComponent,
    AddComponent,
    ForgetComponent,
    ChatComponent,
    ResetComponent,
    ResetpwdComponent,
    ContactadminComponent,
    ManageusersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FlashMessagesModule,
    HttpModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
  
   RouterModule.forRoot(appRoutes,{useHash:true}),
   JwtModule.forRoot({
    config: {
      tokenGetter: tokenGetter,
      whitelistedDomains: ['cryptic-temple-72625.herokuapp.com'],
      blacklistedRoutes: ['cryptic-temple-72625.herokuapp.com/auth/']
    }
  })
 ],
  providers: [AuthService,ValidateService,FlashMessagesService,AuthGuard,PostService],
  bootstrap: [AppComponent]
})
export class AppModule { }
