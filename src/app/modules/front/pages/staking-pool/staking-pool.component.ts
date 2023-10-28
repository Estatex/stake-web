import { Component, OnInit, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { Web3Service } from '../../../../core/service/web3.service';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { FrontService } from '../../services/front.service';
import { ToastrService } from 'ngx-toastr';
import { BaseWeb3Class } from '../../../../core/base-web3.component';
import { AbiStaking, AbiToken } from 'app/constants/abi';
import { environment } from 'environments/environment';
import Web3 from "web3";
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { SpinnerService } from 'app/shared/services/spinner.service';

export function getAccordionConfig(): AccordionConfig {
  return Object.assign(new AccordionConfig(), { closeOthers: true });
}

@Component({
  selector: 'app-staking-pool',
  templateUrl: './staking-pool.component.html',
  styleUrls: ['./staking-pool.component.scss'],
  providers: [{ provide: AccordionConfig, useFactory: getAccordionConfig }]
})

export class StakingPoolComponent extends BaseWeb3Class implements OnInit {
    modalRef: BsModalRef;
    modalConfig:ModalOptions = {
        animated: true,
        keyboard: false,
        class: 'modal-dialog-centered modal-lg site-model1',
        ignoreBackdropClick: true,
    };
    transaction: any[];
    planStats: any[];
    selectedPlan: any;
    transactionHash: string;
    trnType: 'CLAIM'|'STAKE'|'UNSTAKE'; // Claim | Add Liq | -
    liquidityAmount:any;
    lockDays:any;
    emailAddr:any;
    checkboxTerms:boolean = false;
    formError:any = {
      liquidityAmount: '',
      lockDays: '',
      emailAddr: '',
      checkboxTerms: '',
      claimedAmount:'',
    };
    claimedAmount:any;
    selectedStaked:any;
    isWaitingTxShow:boolean = false;
    isTxComaplete:boolean = false;
    stakingData:any[] = [];
    currentTime:number;
    contractType:string = '';
    saveTransactionData:any;
    currentBalance: string = '';
    constructor(
      private router: Router,
      private frontService:FrontService,
      private toastrService:ToastrService,
      private spinner: SpinnerService,
      web3Service: Web3Service,
      modalService: BsModalService
    ) {
      super(web3Service,modalService);
    }

    ngOnInit(): void {
      this.bindWeb3Service();
      if(!this.isWalletConnected){
        this.router.navigate(['']);
      }
      this.getPlanStats();
      this.getTransaction();
      this.currentTime = Math.floor(new Date().getTime() / 1000);
    }

    ngAfterViewInit(): void {
      this.web3Service.walletAddress$.subscribe(x => {
          this.web3js = new Web3(this.web3Service.web3Provider);
          if(!this.wrongNetwork){
            this.tokenBalance();
          }
      });
      this.web3Service.accountStatus$.subscribe(x => {
          if(this.wrongNetwork){
              this.toastrService.error('Please choose proper blockchain');
          }
      });
      setTimeout(() => {
        if(!this.wrongNetwork){
          this.tokenBalance();
        }
      }, 1000);
    }

    openModal(template: TemplateRef<any>, data?:any, stakedData?:any){
      this.selectedPlan = data;
      this.selectedStaked = stakedData;
      this.emailAddr = localStorage.getItem('stakingEmail');
      this.modalRef = this.modalService.show(template,this.modalConfig);
      return;
    }

    updateTx(status:string,error:any = null){
      var obj = {
          id:this.saveTransactionData.id,
          txhash:this.transactionHash,
          status:status,
          status_desc:error,
          walletAddress:this.walletAddress
      };
      this.frontService.update_tx(obj).subscribe({
          next: (data) => {
            console.log('updateTx => ',data);
            if(status === 'SUCCESS' || status === 'FAILED'){
              this.resetStakeForm();
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

    checkStakeData(type:string):boolean{
      this.formError = {
        liquidityAmount: '',
        lockDays: '',
        emailAddr: '',
        checkboxTerms: '',
        claimedAmount:'',
      };
      let isValid:boolean = true
      const emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
      if(type === 'STAKE'){
        if(this.liquidityAmount === ''){
          this.formError.liquidityAmount = 'Amount is required.'
          isValid = false;
        } else if(this.lockDays === ''){
          this.formError.lockDays = 'Lock Days is required.'
          isValid = false;
        }  else if(this.emailAddr === ''){
          this.formError.emailAddr = 'Email address is required.'
          isValid = false;
        } else if(!Number(this.liquidityAmount)){
          this.formError.liquidityAmount = 'Enter valid amount.'
          isValid = false;
        } else if(!Number(this.lockDays)){
          this.formError.lockDays = 'Enter valid days.'
          isValid = false;
        } else if(!emailRegex.test(this.emailAddr)){
          this.formError.emailAddr = 'Enter valid email.'
          isValid = false;
        } else if(!this.checkboxTerms){
          this.formError.checkboxTerms = 'Please check terms.'
          isValid = false;
        }
      } else if(type === 'CLAIM'){
        if(this.claimedAmount === ''){
          this.formError.claimedAmount = 'Amount is required.'
          isValid = false;
        }  else if(!Number(this.claimedAmount)){
          this.formError.claimedAmount = 'Enter valid amount.'
          isValid = false;
        } else if(Number(this.claimedAmount) > this.selectedStaked.unClaimed){
          this.formError.claimedAmount = 'Amount should not be greater than reward amount.'
          isValid = false;
        }
      } 
      return isValid;
    }

    saveTransaction(type:string){
      if(!this.checkStakeData(type)){
        return;
      } 
      if(type === 'UNSTAKE'){
        this.claimedAmount = Number(this.selectedStaked.staked) + Number(this.selectedStaked.unClaimed)
      } else if(type === 'STAKE'){
        localStorage.setItem('stakingEmail',this.emailAddr);
      }
      const obj = {
        plan_id:this.selectedPlan.id,
        walletAddress:this.walletAddress,
        token_count: type === 'STAKE' ? this.liquidityAmount : this.claimedAmount,
        trn_type:type,//this.trnType
        email:type === 'STAKE' ? this.emailAddr : '',
        lock_days:type === 'STAKE' ? this.lockDays : 0
      };
      this.frontService.save_transaction(obj).subscribe({
          next: (data) => {
            if(data.type === true){
              this.saveTransactionData = data.data;
              this.modalRef.hide();
              if(type === 'CLAIM'){
                this.claimRewardProcess();
              } else if(type === 'UNSTAKE'){
                this.unStakeProcess();
              } else if(type === 'STAKE'){
                this.isApprovedESX();
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

    resetStakeForm(){
      this.liquidityAmount = this.claimedAmount = this.lockDays = this.emailAddr = '';
      this.checkboxTerms = false;
      if(this.modalRef) this.modalRef.hide();
    }
    
    getTransaction(){
      var obj = {
        walletAddress:this.walletAddress,
        // walletAddress:"0x628734678236743sd",
      };
      this.frontService.get_transactions(obj).subscribe({
          next: (data) => {
              this.transaction = data.data;
          },
          error: (error) => {
              console.error(error);
          }
      });
    }

    getPlanStats(){
      var obj = {
        walletAddress:this.walletAddress,
      };
      this.frontService.get_plan_stats(obj).subscribe({
          next: (data) => {
              const planStats:any[] = data.data;
              this.planStats = planStats.map(object => {
                return {...object, isOpen: false};
              }); 
              console.log('selectedPlan=>',this.planStats);
          },
          error: (error) => {
              console.error(error);
          }
      });
    }

    tokenBalance = async () => {
      let addrr = this.walletAddress //"0x46ed2A88D9F786EA233d0D783847e0a2502dA101"
      const myContractInstance = new this.web3js.eth.Contract(AbiToken, environment.config.Token);
      await myContractInstance.methods.balanceOf(addrr).call().then((data: any,error: any) => {
        if (error) {
          console.log(error);
        } else {
            this.currentBalance = this.web3Service.getValidValue(data);
            console.log("Token Response: ", data, this.currentBalance);
        }
      })
    }

    userStakeCount = async() => {
      this.stakingData = [];
      this.spinner.show();
      const addrr =  this.walletAddress 
      console.log(addrr,this.selectedPlan.id);
      const myContractInstance = new this.web3js.eth.Contract(AbiStaking, this.configToken[this.web3Network].StakingContractAddress);
      await myContractInstance.methods.userStakeCnt(addrr,this.selectedPlan.id).call((error: any, data: any) => {
        if (data) {
          console.log('staking Count=>',data);
          for (let i = 0; i < Number(data); i++) {
            this.stakingInfo(i);
          }
          if(data == 0){
            this.stakingData.push({index:this.stakingData.length, staked:0, claimed:0, lockTS:0, share:0, unClaimed:0})
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
          console.log(error);
        }
      })
    }

    stakingInfo = async(index:number) => {
      const addrr =  this.walletAddress 
      const myContractInstance = new this.web3js.eth.Contract(AbiStaking, this.configToken[this.web3Network].StakingContractAddress);
      await myContractInstance.methods.stakers(addrr,this.selectedPlan.id,index).call((error: any, data: any) => {
        if (data) {
          console.log('stakingInfo=>',data);
          const staked = this.web3Service.getValidValue(data['staked']);
          const claimed = this.web3Service.getValidValue(data['claimed']);
          const lockTS = Number(data['lockTS']);
          const share = ((Number(staked)/Number(this.selectedPlan.total_staked))*100).toFixed(2);
          this.stakingData.push({index:index, staked:staked, claimed:claimed, lockTS:lockTS, share:share, unClaimed:0})
        } else {
          console.log(error);
        }
        this.spinner.hide();
      })
      try {
        await myContractInstance.methods.getUnClaimedReward(addrr,this.selectedPlan.id,index).call().then((data: any, error: any) => {
          if (data) {
              const unClaimed = this.web3Service.getValidValue(data,4);
              this.stakingData[index].unClaimed = unClaimed;
              
              console.log("Response Claim data: ", data, unClaimed);
          } else {
              console.log("Response Claim error ", error);
          //   eventBus.dispatch('bucketClaimResponse', { data: getValidValue(res) })
          }
          console.log('stakingData=>>',this.stakingData);
          this.stakingData.sort((a:any,b:any) => {return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0)});
        })
      } catch (error) {
          console.log("database value ", error)
          console.log('stakingData=>>',this.stakingData);
      }
    }

    accordionOpen(event:any,index:number){
      this.planStats[index].isOpen = event;
      if(event){
        this.selectedPlan = this.planStats[index];
        this.userStakeCount();
      }
    }

    
    claimRewardProcess = async() => {
      this.transactionHash = '';
      this.isWaitingTxShow = true;
      this.isTxComaplete = false;
      this.checkTxComaplete();
      const addr = this.walletAddress;
      const claimed = this.claimedAmount * 1000000000;
      const myContractInstance = new this.web3js.eth.Contract(AbiStaking, this.configToken[this.web3Network].StakingContractAddress);
      console.log('Planid=>',this.selectedPlan.id,' index=>',this.selectedStaked.index,' claimed=>',claimed);
      await myContractInstance.methods.claimReward(this.selectedPlan.id,this.selectedStaked.index,claimed).send({ from: addr }, (err:any, res:any ) => {
          if (res) {
              console.log('claimAllocationProcess', res);
              this.transactionHash = res;
          } else {
              this.isWaitingTxShow = false;
              this.toastrService.error(err.message)
          }
          this.updateTx('INPROCESS');
      }).then((result:any) => {
        if (result) {
          this.updateTx('SUCCESS');
          this.tokenBalance();
          this.userStakeCount();
          this.getTransaction();
        }
        this.isWaitingTxShow = false;
        this.isTxComaplete = true;
      }).catch((error:any) => {
          this.isWaitingTxShow = false;
          this.isTxComaplete = true;
          const err = error.message.substring(0,500);
          this.updateTx('FAILED',err);
          this.getTransaction();
          console.log('sendETH then error =>', error);
      });
    }

    unStakeProcess = async() => {
      this.transactionHash = '';
      this.isWaitingTxShow = true;
      this.isTxComaplete = false;
      this.checkTxComaplete();
      const addr = this.walletAddress;
      const myContractInstance = new this.web3js.eth.Contract(AbiStaking, this.configToken[this.web3Network].StakingContractAddress);
      await myContractInstance.methods.unstakeToken(this.selectedPlan.id,this.selectedStaked.index).send({ from: addr }, (err:any, res:any ) => {
          if (res) {
              console.log('unStakeProcess', res);
              this.transactionHash = res;
          } else {
              this.isWaitingTxShow = false;
              this.toastrService.error(err.message)
          }
          this.updateTx('INPROCESS');
      }).then((result:any) => {
        if (result) {
          this.updateTx('SUCCESS');
          this.tokenBalance();
          this.userStakeCount();
          this.getTransaction();
        }
        this.isWaitingTxShow = false;
        this.isTxComaplete = true;
      }).catch((error:any) => {
          this.isWaitingTxShow = false;
          this.isTxComaplete = true;
          const err = error.message.substring(0,500);
          this.updateTx('FAILED',err);
          this.getTransaction();
          console.log('sendETH then error =>', error);
      });
    }

    stakeProcess = async() => {
      this.transactionHash = '';
      this.isWaitingTxShow = true;
      this.isTxComaplete = false;
      this.checkTxComaplete();
      const addr = this.walletAddress;
      const myContractInstance = new this.web3js.eth.Contract(AbiStaking, this.configToken[this.web3Network].StakingContractAddress);
      const count = Number(this.liquidityAmount) * 1000000000;
      const seconds = Number(this.lockDays) * 86400;
      console.log('planId=>',this.selectedPlan.id,'count=>',count,'seconds=>',seconds,'nonce=>',this.saveTransactionData.id,'signature=>',this.saveTransactionData.signature);
      await myContractInstance.methods.stakeToken(this.selectedPlan.id,count,seconds,this.saveTransactionData.id,this.saveTransactionData.signature).send({ from: addr }, (err:any, res:any ) => {
          if (res) {
              console.log('stakeProcess', res);
              this.transactionHash = res;
          } else {
              this.isWaitingTxShow = false;
              this.toastrService.error(err.message)
          }
          this.updateTx('INPROCESS');
      }).then((result:any) => {
        if (result) {
          this.updateTx('SUCCESS');
          this.tokenBalance();
          this.userStakeCount();
          this.getTransaction();
        }
        this.isWaitingTxShow = false;
        this.isTxComaplete = true;
      }).catch((error:any) => {
          this.isWaitingTxShow = false;
          this.isTxComaplete = true;
          const err = error.message.substring(0,500);
          this.updateTx('FAILED',err);
          this.getTransaction();
          console.log('sendETH then error =>', error);
      });
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
              if (Number(allowanceESX) < Number(this.liquidityAmount)) {
                  // enable approve button and disable confirm button
                  this.getApprovalESX();
              } else {
                  // disable approve button and enable confirm button
                  this.stakeProcess();
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
              this.stakeProcess();
          }
          this.isTxComaplete = true;
      }).catch((error:any) => {
          console.log('then error =>', error);
          this.updateTx('FAILED', error);
          this.isWaitingTxShow = false;
      });
  }

}
