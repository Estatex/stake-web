import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { HomeComponent } from './pages/home/home.component';
import { StakingPoolComponent } from './pages/staking-pool/staking-pool.component';
import { AppRoutingModule } from 'app/app-routing.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent,
    StakingPoolComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    AccordionModule.forRoot(),
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [DatePipe]
})
export class FrontModule { }

