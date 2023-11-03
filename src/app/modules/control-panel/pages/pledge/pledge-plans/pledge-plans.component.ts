import { Component, OnInit } from '@angular/core';
import { ControlPanelService } from '../../../services/control-panel.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../base.component';
import { DatePipe } from '@angular/common';
import { PledgeControlPanelService } from 'app/modules/control-panel/services/pledge-control-panel.service';

@Component({
    selector: 'app-pledge-plans',
    templateUrl: './pledge-plans.component.html',
    styleUrls: ['./pledge-plans.component.scss']
})

export class PledgePlansComponent implements OnInit {
        planData:any;
        isLockStatus:boolean = false;
    constructor(
        private toastrService: ToastrService,
        private pledgeService: PledgeControlPanelService
    ) {

    }

    ngOnInit(): void {
        this.getPlans();
    }

    getPlans() {
        this.pledgeService.getPledgePlans().subscribe({
            next: (data) => {
                if(data.type === true){
                    this.planData = data.data;
                    this.pledgeService.pledgePlans = data.data;
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

}
