import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TrimValuePipe } from 'app/core/pipes/trimValue.pipe';
import { FooterComponent } from 'app/modules/front/components/footer/footer.component';
import { HeaderComponent } from 'app/modules/front/components/header/header.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { networkModalComponent } from './component/networkModal/networkModal.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        BsDropdownModule.forRoot(),
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        networkModalComponent,
        TrimValuePipe
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        TrimValuePipe
    ]
})
export class SharedModule { }


