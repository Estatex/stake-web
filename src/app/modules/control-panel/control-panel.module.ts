import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { NgApexchartsModule } from "ng-apexcharts";
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { ControlPanelRoutingModule } from './control-panel.routing';
import { StatusPipe } from 'app/core/pipes/status.pipe';
import { GetNamebyIDPipe } from 'app/core/pipes/getNamebyid.pipe';
import { ControlPanelLayoutComponent } from './layout/control-panel-layout.component';
import { DashboardComponent } from './pages/staking/dashboard/dashboard.component';
import { WhitelistComponent } from './pages/staking/whitelist/whitelist.component';
import { CreatePlansComponent } from './pages/staking/create-plans/create-plans.component';
import { StakingPlansComponent } from './pages/staking/staking-plans/staking-plans.component';
import { PledgeAdminDashboardComponent } from './pages/pledge/pledge-dashboard/pledge-dashboard.component';
import { PledgeUsersComponent } from './pages/pledge/users/users.component';
import { PledgeTransactionComponent } from './pages/pledge/transaction/transaction.component';
import { PledgePlansComponent } from './pages/pledge/pledge-plans/pledge-plans.component';
import { CreatePledgePlansComponent } from './pages/pledge/create-pledge-plans/create-pledge-plans.component';


@NgModule({
  declarations: [
    ControlPanelLayoutComponent,
    WhitelistComponent,
    DashboardComponent,
    CreatePlansComponent,
    StakingPlansComponent,
    StatusPipe,
    GetNamebyIDPipe,
    PledgeAdminDashboardComponent,
    PledgeUsersComponent,
    PledgeTransactionComponent,
    PledgePlansComponent,
    CreatePledgePlansComponent
  ],
  imports: [
    ControlPanelRoutingModule,
    SharedModule,
    ToastrModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    NgApexchartsModule
  ],
  providers: [DatePipe]
})
export class ControlPanelModule { }

