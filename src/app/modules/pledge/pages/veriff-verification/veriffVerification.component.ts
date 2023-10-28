import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { PledgeService } from '../../services/pledge.service';
import { ToastrService } from 'ngx-toastr';
import { BaseWeb3Class } from 'app/core/base-web3.component';
import { Web3Service } from 'app/core/service/web3.service';
import { Router } from '@angular/router';
import Web3 from "web3";
import { AbiToken } from 'app/constants/abi';
import { environment } from 'environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-veriff-verification',
  templateUrl: './veriffVerification.component.html',
  styleUrls: ['./veriffVerification.component.scss']
})

export class VeriffVerificationComponent extends BaseWeb3Class implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  isButtonClicked: boolean = false;
  currentBalance: string = '';
  veriffURL: any;
  refData : any;
  constructor(
    private pledgeService:PledgeService, 
    private toastrService:ToastrService,
    private router: Router,
    web3Service: Web3Service,
    modalService:BsModalService
  ) {
      super(web3Service,modalService);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required,Validators.email]),
    });
    this.submitted = false;
    this.bindWeb3Service();
    if(!this.isWalletConnected){
      this.router.navigate(['home']);
    }
    this.refData = localStorage.getItem('pledgeRefData');
    this.refData = this.refData ? JSON.parse(this.refData) : '';
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

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
        return;
    }
    this.isButtonClicked = true;
    const loginData = this.form.value;
    loginData.walletAddress = this.walletAddress;
    loginData.plan_id = this.refData && this.refData.planId ? this.refData.planId : 1;
    loginData.parentAddress = this.refData && this.refData.parentAddr ? this.refData.parentAddr : '';
    this.pledgeService.login(loginData).subscribe({
      next: (data) => {
          this.isButtonClicked = false;
          this.pledgeService.userAuth = data.auth;
          this.pledgeService.userData = data.data;
          if(data.type === true){
            if(data.kyc_type === 'veriff'){
              window.location = data.data[0].kyc_url;
            } else {
              this.router.navigate(['dashboard']);
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

  get f(): { [key: string]: AbstractControl} {
    return this.form.controls;
  }

}
