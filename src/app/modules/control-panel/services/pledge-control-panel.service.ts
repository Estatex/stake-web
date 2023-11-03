import { Injectable } from '@angular/core';
import { ApiConstants } from 'app/constants/api.constants';
import { BaseService } from 'app/core/service/base.service';

@Injectable({ providedIn: 'root' })

export class PledgeControlPanelService {
    private _pledgePlans: any[] = [];
    constructor(
        private baseService: BaseService,
    ) {
        
    }

    get_Chains(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_ADMIN_GET_CHAINS_TOKEN,data);
    }

    dashboard(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_DASHBOARD,data);
    }

    getDataCount(api:string, data:any) {
        return this.baseService.postRequest(ApiConstants.ADMIN_API_URL+api,data);
    }
    
    getCSV(api:string, data:any) {
        return this.baseService.postRequest(ApiConstants.ADMIN_API_URL+api,data);
    }
    

    getWithdraw(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_WITHDRAW,data);
    }

    getUser(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_USERS,data);
    }

    getTransaction(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_TRANSACTION,data);
    }

    getChainBalance() {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_CHAIN_BALANCE);
    }

    getPledgePlans() {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_PLANS);
    }

    savePledgePlans(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_SAVE_PLAN,data);
    }

    saveTransaction(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_SAVE_WITHDRAW_TRANSACTION,data);
    }

    updateTransaction(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_UPDATE_WITHDRAW_TRANSACTION,data);
    }

    public get pledgePlans() : any[] {
        return this._pledgePlans;
    }

    public set pledgePlans(v : any[]) {
        this._pledgePlans = v;
    }
    
    
}