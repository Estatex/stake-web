import { Injectable } from '@angular/core';
import { ApiConstants } from 'app/constants/api.constants';
import { BaseService } from 'app/core/service/base.service';

@Injectable({ providedIn: 'root' })

export class PledgeService {
    private _userAuth: string;
    private _userData: any;

    constructor(
        private baseService: BaseService,
    ) {
        
    }

    public get userAuth(){
        if(!this._userAuth){
            const auth:any = localStorage.getItem('pledgeAuth');
            this._userAuth = auth;
        }
        return this._userAuth;
    }

    public set userAuth(auth:any){
        if(auth){
            this._userAuth = auth;
            localStorage.setItem('pledgeAuth',auth);
        }
    }


    public set userData(data:any){
        this._userData = data;
    }

    public get userData(){
        return this._userData;
    }

    login(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_LOGIN,data);
    }

    save_transaction(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_SAVE_TRANSACTION,data,false);
    }

    get_transactions() {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_TRANSACTIONS);
    }
    
    update_tx(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_UPDATE_TX,data,false);
    }

    get_Chains(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_CHAINS_TOKEN,data);
    }
    
    get_dashboard() {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_DASHBOARD);
    }

    get_user() {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_USER);
    }

    get_plan(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_PLAN,data);
    }

    check_user(data:any) {
        return this.baseService.postRequest(ApiConstants.PLEDGE_CHECK_USER,data);
    }

    get_refree_transactions() {
        return this.baseService.postRequest(ApiConstants.PLEDGE_GET_REFREE_TRANSACTIONS);
    }

}
