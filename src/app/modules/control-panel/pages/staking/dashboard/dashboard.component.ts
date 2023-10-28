import { Component, OnInit,TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexStroke,
    ApexYAxis,
    ApexTitleSubtitle,
    ApexLegend,
    ApexGrid,
    ApexTooltip,
    ApexPlotOptions
  } from "ng-apexcharts";
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BaseWeb3Class } from 'app/core/base-web3.component';
import { Web3Service } from 'app/core/service/web3.service';
import { AbiStaking, AbiToken } from 'app/constants/abi';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { ControlPanelService } from 'app/modules/control-panel/services/control-panel.service';

  export type ChartOptions = {
    series: ApexAxisChartSeries;
    labels: string[];
    tokenSeries: ApexAxisChartSeries;
    tokenLabels: string[];
    stakedSeries: ApexAxisChartSeries;
    stakedLabels: string[];
    chart: ApexChart;
    xaxis: ApexXAxis;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    legend: ApexLegend;
    subtitle: ApexTitleSubtitle;
    grid: ApexGrid;
    tooltip: ApexTooltip;
    plotOptions: ApexPlotOptions;
  };

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent extends BaseWeb3Class implements OnInit {
    userData:any;
    planList:any;
    selectedPlan:number;
    currentPage:number = 1;
    pageTotalItem:number;
    pageItemlimit:number = 25;
    isLockStatus:boolean = true;
    searchStr:string = '';
    sortBy:string;
    sortOrder:'asc'|'desc';
    dashboardDate:any;
    public chartOptions!: Partial<ChartOptions> | any;
    public pieChartOptions!: Partial<ChartOptions> | any;
    selectedPlanForCSV:number;
    modalRef: BsModalRef;
    modalConfig:ModalOptions = {
        animated: true,
        keyboard: false,
        class: 'modal-dialog-centered modal-md site-model',
        ignoreBackdropClick: true,
    };
    fileData :any;
    filterDates:any[] = ['',''];
    transactionHash:any;
    isWaitingTxShow:boolean = false;
    isTxComaplete:boolean = false;
    uploadFileData:any;
    trnType:string = 'STAKE';
    bsConfig?: Partial<BsDatepickerConfig>;
    constructor(
        private controlPanelService:ControlPanelService,
        private toastrService:ToastrService,
        modalService: BsModalService,
        private datePipe: DatePipe,
        web3Service: Web3Service,
    ) {
            super(web3Service,modalService);
    }

    ngOnInit(): void {
        this.bindWeb3Service();
        this.getDashboardDate();
        this.getPlans();
        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            dateInputFormat: 'DD/MM/YYYY'
        });
    }

    onDateChange(event:any){
        this.filterDates = ['',''];
        if(event){
            this.filterDates[0] = this.datePipe.transform(event[0], 'yyyy-MM-dd')?.toString();
            this.filterDates[1] = this.datePipe.transform(event[1], 'yyyy-MM-dd')?.toString();
        }
        this.updateData();
    }

    updateData(){
        this.getUsers();
        this.getUsersCount();
    }

    getPlans() {
        this.controlPanelService.get_plans({}).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.planList = data.data;
                    this.selectedPlan = this.planList[0].id;
                    this.updateData();
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    getUsers(pageNumber?:number) {
        this.currentPage = pageNumber ? pageNumber : this.currentPage;
        const data = {
            plan_id: this.selectedPlan,
            searchStr:this.searchStr,
            lockStatus:this.isLockStatus,
            trn_type:this.trnType,
            fromDate:this.filterDates[0] || '',
            toDate:this.filterDates[1] || '',
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            page:this.currentPage,
            limit:this.pageItemlimit
        }
        this.controlPanelService.get_stake_users(data).subscribe({
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

    getUsersCount() {
        const data = {
            plan_id: this.selectedPlan,
            searchStr:this.searchStr,
            lockStatus:this.isLockStatus,
            trn_type:this.trnType,
            fromDate:this.filterDates[0] || '',
            toDate:this.filterDates[1] || '',
        }
        this.controlPanelService.get_stake_users_count(data).subscribe({
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
    downloadCSV() {
        const data = {
            plan_id: this.selectedPlan,
            searchStr:this.searchStr,
            lockStatus:this.isLockStatus,
            trn_type:this.trnType,
            fromDate:this.filterDates[0] || '',
            toDate:this.filterDates[1] || '',
        }
        this.controlPanelService.csvStakeUsers(data).subscribe({
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

    getDashboardDate() {
        const data = {}
        this.controlPanelService.dashboard(data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.dashboardDate = data.data;
                    this.setUserChart();
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
        if(this.sortBy === type){
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortOrder = 'asc';
        }
        this.sortBy = type;
        this.getUsers();
    }

    setUserChart(){
        let count: number[] = [];
        let dates: string[] = [];
        let tokenCount: number[] = [];
        let tokenDates: string[] = [];
        let stakedCount: number[] = [];
        let stakedDates: string[] = [];
        console.log(this.dashboardDate);
        this.dashboardDate.userCountReport.forEach((element:any) => {
            count.push(element.cnt);
            dates.push(element.dt);
        });
        this.dashboardDate.tokenClaimedReport.forEach((element:any) => {
            tokenCount.push(element.cnt);
            tokenDates.push(element.dt);
        });
        
        this.chartOptions = {
            title: false,
            subtitle: false,
            labels: dates,
            series: [
            {
                name: "Users",
                data: count
            }
            ],
            tokenLabels: tokenDates,
            tokenSeries: [
            {
                name: "Rewards",
                data: tokenCount
            }
            ],
            stakedLabels: stakedDates,
            stakedSeries: [
            {
                name: "Tokens",
                data: stakedCount
            }
            ],
            colors: ["#00EDFF"],
            chart: {
              type: "area",
              height: 145,
              zoom: {
                enabled: false
              },
              toolbar: {
                show: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
                curve: 'smooth',
                colors: ["#00EDFF"],
                width: 1,
            },
            xaxis: {
              labels: {
                show: false,
              },
              type: "datetime",
              tooltip: {
                enabled:false
              }
            },
            yaxis: {
              show:false,
              showAlways:false,
              showForNullSeries:false,
              floating: false,
              labels: {
                show: false
              },
              toolbar: {
                show: false
              },
              tooltip:{
                show: false
              },
            },
            legend: {
              horizontalAlign: "left"
            },
            grid: {
                show: false,   
            }
        };
        this.pieChartOptions = {
            series: [this.dashboardDate.tokenStakedReport, 100-this.dashboardDate.tokenStakedReport],
            chart: {
              type: "donut",
              height: 135,
            },
            labels: ["Tokens Staked", "Remining"],
            colors: ["#00BABC","#D6F6F7"],
            legend: {
                show: false
            },
            dataLabels: {
                dropShadow: {
                  blur: 1,
                  opacity: 0.8
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '50%'
                    }
                }
            }
          };
    }

    openModal(template: TemplateRef<any>){
        this.selectedPlanForCSV = this.selectedPlan;
        this.modalRef = this.modalService.show(template,this.modalConfig);
    }

    handleFileUpdate(event:any){
        if(event.target.value){
            this.fileData =  <File>event.target.files[0];
        }
    }

    uploadCSVFile(){
        const fileData = {
            users:[],
            counts:[],
            seconds :[],
        }
        if(!this.fileData || !this.selectedPlanForCSV) return;
        let formData = new FormData();
        formData.append('file', this.fileData, this.fileData.name);
        this.controlPanelService.upload_stake_users(formData,this.selectedPlanForCSV).subscribe({
            next: (data:any) => {
                if(data.type === true){
                    this.modalRef.hide();
                    this.uploadFileData = data.data;
                    if(this.isWalletConnected){
                        this.isApprovedESX();
                    } else {
                        this.web3Service.walletAddress$.subscribe(x => {
                            this.walletAddress = x;
                            this.isApprovedESX();
                        });
                        this.openNetworkModal('admin');
                    }
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    isApprovedESX = async() => {
        this.isWaitingTxShow = true;
        let addrr =  this.walletAddress;
        const myContractInstance = new this.web3js.eth.Contract(AbiToken, this.configToken.Token);
        await myContractInstance.methods.allowance(addrr,this.configToken[this.web3Network].StakingContractAddress).call().then((res: any, error: any) => {
            if (error) {
                console.log("balance error ", error)
                this.isWaitingTxShow = false;
            } else {
                console.log('isApprovedESX =>',res);
                const allowanceESX = this.web3Service.getValidValue(res);
                if (Number(allowanceESX) < this.uploadFileData.totalTokenAmount) {
                    // enable approve button and disable confirm button
                    this.getApprovalESX();
                } else {
                    // disable approve button and enable confirm button
                    this.stakeForUsers();
                }
            }
        })

    }

    getApprovalESX = async() => {
        const addr = this.walletAddress;
        const myContractInstance = new this.web3js.eth.Contract(AbiToken, this.configToken.Token);
        await myContractInstance.methods.approve(this.configToken[this.web3Network].StakingContractAddress,"10000000000000000").send({ from: addr }, (err:any, res:any ) => {
            if (res) {
                console.log('get Approval ESX', res);
            } else {
                this.toastrService.error(err.message)
            }
        }).then((result:any) => {
            if (result) {
                // disable approve button and enable confirm button
                console.log("listen Approved Event =>", result);
                this.toastrService.success("Approval Successfull");
                this.stakeForUsers();
            }
            this.isTxComaplete = true;
        }).catch((error:any) => {
            console.log('then error =>', error);
            this.updateStakeTx('FAILED', error);
            this.isWaitingTxShow = false;
        });
    }

    stakeForUsers = async() => {
        this.transactionHash = '';
        this.isWaitingTxShow = true;
        this.isTxComaplete = false;
        this.checkTxComaplete();
        const addr = this.walletAddress;
        const myContractInstance = new this.web3js.eth.Contract(AbiStaking, this.configToken[this.web3Network].StakingContractAddress);
        const id = this.selectedPlanForCSV;
        const users = this.uploadFileData.users;
        const counts = this.uploadFileData.counts;
        const seconds = this.uploadFileData.seconds;
        console.log('id=>',id,'users=>',users,'counts=>',counts,'seconds=>',seconds);
        await myContractInstance.methods.stakeForUsers(id,users,counts,seconds).send({ from: addr }, (err:any, res:any ) => {
            if (res) {
                console.log('stakeProcess', res);
                this.transactionHash = res;
                this.updateStakeTx('INPROCESS');
            } else {
                // const error = err.message.substring(0,500);
                // this.updateTxPlan('FAILED',error);
                // this.toastrService.error(err.message)
            }
        }).then((result:any) => {
            if (result) {
              this.updateStakeTx('SUCCESS');
            }
            this.isWaitingTxShow = false;
            this.isTxComaplete = true;
          }).catch((err:any) => {
            const error = err.message.substring(0,500);
            this.updateStakeTx('FAILED', error);
            console.error('sendETH then error =>', err.message);
            this.isWaitingTxShow = false;
            this.isTxComaplete = true;
        });
    }

      updateStakeTx(status:string,error:any = null){
        var obj = {
            id:this.uploadFileData.file_id,
            txhash:this.transactionHash,
            status:status,
            status_desc:error,
        };
        this.controlPanelService.updateStakeTx(obj).subscribe({
            next: (data) => {
                this.toastrService.success(data.message);
                console.log('updateTxPlan => ',data);
                if(status === 'SUCCESS' || status === 'FAILED'){
                    this.updateData();
                }
            },
            error: (error) => {
                console.error(error);
                this.toastrService.error(error.message)
            }
        });
    }

    checkTxComaplete(){
        setTimeout(() => {
            if(!this.isTxComaplete){
                this.toastrService.info('The transaction is taking too long to confirm on blockchain, please check back after sometime.')
                this.isWaitingTxShow = false;
            }
        }, 60000);
    }

}
