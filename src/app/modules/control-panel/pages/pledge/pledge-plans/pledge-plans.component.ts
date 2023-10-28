import { Component, OnInit } from '@angular/core';
import { ControlPanelService } from '../../../services/control-panel.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-pledge-plans',
    templateUrl: './pledge-plans.component.html',
    styleUrls: ['./pledge-plans.component.scss']
})

export class PledgePlansComponent implements OnInit {
        pageData:any;
        selectedStatus:string = 'SUCCESS';
        isLockStatus:boolean = false;
    constructor(
        private controlPanelService:ControlPanelService,
        private toastrService:ToastrService,
    ) {

    }

    ngOnInit(): void {
        this.getPlans();
    }

    getPlans() {
        const data = {
            plan_status:this.selectedStatus,
            is_paused:this.isLockStatus ? 1 : 0,
        }
        this.controlPanelService.get_plans(data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.pageData = data.data;
                    this.controlPanelService.stakingPlans = data.data;
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
