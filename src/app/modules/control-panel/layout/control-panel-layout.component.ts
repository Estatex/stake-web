import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/service/authentication.service';

@Component({
    selector: 'app-control-panel-layout',
    templateUrl: './control-panel-layout.component.html',
    styleUrls: ['./control-panel-layout.component.scss'],
})
export class ControlPanelLayoutComponent implements OnInit {
    userData:any;
    isPledgeAdmin:boolean = false;
    constructor(
        private authenticationService:AuthenticationService,
        private router: Router, 
    ) {
        if(this.isPledgeAdmin){
            this.router.navigate(['user/pledge']);
        }
    }

    ngOnInit(): void {
        this.userData = this.authenticationService.getUserData();
        if(window.location.pathname.includes('/pledge')){
            this.isPledgeAdmin = true;
        }
    }

    logout(){
        this.authenticationService.logout();
        this.router.navigate(['admin/login']);
        window.location.reload();
    }
    
}