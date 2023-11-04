import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ToastrService } from 'ngx-toastr';
import { PledgeControlPanelService } from 'app/modules/control-panel/services/pledge-control-panel.service';

@Component({
    selector: 'app-pledge-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['./transaction.component.scss']
})

export class PledgeTransactionComponent extends BaseComponent implements OnInit {
    transData:any[] = [];
    constructor(
        datePipe: DatePipe, 
        toastrService: ToastrService,
        pledgeService: PledgeControlPanelService
    ) {
        super(pledgeService,toastrService,datePipe);
    }

    ngOnInit(): void {
        this.getData();
    }

    getTransData(pageNumber?:number) {
        this.currentPage = pageNumber ? pageNumber : this.currentPage;
        const data = {
            plan_id: this.selectedPlan,
            searchStr:this.searchStr,
            chain:this.selectedChain,
            token:this.selectedToken,
            fromDate:this.filterDates[0] || '',
            toDate:this.filterDates[1] || '',
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            page:this.currentPage,
            limit:this.pageItemCount
        }
        this.pledgeService.getTransaction(data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.transData = data.data;
                    this.transData.forEach((item:any) => {
                        item.chainType = item.chain === 'Ethereum Chain' ? 'ETH_NETWORK': 'BSC_NETWORK';	
                    });
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    getTokenData(){
        super.getToken();
        this.getData();
    }


    shortBy(type:string){
        this.shortDataBy(type);
        this.getTransData();
    }

    dateChange(event:any){
        this.onDateChange(event);
        this.getData();
    }

    getData(){
        this.getTransData();
        this.getDateCount('getPledgeTransCount');
    }

}
