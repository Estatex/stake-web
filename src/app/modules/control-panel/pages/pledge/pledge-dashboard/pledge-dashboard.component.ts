import { Component, EventEmitter, OnInit,TemplateRef } from '@angular/core';
import { PledgeControlPanelService } from 'app/modules/control-panel/services/pledge-control-panel.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BaseWeb3Class } from 'app/core/base-web3.component';
import { Web3Service } from 'app/core/service/web3.service';
import { AbiPledge } from 'app/constants/abi';

@Component({
    selector: 'app-pledge-dashboard',
    templateUrl: './pledge-dashboard.component.html',
    styleUrls: ['./pledge-dashboard.component.scss']
})

export class PledgeAdminDashboardComponent extends BaseWeb3Class implements OnInit {
    modalRef: BsModalRef;
    modalConfig: ModalOptions = {
        animated: true,
        keyboard: false,
        class: 'modal-dialog-centered modal-sm site-model1',
        ignoreBackdropClick: true,
    };
    dashboardDate:any;
    withdrawDate:any[] = [];
    planData:any[];
    chainBalanceData:any;
    selectedChainData:any;
    toAddress:string;
    withdrawAmount:number | null;
    saveTransactionData:any;
    selectedPlan:number = 1;
    transactionHash: string;
    isWaitingTxShow:boolean = false;
    isTxComaplete:boolean = false;
    submitted: boolean = false;
    getTransactionData = new EventEmitter<string>(); 
    constructor(
        private toastrService: ToastrService,
        private pledgeService: PledgeControlPanelService,
        web3Service: Web3Service,
        modalService:BsModalService
      ) {
        super(web3Service,modalService);
    }

    ngOnInit(): void {
        this.bindWeb3Service();
        this.getDashboardDate();
        this.getChainBalance();
        this.toAddress = this.walletAddress;
        setTimeout(() => {
            this.planData = this.pledgeService.pledgePlans;
        }, 1000);
    }

    openModal(template: TemplateRef<any>,data?:any){
        if(data){
            this.selectedChainData = data;
        }
        this.modalRef = this.modalService.show(template,this.modalConfig);
        return;
    }

    getDashboardDate() {
        const data = {
            plan_id:this.selectedPlan
        }
        this.pledgeService.dashboard(data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.dashboardDate = data.data;
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    getChainBalance() {
        this.pledgeService.getChainBalance().subscribe({
            next: (data) => {
                if(data.type === true){
                    this.chainBalanceData = data.data;
                    this.chainBalanceData.forEach((item:any) => {
                        item.chainType = item.chain_name === 'Ethereum Chain' ? 'ETH_NETWORK': 'BSC_NETWORK';	
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

    close(){
        this.submitted = false;
        this.withdrawAmount = null;
        this.toAddress = this.walletAddress;
        if(this.modalRef) this.modalRef.hide();
    }

    saveTransaction(){
        this.submitted = true;
        if(!this.withdrawAmount || !this.toAddress) return;
        const obj = {
            plan_id:this.selectedPlan,
            walletAddress:this.walletAddress,
            chain:this.selectedChainData.chain_name,
            token:this.selectedChainData.token_name,
            token_value:this.withdrawAmount,
            to_addr:this.toAddress
        };
        this.pledgeService.saveTransaction(obj).subscribe({
            next: (data) => {
              this.modalRef.hide();
              if(data.type === true){
                this.saveTransactionData = data.data;
                this.toastrService.success(data.message);
                this.withdrawProcess();
              } else {
                this.toastrService.error(data.message);
              }
              console.log('Save Tx => ',data);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    updateTx(status:string,error:any = null){
        const obj = {
            id:this.saveTransactionData,
            walletAddress:this.walletAddress,
            status:status,
            txhash: this.transactionHash,
            status_desc:error
        };
        this.pledgeService.updateTransaction(obj).subscribe({
            next: (data) => {
              if(status === 'SUCCESS' || status === 'FAILED'){
                this.getTransactionData.emit();
                this.getChainBalance();
                this.close();
              }
              if(data.type === true){
                this.toastrService.success(data.message);
              } else {
                this.toastrService.error(data.message);
              }
            },
            error: (error) => {
              console.error(error);
            }
        });
    }

    withdrawProcess = async() => {
        this.transactionHash = '';
        this.isWaitingTxShow = true;
        this.isTxComaplete = false;
        this.checkTxComaplete();
        const addr = this.walletAddress;
        const myContractInstance = new this.web3js.eth.Contract(AbiPledge, this.configToken[this.web3Network].PledgeContractAddress);
        const count = (Number(this.withdrawAmount) * Math.pow(10,this.selectedChainData.token_decimals)).toString();
        console.log('withdrawAmount=> ',count);
        if(this.selectedChainData.token_type === 'ERC20'){
            await myContractInstance.methods.withdrawToken(this.selectedChainData.contract_address,count).send({ from: addr }, (err:any, res:any ) => {
                if (res) {
                    this.transactionHash = res;
                    this.updateTx('INPROCESS');
                } else {
                    this.isWaitingTxShow = false;
                    this.toastrService.error(err.message)
                }
            }).then((result:any) => {
                if (result) {
                this.updateTx('SUCCESS');
                }
                this.isWaitingTxShow = false;
                this.isTxComaplete = true;
            }).catch((error:any) => {
                this.isWaitingTxShow = false;
                this.isTxComaplete = true;
                const err = error.message.substring(0,500);
                this.updateTx('FAILED',err);
                console.log('sendETH then error =>', error);
            });
        } else {
            await myContractInstance.methods.withdraw(count).send({from:addr}, (err:any, res:any ) => {
                if (res) {
                    console.log('stakeProcess', res);
                    this.transactionHash = res;
                    this.updateTx('INPROCESS');
                } else {
                    this.isWaitingTxShow = false;
                    this.toastrService.error(err.message)
                }
            }).then((result:any) => {
                if (result) {
                    this.updateTx('SUCCESS');
                }
                this.isWaitingTxShow = false;
                this.isTxComaplete = true;
            }).catch((error:any) => {
                this.isWaitingTxShow = false;
                this.isTxComaplete = true;
                const err = error.message.substring(0,500);
                this.updateTx('FAILED',err);
                console.log('sendETH then error =>', error);
            });
        }
    }

    checkTxComaplete(){
        setTimeout(() => {
            if(!this.isTxComaplete){
                this.toastrService.info('The transaction is taking too long to confirm on blockchain, please check back after sometime.')
                // this.spinner.hide();
                this.isWaitingTxShow = false;
            }
        }, 60000);
    }
}
