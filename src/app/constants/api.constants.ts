import { environment } from '../../environments/environment';

export class ApiConstants {
    
    // public static get API_URL(): string { return environment.apiUrl }
    public static get STAKING_API_URL(): string { return environment.stakingApiUrl }
    public static get PLEDGE_API_URL(): string { return environment.pledgeApiUrl }
    public static get ADMIN_API_URL(): string { return environment.adminApiUrl }

    public static get LOGIN() : string { return this.ADMIN_API_URL + 'login'}
    public static get FORGOTPASSWD() : string { return this.ADMIN_API_URL + 'forgot-passwd'}
    public static get RESETPASSWD() : string { return this.ADMIN_API_URL + 'reset-passwd'}
    public static get VERIFYRESET() : string { return this.ADMIN_API_URL + 'verify-reset'}
    public static get GET_PLANS() : string { return this.ADMIN_API_URL + 'getPlans'}
    public static get SAVE_PLAN() : string { return this.ADMIN_API_URL + 'savePlan'}
    public static get EDIT_PLAN() : string { return this.ADMIN_API_URL + 'editPlan'}
    public static get GET_WHITELIST() : string { return this.ADMIN_API_URL + 'getWhiteList'}
    public static get ADD_WHITELIST() : string { return this.ADMIN_API_URL + 'addWhiteList'}
    public static get DELETE_WHITELIST() : string { return this.ADMIN_API_URL + 'deleteWhiteList'}
    public static get GET_WHITE_LIST_COUNT() : string { return this.ADMIN_API_URL + 'getWhiteListCount'}
    public static get UPLOAD_WHITELIST() : string { return this.ADMIN_API_URL + 'uploadWhiteList'}
    public static get GET_STAKE_USERS() : string { return this.ADMIN_API_URL + 'getStakeUsers'}
    public static get GET_STAKE_USERS_COUNT() : string { return this.ADMIN_API_URL + 'getStakeUsersCount'}
    public static get CSV_STAKE_USERS() : string { return this.ADMIN_API_URL + 'csvStakeUsers'}
    public static get DASHBOARD() : string { return this.ADMIN_API_URL + 'dashboard'}
    public static get UPDATE_PASSWORD() : string { return this.ADMIN_API_URL + 'update-passwd'}

    public static get PLEDGE_DASHBOARD() : string { return this.ADMIN_API_URL + 'pledgeDashboard'}
    public static get PLEDGE_GET_PLANS() : string { return this.ADMIN_API_URL + 'getPledgePlans'}
    public static get PLEDGE_SAVE_PLAN() : string { return this.ADMIN_API_URL + 'savePledgePlan'}
    public static get PLEDGE_GET_USERS_COUNT() : string { return this.ADMIN_API_URL + 'getPledgeUsersCount'}
    public static get PLEDGE_GET_USERS() : string { return this.ADMIN_API_URL + 'getPledgeUsers'}
    public static get PLEDGE_CSV_USERS() : string { return this.ADMIN_API_URL + 'csvPledgeUsers'}
    public static get PLEDGE_GET_TRANSACTION_COUNT() : string { return this.ADMIN_API_URL + 'getPledgeTransCount'}
    public static get PLEDGE_GET_TRANSACTION() : string { return this.ADMIN_API_URL + 'getPledgeTrans'}
    public static get PLEDGE_CSV_TRANSACTION() : string { return this.ADMIN_API_URL + 'csvPledgeTrans'}
    public static get PLEDGE_GET_WITHDRAW_COUNT() : string { return this.ADMIN_API_URL + 'getWithdrawTransCount'}
    public static get PLEDGE_GET_WITHDRAW() : string { return this.ADMIN_API_URL + 'getWithdrawTrans'}
    public static get PLEDGE_CSV_WITHDRAW() : string { return this.ADMIN_API_URL + 'csvWithdrawTrans'}
    public static get PLEDGE_GET_CHAIN_BALANCE() : string { return this.ADMIN_API_URL + 'getChainBalance'}
    public static get PLEDGE_ADMIN_GET_CHAINS_TOKEN() : string { return this.ADMIN_API_URL + 'getChainToken'}
    public static get PLEDGE_SAVE_WITHDRAW_TRANSACTION() : string { return this.ADMIN_API_URL + 'saveWithdrawTransaction'}
    public static get PLEDGE_UPDATE_WITHDRAW_TRANSACTION() : string { return this.ADMIN_API_URL + 'updateWithdrawTx'}

    public static get SAVE_TRANSACTION() : string { return this.STAKING_API_URL + 'saveTransaction'}
    public static get GET_TRANSACTIONS() : string { return this.STAKING_API_URL + 'getTransactions'}
    public static get UPDATE_TX() : string { return this.STAKING_API_URL + 'updateTx'}
    public static get UPDATE_TX_PLAN() : string { return this.STAKING_API_URL + 'updatePlanTx'}
    public static get UPDATE_TX_STAKE() : string { return this.STAKING_API_URL + 'updateStakeTx'}
    public static get GET_PLAN_STATS() : string { return this.STAKING_API_URL + 'getPlanStats'}
    public static get UPLOAD_STAKE_USERS() : string { return this.STAKING_API_URL + 'uploadStakeUsers'}
    
    public static get PLEDGE_LOGIN() : string { return this.PLEDGE_API_URL + 'login'}
    public static get PLEDGE_GET_TRANSACTIONS() : string { return this.PLEDGE_API_URL + 'getTransactions'}
    public static get PLEDGE_SAVE_TRANSACTION() : string { return this.PLEDGE_API_URL + 'saveTransaction'}
    public static get PLEDGE_UPDATE_TX() : string { return this.PLEDGE_API_URL + 'updateTx'}
    public static get PLEDGE_GET_CHAINS_TOKEN() : string { return this.PLEDGE_API_URL + 'getChainToken'}
    public static get PLEDGE_GET_DASHBOARD() : string { return this.PLEDGE_API_URL + 'getDashboard'}
    public static get PLEDGE_GET_USER() : string { return this.PLEDGE_API_URL + 'getUser'}
    public static get PLEDGE_GET_PLAN() : string { return this.PLEDGE_API_URL + 'getPlan'}
    public static get PLEDGE_GET_REFREE_TRANSACTIONS() : string { return this.PLEDGE_API_URL + 'getRefreeTransactions'}
    public static get PLEDGE_CHECK_USER() : string { return this.PLEDGE_API_URL + 'checkUser'}
}