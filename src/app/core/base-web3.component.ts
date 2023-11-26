import { Web3Service } from "./service/web3.service";
import Web3 from "web3";
import { environment } from "environments/environment";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { networkModalComponent } from 'app/shared/component/networkModal/networkModal.component';

export abstract class BaseWeb3Class {
    
    public web3js: any;
    public wallet: any = null;
    allocation: string;
    unlocked: any;
    claimed: string;
    walletAddress: string = ''
    isWalletConnected:boolean = false;
    wrongNetwork: boolean = false;
    confirmModal: string = '';
    selectNetworkModal: string = '';
    web3Network: string = 'ETH_NETWORK';
    networkType: string = 'ETH';
    configToken:any = environment.config;

    networkModalRef: BsModalRef;
    networkModalConfig = {
        animated: true,
        keyboard: false,
        class: 'modal-dialog-centered modal-sm site-model1',
        ignoreBackdropClick: true,
    }
    
    constructor(
        public web3Service:Web3Service,
        public modalService: BsModalService,
    ) {
        
    }

    bindWeb3Service( ){
        this.web3Network = this.web3Service.getWeb3Network();
        this.networkType = this.web3Service.networkType;
        this.wrongNetwork = this.web3Service.wrongNetwork;
        this.walletAddress = this.web3Service.walletAddress;
        if(this.walletAddress ){
            this.isWalletConnected = true;
            if(!this.wrongNetwork){
                this.web3js = new Web3(this.web3Service.web3Provider);
            }
        } else {
            this.isWalletConnected = false;
        }
        
        if(this.wrongNetwork){
            this.isWalletConnected = true;
        }
        
        this.web3Service.walletAddress$.subscribe(x => {
            this.walletAddress = x;
            this.isWalletConnected = true;
            this.web3Network = this.web3Service.getWeb3Network();
            this.networkType = this.web3Service.getNetworkType(this.web3Network);
            if(!this.wrongNetwork){
                this.web3js = new Web3(this.web3Service.web3Provider);
            }
        });
        this.web3Service.accountStatus$.subscribe(x => {
            this.wrongNetwork = x;
        });
    }

    // connectWalletAction(type?:any){
    //     this.networkModalRef.hide();
    //     localStorage.setItem('network',this.web3Network);
    //     this.web3Service.setWeb3Network(this.web3Network);
    //     this.web3Service.connectWalletAction(type);
    // }

    changeNetwork(){
        this.web3Service.switchToChain();
    }

    logoutWallet(){
        this.web3Service.logoutWallet();
        window.location.reload();
    }

    openNetworkModal(type:string = ''){
        this.web3Service.pageType = type;
        if(type === 'staking'){
            this.web3Network = 'BSC_NETWORK';
            localStorage.setItem('network',this.web3Network);
            this.web3Service.setWeb3Network(this.web3Network);
            this.web3Service.connectWalletAction();
        } else {
            this.networkModalRef = this.modalService.show(networkModalComponent,this.networkModalConfig);
        }
        return;
        
    }
 
}