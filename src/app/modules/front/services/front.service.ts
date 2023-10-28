import { Injectable } from '@angular/core';
import { ApiConstants } from 'app/constants/api.constants';
import { BaseService } from 'app/core/service/base.service';

@Injectable({ providedIn: 'root' })

export class FrontService {
    constructor(
        private baseService: BaseService,
    ) {
        
    }

    get_plans(data:any) {
        return this.baseService.postRequest(ApiConstants.GET_PLANS,data);
    }

    save_transaction(data:any) {
        return this.baseService.postRequest(ApiConstants.SAVE_TRANSACTION,data,false);
    }

    get_transactions(data:any) {
        return this.baseService.postRequest(ApiConstants.GET_TRANSACTIONS,data);
    }
    
    update_tx(data:any) {
        return this.baseService.postRequest(ApiConstants.UPDATE_TX,data,false);
    }

    get_plan_stats(data:any) {
        return this.baseService.postRequest(ApiConstants.GET_PLAN_STATS,data);
    }

}