import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/service/authentication.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthLayoutComponent {
  constructor(
    private authenticationService:AuthenticationService,
    private router: Router,
  ) {
    
    if(this.authenticationService.islogin()){
        this.router.navigate(['user/dashboard']);
    } else {
      this.authenticationService.logout();
    }
    
  }
}