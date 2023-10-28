import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Md5 } from 'ts-md5';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'app/core/service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    form: FormGroup;
    submitted: boolean = false;
    isButtonClicked: boolean = false;
    constructor(
        private authService:AuthService,
        private authenticationService:AuthenticationService,
        private toastrService:ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.authService.setRedirectURL(this.route.snapshot.queryParams['redirectURL']);
        this.form = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(100),]),
            passwd: new FormControl('', [Validators.required]),
        });
        this.submitted = false;
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        // this.form.value.passwd = Md5.hashStr(this.form.value.passwd);
        this.isButtonClicked = true;
        this.authService.login(this.form.value).subscribe({
            next: (data) => {
                this.isButtonClicked = false;
                if(data.type === true){
                    this.authenticationService.setUserAuth(data.auth);
                    this.authenticationService.setUserData(data.data);
                    this.router.navigate(['/user/dashboard']);
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                this.isButtonClicked = false;
                console.error(error);
            }
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

}
