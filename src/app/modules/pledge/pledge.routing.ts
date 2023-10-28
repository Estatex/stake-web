import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PledgeHomeComponent } from './pages/pledge-home/pledgeHome.component';
import { VeriffVerificationComponent } from './pages/veriff-verification/veriffVerification.component';
import { PledgeDashboardComponent } from './pages/pledge-dashboard/pledgeDashboard.component';

const routes: Routes = [
  {
    path: 'home',
    component: PledgeHomeComponent
  },
  {
    path: 'home/:planId/:parentAddr',
    component: PledgeHomeComponent
  },
  {
    path: 'veriff-verification',
    component: VeriffVerificationComponent
  },
  {
    path: 'dashboard',
    component: PledgeDashboardComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PledgeRoutingModule { }