import { ToastrService } from "ngx-toastr";
import { PledgeControlPanelService } from "../../services/pledge-control-panel.service";
import { BsDatepickerConfig } from "ngx-bootstrap/datepicker";
import { DatePipe } from '@angular/common';
import { environment } from "environments/environment";

export abstract class BaseComponent {
    pageData:any;
    planData:any[] = [];
    selectedPlan:number = 1;
    currentPage:number = 1;
    pageTotalItem:number;
    pageItemCount:number = 20;
    searchStr:string = '';
    sortBy:string;
    sortOrder:'asc'|'desc';
    selectedChain:string = ''; 
    selectedToken:string = ''; 
    selectedStatus:string = '';
    tokenList:any[] = [];
    readonly chainList = ['Ethereum Chain','Binance SmartChain']
    filterDates:any[] = ['',''];
    bsConfig?: Partial<BsDatepickerConfig>;
    configToken:any = environment.config;
    constructor(
        public pledgeService: PledgeControlPanelService,
        public toastrService: ToastrService,
        public datePipe: DatePipe
    ) {
        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            dateInputFormat: 'DD/MM/YYYY'
        });
        this.planData = this.pledgeService.pledgePlans;
        if(!this.planData || this.planData.length === 0){
            this.getPlans();
        } 
    }

    getToken(){
        const obj = {chainName : this.selectedChain};
        this.pledgeService.get_Chains(obj).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.tokenList = data.data;
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    onDateChange(event:any){
      this.filterDates = ['',''];
      if(event){
          this.filterDates[0] = this.datePipe.transform(event[0], 'yyyy-MM-dd')?.toString();
          this.filterDates[1] = this.datePipe.transform(event[1], 'yyyy-MM-dd')?.toString();
      }
    }

    shortDataBy(type:string){
        if(this.sortBy === type){
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortOrder = 'asc';
        }
        this.sortBy = type;
    }

    public getDateCount(api:string) {
        let data = {
            plan_id: this.selectedPlan,
            searchStr:this.searchStr,
            fromDate:this.filterDates[0] || '',
            toDate:this.filterDates[1] || '',
        }
        if(api === 'getPledgeUsersCount'){
            data = {...data,...{kycStatus:this.selectedStatus}}
        } else {
            data = {...data,...{chain:this.selectedChain,token:this.selectedToken}}
        }
        
        this.pledgeService.getDataCount(api,data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.pageTotalItem = data.data;
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    public downloadCSV(api:string) {
        const data = {
            plan_id: this.selectedPlan,
            chain:this.selectedChain,
            token:this.selectedToken,
            searchStr:this.searchStr,
            fromDate:this.filterDates[0] || '',
            toDate:this.filterDates[1] || '',
        }
        this.pledgeService.getCSV(api,data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.toastrService.success(data.message);
                    window.open(data.data, '_blank');
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
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
