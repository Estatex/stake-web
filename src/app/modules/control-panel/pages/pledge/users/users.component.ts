import { DatePipe } from '@angular/common';
import { Component, OnInit,TemplateRef } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-pledge-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})

export class PledgeUsersComponent implements OnInit {
    filterDates:any[] = ['',''];
    bsConfig?: Partial<BsDatepickerConfig>;
    sortBy:string;
    sortOrder:'asc'|'desc';
    userData:any[] = [];
    constructor(
        private datePipe: DatePipe, 
    ) {
    }

    ngOnInit(): void {
        this.bsConfig = Object.assign({}, {
            isAnimated: true,
            dateInputFormat: 'DD/MM/YYYY'
        });
    }


    onDateChange(event:any){
        this.filterDates = ['',''];
        if(event){
            this.filterDates[0] = this.datePipe.transform(event[0], 'yyyy-MM-dd')?.toString();
            this.filterDates[1] = this.datePipe.transform(event[1], 'yyyy-MM-dd')?.toString();
        }
    }

    shortBy(type:string){
        if(this.sortBy === type){
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortOrder = 'asc';
        }
        this.sortBy = type;
        // this.getUsers();
    }

}
