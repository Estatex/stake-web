import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseWeb3Class } from 'app/core/base-web3.component';
import { Web3Service } from 'app/core/service/web3.service';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-pledge-home',
  templateUrl: './pledgeHome.component.html',
  styleUrls: ['./pledgeHome.component.scss']
})

export class PledgeHomeComponent extends BaseWeb3Class implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    web3Service: Web3Service,
    modalService: BsModalService
  ) {
    super(web3Service,modalService);
    this.activatedRoute.params.subscribe((params:any) => {
      if(params && params.planId){
        localStorage.setItem('pledgeRefData',JSON.stringify(params))
      } else {
        localStorage.removeItem('pledgeRefData');
      }
    });
  }

  ngOnInit(): void {
    this.bindWeb3Service();
  }

}
