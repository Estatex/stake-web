import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/staking/dashboard/dashboard.component';
import { StakingPlansComponent } from './pages/staking/staking-plans/staking-plans.component';
import { WhitelistComponent } from './pages/staking/whitelist/whitelist.component';
import { CreatePlansComponent } from './pages/staking/create-plans/create-plans.component';
import { PledgeAdminDashboardComponent } from './pages/pledge/pledge-dashboard/pledge-dashboard.component';
import { PledgeUsersComponent } from './pages/pledge/users/users.component';
import { PledgeTransactionComponent } from './pages/pledge/transaction/transaction.component';
import { PledgePlansComponent } from './pages/pledge/pledge-plans/pledge-plans.component';
import { CreatePledgePlansComponent } from './pages/pledge/create-pledge-plans/create-pledge-plans.component';
import { UpdatePasswordComponent } from './pages/setting/update-password/update-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'staking-plans',
    component: StakingPlansComponent
  },
  {
    path: 'whitelist',
    component: WhitelistComponent
  },
  {
    path: 'create-plans',
    component: CreatePlansComponent
  },
  {
    path: 'create-plans/:id',
    component: CreatePlansComponent
  },
  {
    path: 'update-password',
    component: UpdatePasswordComponent
  },
  {
    path: 'pledge',
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch:'full'},
      { path: 'dashboard', component: PledgeAdminDashboardComponent },
      { path: 'users', component: PledgeUsersComponent },
      { path: 'transaction', component: PledgeTransactionComponent },
      { path: 'pledge-plans', component: PledgePlansComponent },
      { path: 'create-plans', component: CreatePledgePlansComponent },
      { path: 'create-plans/:id',component: CreatePledgePlansComponent },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ] 
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule { }