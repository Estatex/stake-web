import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ToastrService } from 'ngx-toastr';
import { PledgeControlPanelService } from 'app/modules/control-panel/services/pledge-control-panel.service';

@Component({
    selector: 'app-pledge-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})

export class PledgeUsersComponent extends BaseComponent implements OnInit {
    userData:any[] = [];
    kycStatus:string[] = ['success','approved','expired'];
    constructor(
        datePipe: DatePipe, 
        toastrService: ToastrService,
        pledgeService: PledgeControlPanelService
    ) {
        super(pledgeService,toastrService,datePipe);
    }

    ngOnInit(): void {
        this.getUserDate();
        this.getDateCount('getPledgeUsersCount');
    }

    getUserDate(pageNumber?:number) {
        this.currentPage = pageNumber ? pageNumber : this.currentPage;
        const data = {
            plan_id: this.selectedPlan,
            kycStatus:this.selectedStatus,
            searchStr:this.searchStr,
            fromDate:this.filterDates[0] || '',
            toDate:this.filterDates[1] || '',
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            page:this.currentPage,
            limit:this.pageItemCount
        }
        this.pledgeService.getUser(data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.userData = data.data;
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    shortBy(type:string){
        this.shortDataBy(type);
        this.getUserDate();
    }

    dateChange(event:any){
        this.onDateChange(event);
        this.getUserDate();
        this.getDateCount('getPledgeUsersCount');
    }

    updateData(){
        this.getUserDate();
        this.getDateCount('getPledgeUsersCount');
    }

}
