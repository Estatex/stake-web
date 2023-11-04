import { Component, OnInit } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ControlPanelService } from "app/modules/control-panel/services/control-panel.service";
import Validation from "app/shared/utils/validation";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-update-password',
    templateUrl: './update-password.component.html',
    styleUrls: ['./update-password.component.scss']
})

export class UpdatePasswordComponent implements OnInit {
    form: FormGroup;
    submitted: boolean = false;
    isButtonClicked: boolean = false;
    
    constructor(
        private controlPanelService: ControlPanelService,
        private toastrService:ToastrService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            oldpasswd: new FormControl('', [Validators.required]),
            passwd1: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
            passwd2: new FormControl('', Validators.required),
        },
        {
            validators: [Validation.match('passwd1', 'passwd2')]
        });
        this.submitted = false;
    }


    onSubmit(){
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.isButtonClicked = true;
        this.controlPanelService.updatePassword(this.form.value).subscribe((data)=>{
            this.isButtonClicked = false;
            if(data.type === true){
                this.toastrService.success(data.message);
            } else {
                this.toastrService.error(data.message);
            }
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    
}
