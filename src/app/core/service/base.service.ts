import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable} from 'rxjs';
import { APIResponse } from '../modal/api.response';


@Injectable({
    providedIn: 'root'
})
export class BaseService {

    constructor (
        private http: HttpClient
    ) {

    }

    private requestHeader(isFile:boolean = false) {
        const headerSettings: { [name: string]: string | string[] } = {};
        headerSettings["Content-Type"] = "application/json";
        return new HttpHeaders(headerSettings);
    }

    public getRequest(apiURL: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(apiURL, { headers: this.requestHeader() });
    }

    public postRequest(apiURL: string, param?: any, isSpinner:boolean = true): Observable<APIResponse> {
        const body = JSON.stringify(param);
        return this.http.post<APIResponse>(apiURL, body, { headers: this.requestHeader(), reportProgress:isSpinner});
    }

    public sendFormData(apiURL:string, formData:FormData, id:number) {
        return this.http.post<APIResponse>(apiURL, formData, {reportProgress:true, params:{id:id}});
    }
    

}
