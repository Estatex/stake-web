import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { BaseComponent } from '../base.component';
import { ToastrService } from 'ngx-toastr';
import { PledgeControlPanelService } from 'app/modules/control-panel/services/pledge-control-panel.service';

@Component({
    selector: 'app-withdraw-transaction',
    templateUrl: './withdraw-transaction.component.html',
    styleUrls: ['./withdraw-transaction.component.scss']
})

export class PledgeWithdrawTransactionComponent extends BaseComponent implements OnInit {
    withdrawDate:any[] = [];
    @Input() eventEmitter: EventEmitter<string>; 
    constructor(
        datePipe: DatePipe, 
        toastrService: ToastrService,
        pledgeService: PledgeControlPanelService
    ) {
        super(pledgeService,toastrService,datePipe);
    }

    ngOnInit(): void {
        this.eventEmitter.subscribe((data: string) => { 
            console.log('eventEmitter =>', data);
            this.getData();
        });
        this.getData();
    }

    getWithdrawDate(pageNumber?:number) {
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
        this.pledgeService.getWithdraw(data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.withdrawDate = data.data;
                    this.withdrawDate.forEach((item:any) => {
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


    shortBy(type:string){
        this.shortDataBy(type);
        this.getWithdrawDate();
    }

    dateChange(event:any){
        this.onDateChange(event);
        this.getData();
    }

    getData(){
        this.getWithdrawDate();
        this.getDateCount('getWithdrawTransCount');
    }

    

}
