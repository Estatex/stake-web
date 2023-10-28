import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import Validation from 'app/shared/utils/validation';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
// import {Md5} from 'ts-md5';

    @Component({
        selector: 'app-reset-password',
        templateUrl: './reset-password.component.html',
        styleUrls: ['./reset-password.component.scss']
    })
    export class ResetPasswordComponent implements OnInit {
    form: FormGroup;
    submitted: boolean = false;
    isButtonClicked: boolean = false;
    counter:number;
    authToken: string | null;
    id: string | null;
    constructor(
        private authService:AuthService,
        private toastrService:ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            passwd1: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
            passwd2: new FormControl('', Validators.required),
        },
        {
            validators: [Validation.match('passwd1', 'passwd2')]
        });
        this.submitted = false;
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.authToken = params.get('auth');
            this.id = params.get('id');
            if(this.authToken && this.id){
                this.verifyAuth();
            } else {
                this.router.navigate(['admin/login']);
            }
        })
    }

    verifyAuth(){
        const data = {userId:this.id, token:this.authToken}
        this.authService.verify_reset(data).subscribe((data)=>{
            if(!data.type){
                this.router.navigate(['admin/login']);
                this.toastrService.error(data.message);
            }
        });
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.isButtonClicked = true;
        const apiData = {
            userId:this.id,
            token:this.authToken,
            passwd1:this.form.value.passwd1,
            passwd2:this.form.value.passwd2
        }
        // this.form.value.passwd2 = Md5.hashStr(this.form.value.passwd2);
        this.authService.reset_password(apiData).subscribe((data)=>{
            this.isButtonClicked = false;
            if(data.type === true){
                this.authService.setAuthToken(undefined);
                this.router.navigate(['admin/login']);
                this.toastrService.success('Password has been reset successfully.');
            } else if(data.type === 'error'){
                this.toastrService.error(data.message);
            }
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

}
