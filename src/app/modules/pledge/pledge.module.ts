import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PledgeRoutingModule } from './pledge.routing';
import { PledgeHomeComponent } from './pages/pledge-home/pledgeHome.component';
import { PledgeLayoutComponent } from './layout/pledge-layout.component';
import { VeriffVerificationComponent } from './pages/veriff-verification/veriffVerification.component';
import { PledgeDashboardComponent } from './pages/pledge-dashboard/pledgeDashboard.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [
    PledgeLayoutComponent,
    PledgeHomeComponent,
    VeriffVerificationComponent,
    PledgeDashboardComponent
  ],
  imports: [
    PledgeRoutingModule,
    SharedModule,
    AccordionModule.forRoot(),
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
})
export class PledgeModule { }

