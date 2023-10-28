import { Component, OnInit, TemplateRef } from '@angular/core';
import { ControlPanelService } from '../../../services/control-panel.service';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-whitelist',
    templateUrl: './whitelist.component.html',
    styleUrls: ['./whitelist.component.scss']
})

export class WhitelistComponent implements OnInit {
    pageData:any;
    planList:any;
    selectedPlan:number;
    selectedPlanForCSV:number;
    walletaddress:number;
    modalRef: BsModalRef;
    modalConfig:ModalOptions = {
        animated: true,
        keyboard: false,
        class: 'modal-dialog-centered modal-md site-model',
        ignoreBackdropClick: true,
    };
    fileData :any;
    currentPage:number = 1;
    pageTotalItem:number;
    pageItemlimit:number = 1000;
    searchStr:string = '';
    sortBy:string;
    sortOrder:'asc'|'desc';
    constructor(
        private controlPanelService:ControlPanelService,
        private toastrService:ToastrService,
        private modalService: BsModalService
    ) {

    }

    ngOnInit(): void {
        this.getPlans()
    }

    openModal(template: TemplateRef<any>){
        this.selectedPlanForCSV = this.selectedPlan;
        this.modalRef = this.modalService.show(template,this.modalConfig);
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

    updateData(){
        this.pageTotalItem = 0;
        this.getUsersCount();
        this.getList();
    }

    getList(pageNumber?:number) {
        this.currentPage = pageNumber ? pageNumber : this.currentPage;
        const data = {
            plan_id: Number(this.selectedPlan),
            searchStr:this.searchStr,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder,
            page:this.currentPage,
            limit:this.pageItemlimit
        }
        this.controlPanelService.get_whiteList(data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.pageData = data.data;
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
            searchStr:this.searchStr,
            plan_id: Number(this.selectedPlan),
        }
        this.controlPanelService.get_whiteList_count(data).subscribe({
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

    handleFileUpdate(event:any){
        if(event.target.value){
            this.fileData =  <File>event.target.files[0];
        }
    }

    uploadCSVFile(){
        if(!this.fileData || !this.selectedPlanForCSV) return;
        let formData = new FormData();
        formData.append('file', this.fileData, this.fileData.name);
        this.controlPanelService.upload_whitelist(formData,this.selectedPlanForCSV).subscribe({
            next: (data:any) => {
                if(data.type === true){
                    this.toastrService.success(data.data);
                    this.modalRef.hide();
                    this.updateData()
                } else {
                    this.toastrService.error(data.message);
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    addWhitelist() {
        if(!this.walletaddress || !this.selectedPlanForCSV) return;
        const data = {
            plan_id: Number(this.selectedPlan),
            walletAddress: this.walletaddress,
        }
        this.controlPanelService.add_whiteList(data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.toastrService.success(data.message);
                    this.modalRef.hide();
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

    removeWhitelist(item:any) {
        const data = {
            plan_id: Number(this.selectedPlan),
            walletAddress: item.address,
        }
        this.controlPanelService.delete_whiteList(data).subscribe({
            next: (data) => {
                if(data.type === true){
                    this.toastrService.success(data.message);
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

    shortBy(type:string){
        if(this.sortBy === type){
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortOrder = 'asc';
        }
        this.sortBy = type;
        this.getList();
    }
}


