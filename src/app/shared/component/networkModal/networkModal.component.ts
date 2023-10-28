import { Component, Input } from '@angular/core';
import { Web3Service } from 'app/core/service/web3.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-network',
    templateUrl: 'networkModal.component.html',
    styleUrls: ['networkModal.component.scss']
})

export class networkModalComponent {
    web3Network: string = 'ETH_NETWORK';
    networkName: string = 'ETHEREUM MAINNET';
    networkType: string = 'ETH';
    pageType:string = '';
    constructor(
        private networkModalRef: BsModalRef,
        private web3Service: Web3Service
    ) { }

    closeModal() {
        this.networkModalRef.hide();
    }

    setNetworkType(type:string = ''){
        this.web3Network = type;
        if(type === 'ETH_NETWORK'){
            this.networkName = 'ETHEREUM MAINNET'
        } else if(type === 'BSC_NETWORK'){
            this.networkName = 'BINANCE SMARTCHAIN'
        } else if(type === 'POLY_NETWORK'){
            this.networkName = 'POLYGON MAINNET'
        }
        this.networkType = this.web3Service.getNetworkType(this.web3Network);
    }

    connectWalletAction(){
        this.networkModalRef.hide();
        localStorage.setItem('network',this.web3Network);
        this.web3Service.setWeb3Network(this.web3Network);
        this.web3Service.connectWalletAction();
    }
}