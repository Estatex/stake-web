import { Component, OnInit,TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-pledge-dashboard',
    templateUrl: './pledge-dashboard.component.html',
    styleUrls: ['./pledge-dashboard.component.scss']
})

export class PledgeAdminDashboardComponent implements OnInit {
    modalRef: BsModalRef;
    modalConfig: ModalOptions = {
        animated: true,
        keyboard: false,
        class: 'modal-dialog-centered modal-lg site-model1',
        ignoreBackdropClick: true,
    };
    constructor(
        private modalService: BsModalService
    ) {
    
    }

    ngOnInit(): void {
        
    }

    openModal(template: TemplateRef<any>){
        this.modalRef = this.modalService.show(template,this.modalConfig);
        return;
      }


}
