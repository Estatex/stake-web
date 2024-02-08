import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PledgeService } from '../../services/pledge.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment';
import { BaseWeb3Class } from 'app/core/base-web3.component';
import { Web3Service } from 'app/core/service/web3.service';
import { AbiPledge, AbiToken } from 'app/constants/abi';
import { SpinnerService } from 'app/shared/services/spinner.service';
declare var Sharer: any;
declare var document: any;

@Component({
  selector: 'app-pledge-dashboard',
  templateUrl: './pledgeDashboard.component.html',
  styleUrls: ['./pledgeDashboard.component.scss']
})

export class PledgeDashboardComponent extends BaseWeb3Class implements OnInit {
  blockchainType: string = 'ETH';
  isWaitingTxShow: boolean = false;
  isTxComaplete:boolean = false;
  transactionHash: string;
  isSocialIconShow: boolean = false;
  isSocialIconShow1: boolean = false;
  depositText:string = 'Deposit'
  isOpen: number = 2;
  isESXtokens:boolean = false;
  modalRef: BsModalRef;
  modalConfig:ModalOptions = {
      animated: true,
      keyboard: false,
      class: 'modal-dialog-centered modal-lg site-model1',
      ignoreBackdropClick: true,
  };
  userData:any;
  transactionsData:any;
  refreeTransactionsData:any;
  dashboardData:any;
  referralURL:string = '';
  referralTitle:string = 'EstateX pledge referral ';
  refData : any;
  planData : any;
  tokenList : any = [];
  submitted: boolean = false;
  isButtonClicked: boolean = false;
  checkboxTerms: boolean = false;
  isFormInvalid: boolean = false;
  pledgeAmount: number | string;
  pledgeUSDAmount: number;
  stakingDays: number | undefined;
  selectedChain: any;
  planId:number = 1;
  isAmountInvalid: boolean = false;
  saveTransactionData:any;
  currentBalance:any;
  planStatus:string;
  planMsg:any;
  @ViewChild('pledgeAgreement') pledgeAgreement: TemplateRef<any>;
  @ViewChild('pledgeStakingDays') pledgeStakingDays: TemplateRef<any>;
  constructor(
    private pledgeService:PledgeService, 
    private toastrService:ToastrService,
    private router: Router,
    private spinner: SpinnerService,
    web3Service: Web3Service,
    modalService:BsModalService
  ) {
    super(web3Service,modalService);
  }

  ngOnInit(): void {
    Sharer.init();
    this.bindWeb3Service();
    const userAuth = this.pledgeService.userAuth;
    if(!userAuth || !this.isWalletConnected){
      this.router.navigate(['home']);
    } else {
      this.getActivePlan();
    }
    this.refData = localStorage.getItem('pledgeRefData');
    this.refData = this.refData ? JSON.parse(this.refData) : '';

    document.addEventListener("wheel", function(event:any){
      if(document.activeElement.type === "number"){
          document.activeElement.blur();
      }
    });
    // setTimeout(() => {
    //   this.openModal(this.pledgeStakingDays);
    // }, 2000);
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template,this.modalConfig);
    return;
  }

  changeToken(event?:any){
    if(event){
      this.selectedChain = event;
    }
    this.depositText =  'Deposit'
    if(this.selectedChain.token_type === 'ERC20'){
      this.depositText =  'Approve and Deposit'
    }
    this.tokenBalance();
  }

  changePledgeAmount(value:any){
    this.pledgeUSDAmount = Number(value) * this.selectedChain.usd_value;
  }

  deposit(){
    this.submitted = true;
    this.isFormInvalid = false;
    this.isAmountInvalid = false;
    if(!this.pledgeAmount){
      this.isFormInvalid = true;
    } else if (Number(this.pledgeUSDAmount) < this.planData.min_amount || Number(this.pledgeUSDAmount) > this.planData.max_amount){
      this.isFormInvalid = true;
      this.isAmountInvalid = true;
    } else if(this.pledgeAmount > this.currentBalance){
      this.isFormInvalid = true;
    }
    if (this.isFormInvalid) {
        return;
    }
    this.modalRef.hide();
    this.submitted = false;
    // this.openModal(this.pledgeAgreement);
    this.saveTransaction();
  }

  close(){
    this.submitted = false; 
    this.isFormInvalid = false;
    this.pledgeAmount = '';
    this.stakingDays = undefined;
    if(this.modalRef){
      this.modalRef.hide();
    }
  }

  submit(){
    this.submitted = true;
    if(!this.checkboxTerms) return;
    this.modalRef.hide();
    this.saveTransaction();
  }

  submitStaking(){
    this.submitted = true;
    this.isFormInvalid = false;
    if (!this.stakingDays){
      this.isFormInvalid = true;
    }
    if (this.isFormInvalid) {
      return;
    }
    this.updateTx('stakingDays')
    // this.modalRef.hide();
    // this.submitted = false;
  }

  getUserData(){
    this.pledgeService.get_user().subscribe({
      next: (data) => {
        if(data.type === true){
          this.userData = data.data;
          this.pledgeService.userData = this.userData;
          this.referralURL = environment.pledgeWebUrl+'home/'+this.planId+'/'+this.userData.wallet_addr;
          setTimeout(() => {
            Sharer.init();
          }, 100);
        } else {
            this.toastrService.error(data.message);
        }
      },
      error: (error) => {
          console.error(error);
      }
    });
  }

  getToken(){
    const chain = { chainName: this.web3Network === 'ETH_NETWORK' ? 'Ethereum Chain' : 'Binance SmartChain' }
    this.pledgeService.get_Chains(chain).subscribe({
      next: (data) => {
        if(data.type === true){
          this.tokenList = data.data;
          this.selectedChain = this.tokenList[0];
          this.changeToken();
          this.getPlan();
        } else {
            this.toastrService.error(data.message);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getTransactions(isload:boolean = false){
    this.pledgeService.get_transactions().subscribe({
      next: (data) => {
        if(data.type === true){
          this.transactionsData = data.data;
          if(!isload){
            this.isOpen = 1;
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

  getRefreeTransactions(){
    this.pledgeService.get_refree_transactions().subscribe({
      next: (data) => {
        if(data.type === true){
          this.refreeTransactionsData = data.data;
          console.log(this.refreeTransactionsData);
        } else {
            this.toastrService.error(data.message);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getActivePlan(){
    this.pledgeService.get_active_plan().subscribe({
      next: (data) => {
        if(data.type === true){
          this.getDashboardData();
          console.log(data.data);
          this.planId = data.data.plan_id;
          this.planStatus = data.data.status;
          this.planMsg = data.message;
          if(data.message){
            this.toastrService.info(data.message);
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

  getDashboardData(){
    this.pledgeService.get_dashboard().subscribe({
      next: (data) => {
        if(data.type === true){
          this.dashboardData = data.data;
          this.getTransactions(true);
          this.getUserData();
          this.getToken();
          this.getRefreeTransactions()
        } else {
            this.toastrService.error(data.message);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getPlan(){
    const payload = {plan_id:this.planId}
    this.pledgeService.get_plan(payload).subscribe({
      next: (data) => {
        if(data.type === true){
          this.planData = data.data;
          // this.maxTxAmount = this.planData.max_amount * this.selectedChain.usd_value;
          // this.minTxAmount = this.planData.min_amount * this.selectedChain.usd_value;
        } else {
            this.toastrService.error(data.message);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  saveTransaction(){
    const obj = {
      plan_id:this.planId,
      walletAddress:this.walletAddress,
      chain: this.web3Network === 'ETH_NETWORK' ? 'Ethereum Chain' : 'Binance SmartChain',
      token: this.selectedChain.token_name,
      // is_staking:this.isESXtokens ? 1 : 0,
      // stake_days: this.stakingDays ? this.stakingDays : null,
      token_amount:this.pledgeAmount,
      token_usd: this.selectedChain.usd_value * Number(this.pledgeAmount),
      comm_per: this.planData.comm_per_referrer,
    };
    this.pledgeService.save_transaction(obj).subscribe({
        next: (data) => {
          if(data.type === true){
            this.saveTransactionData = data.data;
            this.toastrService.success(data.message);
            if(this.selectedChain.token_type === 'ERC20'){
              this.isApprovedToken();
            } else{
              this.pledgeProcess();
            }
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
    var obj = {};
    if(status === 'stakingDays'){
      obj = {
        id:this.saveTransactionData,
        walletAddress:this.walletAddress,
        stake_days:this.stakingDays
      };
    } else {
      obj = {
        id:this.saveTransactionData,
        walletAddress:this.walletAddress,
        status:status,
        txhash: this.transactionHash,
        status_desc:error
      };
    }
    this.pledgeService.update_tx(obj).subscribe({
        next: (data) => {
          if(status === 'SUCCESS' || status === 'FAILED'){
            this.close();
            this.getTransactions();
            if(status === 'SUCCESS' && this.planData.show_stakeoption === 1){
              this.openModal(this.pledgeStakingDays);
            }
          } else if(status === 'stakingDays'){
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

  tokenBalance = async () => {
    const addrr = this.walletAddress
    if(this.selectedChain.token_type === 'ERC20'){
      const myContractInstance = new this.web3js.eth.Contract(AbiToken, this.selectedChain.contract_address);
      await myContractInstance.methods.balanceOf(addrr).call().then((data: any,error: any) => {
        if (error) {
          console.log(error);
        } else {
            this.currentBalance = this.web3Service.getValidValue(data,2,this.selectedChain.token_decimals);
            console.log("Token Response: ", data, this.currentBalance);
        }
      })
    } else {
      await this.web3js.eth.getBalance(addrr).then((data: any,error: any) => {
        if (!error) {
          const usrBal = this.web3js.utils.fromWei(data, 'ether')
          this.currentBalance = Number(usrBal).toFixed(4);
        }
      })
    }
  }

  isApprovedToken = async() => {
    this.isWaitingTxShow = true;
    let addrr =  this.walletAddress;
    const myContractInstance = new this.web3js.eth.Contract(AbiToken, this.selectedChain.contract_address);
    await myContractInstance.methods.allowance(addrr,this.configToken[this.web3Network].PledgeContractAddress).call().then((res: any, error: any) => {
        if (error) {
            console.log("balance error ", error)
            this.isWaitingTxShow = false;
        } else {
            console.log('isApprovedESX =>',res);
            const allowanceESX = this.web3Service.getValidValue(res);
            if (Number(allowanceESX) < Number(this.pledgeAmount)) {
                // Token not approved yet
                this.getApprovalToken();
            } else {
                // Token approved
                this.pledgeProcess();
            }
        }
    })
  }

  getApprovalToken = async() => {
    const addr = this.walletAddress;
    const myContractInstance = new this.web3js.eth.Contract(AbiToken,this.selectedChain.contract_address);
    const count = '100000' + "0".padStart(this.selectedChain.token_decimals, '0');
    await myContractInstance.methods.approve(this.configToken[this.web3Network].PledgeContractAddress, count).send({ from:addr, gasLimit:80000 }, (err:any, res:any ) => {
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
            this.pledgeProcess();
        }
        this.isTxComaplete = true;
    }).catch((error:any) => {
        this.updateTx('FAILED', error);
        this.isWaitingTxShow = false;
    });
  }

  pledgeProcess = async() => {
    this.transactionHash = '';
    this.isWaitingTxShow = true;
    this.isTxComaplete = false;
    this.checkTxComaplete();
    const addr = this.walletAddress;
    const myContractInstance = new this.web3js.eth.Contract(AbiPledge, this.configToken[this.web3Network].PledgeContractAddress);
    const count = (Number(this.pledgeAmount) * Math.pow(10,this.selectedChain.token_decimals)).toString();
    if(this.selectedChain.token_type === 'ERC20'){
      await myContractInstance.methods.pledgeToken(this.selectedChain.contract_address,count).send({ from: addr, gasLimit:80000 }, (err:any, res:any ) => {
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
    } else {
      await myContractInstance.methods.pledge().send({ from: addr, gasLimit:80000, value: count }, (err:any, res:any ) => {
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
    'else method is pledge'
  }
  
  checkTxComaplete(){
    setTimeout(() => {
        if(!this.isTxComaplete){
            this.toastrService.info('The transaction is taking too long to confirm on blockchain, please check back after sometime.')
            this.spinner.hide();
            this.isWaitingTxShow = false;
        }
    }, 60000);
  }

  copy(text:string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastrService.success('Copied to clipboard!')
  }

}
