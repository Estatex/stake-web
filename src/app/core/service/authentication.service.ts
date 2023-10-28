import { EventEmitter, Injectable, Output } from '@angular/core';
import { PledgeService } from 'app/modules/pledge/services/pledge.service';

@Injectable({ providedIn: 'root' })


export class AuthenticationService {
    userAuth : string = '';
    userData : any;
    @Output() getLogoutEvent: EventEmitter<any> = new EventEmitter();

    constructor(
    ) {
    }

    public setUserAuth(auth:string){
        this.userAuth = auth;
        localStorage.setItem('auth',auth);
    }

    public getUserAuth(){
        if(this.userAuth !== ''){
            return this.userAuth;
        } else {
            return localStorage.getItem('auth');
        }
    }

    public setUserData(data:any){
        this.userData = data;
        localStorage.setItem('userData',JSON.stringify(data));
    }

    public getUserData(){
        if(this.userData){
            return this.userData;
        } else {
           const data:any = localStorage.getItem('userData');
           return JSON.parse(data);
        }
    }

    public logout(){
        this.userAuth = '';
        this.userData = undefined;
        localStorage.clear();
        this.getLogoutEvent.emit('logout');
    }

    public islogin(): boolean {
        const token = localStorage.getItem('auth');
        const userData = this.getUserData();
        if(token && userData){
            return true;
        }
        return false;
    }
}