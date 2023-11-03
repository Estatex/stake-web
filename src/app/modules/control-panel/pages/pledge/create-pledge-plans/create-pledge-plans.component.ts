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
import { PledgeControlPanelService } from 'app/modules/control-panel/services/pledge-control-panel.service';

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
        private pledgeService: PledgeControlPanelService,
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
            min_amount: new FormControl('', [Validators.required]),
            // max_amount: new FormControl('', [Validators.required]),
            comm_per: new FormControl('', [Validators.required]),
            desc: new FormControl(''),
            show_stake: new FormControl(false)
        });
        this.route.paramMap.subscribe((params: ParamMap) => {
            const id  = params.get('id');
            if(id){
                this.updateForm(id);
            }
        });
    }

    updateForm(id:any){
        const data = this.pledgeService.pledgePlans.find(x => x.id == id);
        if(data){
            this.planId = data.id;
            this.form.setValue({
                name: data.name,
                startdate: new Date(data.startdate),
                enddate: new Date(data.enddate),
                min_amount: data.min_amount,
                // max_amount: data.max_amount ? data.max_amount : 0,
                comm_per: data.ref_comm_per,
                desc: data.descrp.replace(/<br\/>/g, "\n").replace(/<br \/>/g, "\n"),
                show_stake: data.show_stakeoption === 1,
            });
        } else {
            this.router.navigate(['/user/pledge/pledge-plans']);
        }
    }

    onSubmit(){
        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        this.isButtonClicked = true;
        this.form.value.show_stake = this.form.value.show_stake ? 1 : 0;
        this.form.value.desc = this.form.value.desc.replace(/\n/g, "<br />");;
        this.form.value.startdate = this.datePipe.transform(this.form.value.startdate, 'yyyy-MM-dd');
        this.form.value.enddate = this.datePipe.transform(this.form.value.enddate, 'yyyy-MM-dd');
        if(this.planId){
            this.form.value.plan_id = this.planId;
        }
        this.pledgeService.savePledgePlans(this.form.value).subscribe({
            next: (data) => {
                this.isButtonClicked = false;
                if(data.type === true){
                    this.planId = data.plan_id;
                    this.toastrService.success(data.message);
                    this.router.navigate(['/user/pledge/pledge-plans']);
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
}
