import { Component, Input} from '@angular/core';
import { BaseWeb3Class } from '../../../../core/base-web3.component';
import { Web3Service } from '../../../../core/service/web3.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PledgeService } from 'app/modules/pledge/services/pledge.service';
import { AuthenticationService } from 'app/core/service/authentication.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})

export class HeaderComponent extends BaseWeb3Class {
    @Input() type:string = 'staking';
    isPledgeLogin: boolean = false;
    constructor(
        private pledgeService: PledgeService,
        modalService: BsModalService,
        web3Service: Web3Service,
        authenticationService: AuthenticationService,
        private router: Router
    ) {
        super(web3Service,modalService);
        authenticationService.getLogoutEvent.subscribe(event => {
            this.logoutWallet();
            this.pledgeService.userAuth = undefined;
            this.pledgeService.userData = undefined;
            this.ngOnInit();
        });
    }

    ngOnInit(): void {
        this.bindWeb3Service();
        const pledgeAuth = this.pledgeService.userAuth;
        this.isPledgeLogin = pledgeAuth && pledgeAuth !== 'undefined' ? true : false;
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                const pledgeAuth = this.pledgeService.userAuth;
                this.isPledgeLogin = pledgeAuth ? true : false;
            }
        });
        
    }
    
}