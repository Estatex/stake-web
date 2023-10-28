import { Component, OnInit } from '@angular/core';
import { BaseWeb3Class } from '../../../../core/base-web3.component';
import { Web3Service } from '../../../../core/service/web3.service';
import { FrontService } from '../../services/front.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent extends BaseWeb3Class implements OnInit {
  planData: any;
  constructor(
    private frontService:FrontService,
    private toastrService:ToastrService,
    web3Service: Web3Service,
    modalService: BsModalService

  ) {
      super(web3Service,modalService);
  }

    ngOnInit(): void {
        this.bindWeb3Service();
        this.getPlans();
    }

    getPlans() {
      this.frontService.get_plans({}).subscribe({
          next: (data) => {
              if(data.type === true){
                  this.planData = data.data;
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
