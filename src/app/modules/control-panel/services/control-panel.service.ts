import { Injectable } from '@angular/core';
import { ApiConstants } from 'app/constants/api.constants';
import { BaseService } from 'app/core/service/base.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ControlPanelService {
    currentLang:string;
    userAuth:string;
    getNotificationSubject : Subject<boolean> = new Subject<boolean>() ;
    private _stakingPlans: any[] = [];
    constructor(
        private baseService: BaseService,
    ) {
        
    }

    get_plans(data:any) {
        return this.baseService.postRequest(ApiConstants.GET_PLANS,data);
    }
    
    save_plan(data:any) {
        return this.baseService.postRequest(ApiConstants.SAVE_PLAN,data);
    }

    edit_plan(data:any) {
        return this.baseService.postRequest(ApiConstants.EDIT_PLAN,data);
    }
    get_whiteList(data:any) {
        return this.baseService.postRequest(ApiConstants.GET_WHITELIST,data);
    }
    add_whiteList(data:any) {
        return this.baseService.postRequest(ApiConstants.ADD_WHITELIST,data);
    }
    delete_whiteList(data:any) {
        return this.baseService.postRequest(ApiConstants.DELETE_WHITELIST,data);
    }
    get_whiteList_count(data:any) {
        return this.baseService.postRequest(ApiConstants.GET_WHITE_LIST_COUNT,data);
    }
    upload_whitelist(data:any,id:any) {
        return this.baseService.sendFormData(ApiConstants.UPLOAD_WHITELIST,data,id);
    }
    upload_stake_users(data:any,id:any) {
        return this.baseService.sendFormData(ApiConstants.UPLOAD_STAKE_USERS,data,id);
    }
    get_stake_users(data:any) {
        return this.baseService.postRequest(ApiConstants.GET_STAKE_USERS,data);
    }
    get_stake_users_count(data:any) {
        return this.baseService.postRequest(ApiConstants.GET_STAKE_USERS_COUNT,data);
    }
    csvStakeUsers(data:any) {
        return this.baseService.postRequest(ApiConstants.CSV_STAKE_USERS,data);
    }
    updateTxPlan(data:any) {
        return this.baseService.postRequest(ApiConstants.UPDATE_TX_PLAN,data,false);
    }

    updateStakeTx(data:any) {
        return this.baseService.postRequest(ApiConstants.UPDATE_TX_STAKE,data,false);
    }

    dashboard(data:any) {
        return this.baseService.postRequest(ApiConstants.DASHBOARD,data);
    }

    updatePassword(data:any) {
        return this.baseService.postRequest(ApiConstants.UPDATE_PASSWORD,data);
    }

    public get stakingPlans() : any[] {
        return this._stakingPlans;
    }

    public set stakingPlans(v : any[]) {
        this._stakingPlans = v;
    }
    
}