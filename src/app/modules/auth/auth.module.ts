import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { AuthRoutingModule } from './auth.routing';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthLayoutComponent } from './layout/auth-layout.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    AuthRoutingModule,
    SharedModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
})
export class AuthModule { }

