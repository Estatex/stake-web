import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ControlPanelService } from '../../../services/control-panel.service';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Web3Service } from 'app/core/service/web3.service';
import { BaseWeb3Class } from 'app/core/base-web3.component';
import { AbiStaking } from 'app/constants/abi';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-create-plans',
    templateUrl: './create-pledge-plans.component.html',
    styleUrls: ['./create-pledge-plans.component.scss']
})

export class CreatePledgePlansComponent extends BaseWeb3Class implements OnInit {
    form: FormGroup;
    submitted: boolean = false;
    isButtonClicked: boolean = false;
    planId:any;
    transactionHash:any;
    bsConfig?: Partial<BsDatepickerConfig>;
    isWaitingTxShow:boolean = false;
    isTxComaplete:boolean = false;

    constructor(
        private controlPanelService:ControlPanelService,
        private toastrService:ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        web3Service: Web3Service,
        modalService: BsModalService,
    ) {
          super(web3Service,modalService);
    }

    ngOnInit(): void {
        this.bindWeb3Service();
        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            dateInputFormat: 'DD/MM/YYYY'
        });
        this.form = new FormGroup({
            name: new FormControl('', [Validators.required]),
            startdate: new FormControl('', [Validators.required]),
            enddate: new FormControl('', [Validators.required]),
            min_stake: new FormControl('', [Validators.required]),
            max_stake: new FormControl('', [Validators.required]),
            min_days: new FormControl('', [Validators.required]),
            max_days: new FormControl('', [Validators.required]),
            fixed_apy: new FormControl('', [Validators.required]),
            max_count: new FormControl('', [Validators.required]),
            desc: new FormControl(''),
            title_color: new FormControl('#EAEBEE'),
            button_color: new FormControl('#FF7F37'),
            is_paused: new FormControl(false),
            is_whitelist: new FormControl(false)
        });
        this.route.paramMap.subscribe((params: ParamMap) => {
            const id  = params.get('id');
            this.updateForm(id);
        });
    }

    updateForm(id:any){
        const data = this.controlPanelService.stakingPlans.find(x => x.id == id);
        if(data){
            this.planId = data.id;
            this.form.setValue({
                name: data.name,
                startdate: new Date(data.staking_startdate),
                enddate: new Date(data.staking_enddate),
                min_stake: data.min_tokenstake,
                max_stake: data.max_tokenstake,
                min_days: data.min_duration_days,
                max_days: data.max_duration_days,
                fixed_apy: data.fixed_apy_per,
                max_count: data.max_user_count,
                desc: data.desc.replace(/<br\/>/g, "\n").replace(/<br \/>/g, "\n"),
                title_color: data.title_color,
                button_color: data.button_color,
                is_whitelist: data.is_whitelist === 1,
                is_paused: data.is_paused === 1,
            });
        }
    }

    onSubmit(){
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.form.value.is_whitelist = this.form.value.is_whitelist ? 1 : 0;
        this.form.value.is_paused = this.form.value.is_paused ? 1 : 0;
        this.form.value.desc = this.form.value.desc.replace(/\n/g, "<br />");;
        this.isButtonClicked = true;
        this.form.value.startdate = this.datePipe.transform(this.form.value.startdate, 'yyyy-MM-dd');
        this.form.value.enddate = this.datePipe.transform(this.form.value.enddate, 'yyyy-MM-dd');
        if(this.planId){
            this.form.value.plan_id = this.planId;
        }
        this.controlPanelService.save_plan(this.form.value).subscribe({
            next: (data) => {
                this.isButtonClicked = false;
                if(data.type === true){
                    this.planId = data.plan_id;
                    // this.toastrService.success(data.message);
                    if(this.isWalletConnected){
                        this.setStakePlan();
                    } else {
                        this.web3Service.walletAddress$.subscribe(x => {
                            this.walletAddress = x;
                            this.setStakePlan();
                        });
                        this.openNetworkModal('admin');
                    }
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                this.isButtonClicked = false;
                console.error(error);
            }
        });
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    setStakePlan = async() => {
        this.transactionHash = '';
        this.isWaitingTxShow = true;
        this.isTxComaplete = false;
        this.checkTxComaplete();
        const addr = this.walletAddress;
        const myContractInstance = new this.web3js.eth.Contract(AbiStaking, this.configToken[this.web3Network].StakingContractAddress);
        const startWindowTS = Math.floor(new Date(this.form.value.startdate).getTime() / 1000);
        const endWindowTS = Math.floor(new Date(this.form.value.enddate).getTime() / 1000);
        const minlockSeconds = Math.floor(this.form.value.min_days)*86400;
        const expireSeconds = Math.floor(this.form.value.max_days)*86400;
        const apyPer = Math.floor(this.form.value.fixed_apy);
        const maxCount = Math.floor(this.form.value.max_count);
        const minUsrStake = Math.floor(this.form.value.min_stake) * 1000000000;
        const maxUsrStake = Math.floor(this.form.value.max_stake) * 1000000000;
        console.log(this.planId,'startWindowTS=>',startWindowTS,'endWindowTS=>',endWindowTS,'minlockSeconds=>',minlockSeconds,'expireSeconds=>',expireSeconds,'apyPer=>',apyPer,'maxCount=>',maxCount,'minUsrStake=>',minUsrStake,'maxUsrStake=>',maxUsrStake);
        await myContractInstance.methods.setStakePlan(this.planId,startWindowTS,endWindowTS,minlockSeconds,expireSeconds,apyPer,maxCount,minUsrStake,maxUsrStake).send({ from: addr }, (err:any, res:any ) => {
            if (res) {
                console.log('stakeProcess', res);
                this.transactionHash = res;
                this.updateTxPlan('INPROCESS');
            } else {
                const error = err.message.substring(0,500);
                this.updateTxPlan('FAILED',error);
                // this.toastrService.error(err.message)
            }
        }).then((result:any) => {
            if (result) {
              this.updateTxPlan('SUCCESS');
            }
            this.isWaitingTxShow = false;
            this.isTxComaplete = true;
          }).catch((err:any) => {
            const error = err.message.substring(0,500);
            this.updateTxPlan('FAILED', error);
            console.error('sendETH then error =>', err.message);
            this.isWaitingTxShow = false;
            this.isTxComaplete = true;
        });
      }

      updateTxPlan(status:string,error:any = null){
        var obj = {
            id:this.planId,
            txhash:this.transactionHash,
            status:status,
            status_desc:error,
        };
        this.controlPanelService.updateTxPlan(obj).subscribe({
            next: (data) => {
            if(status === 'SUCCESS'){
                this.router.navigate(['/user/staking-plans']);
            } 
            this.toastrService.success(data.message);
            console.log('updateTxPlan => ',data);
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
        }, 30000);
    }
}
