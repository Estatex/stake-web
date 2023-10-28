import { Injectable } from '@angular/core';

import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SpinnerService } from 'app/shared/services/spinner.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { PledgeService } from 'app/modules/pledge/services/pledge.service';
import { HeaderComponent } from 'app/modules/front/components/header/header.component';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    apiType: string = 'staking'
    constructor(
        private spinner: SpinnerService,
        private router: Router,
        private authenticationService : AuthenticationService,
        private pledgeService : PledgeService,
        private toastrService: ToastrService
    ) {
    }
    
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authorization:any = "";
        this.apiType = 'staking'
        if(request.url.includes('/pledge/')){
            this.apiType = 'pledge';
            authorization = this.pledgeService.userAuth;
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + authorization) });
        } else if(this.authenticationService.getUserAuth()){
            authorization = this.authenticationService.getUserAuth();
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + authorization) });
        }
        // if(this.authService.getAuthToken() && (request.url.includes('user/reset-passwd') || request.url.includes('user/verify-user') || request.url.includes('user/resend-otp')) ){
        //     authorization = this.authService.getAuthToken();
        // }
        
        if(request.reportProgress){
            this.spinner.show();
        }
        request = request.clone({ reportProgress: true });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if(request.reportProgress){
                        setTimeout(() => {
                            this.spinner.hide();
                        }, 500);
                    }
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.spinner.hide();
                console.log(error.error);
                if(error.error.message === 'jwt expired'){
                    this.authenticationService.logout();
                    if(this.apiType === 'pledge'){
                        this.router.navigate(['/']);
                    } else {
                        this.router.navigate(['admin/login']);
                    }
                    this.toastrService.error('Session Timeout due to inactivity, Please login again');
                } else {
                    let msg = '';
                    if(error.error.errors && error.error.errors.length > 0){
                        const com = error.error.errors.length > 1 ? ', ' : ' ';
                        error.error.errors.forEach((err:any) => {
                            msg = msg +' '+ err.msg+com;
                        });
                    }
                    this.toastrService.error(msg, error.error.message)
                }
                return throwError(error);
            })
        );
    }
}