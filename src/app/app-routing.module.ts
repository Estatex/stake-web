import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './modules/auth/layout/auth-layout.component';
import { HomeComponent } from './modules/front/pages/home/home.component';
import { StakingPoolComponent } from './modules/front/pages/staking-pool/staking-pool.component';
import { AuthGuard } from './core/guard/auth.guard';
import { PledgeLayoutComponent } from './modules/pledge/layout/pledge-layout.component';
import { ControlPanelLayoutComponent } from './modules/control-panel/layout/control-panel-layout.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full'
  },
  {
    path: 'staking-pool',
    component: StakingPoolComponent,
  },
  {
    path: 'admin',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('app/modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'user',
    component: ControlPanelLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('app/modules/control-panel/control-panel.module').then(m => m.ControlPanelModule)
  },
  // Fallback when no prior routes is matched
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

const pledgeRouter: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PledgeLayoutComponent,
    loadChildren: () =>
      import('app/modules/pledge/pledge.module').then(m => m.PledgeModule)
  },
  {
    path: 'admin',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('app/modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'user',
    component: ControlPanelLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('app/modules/control-panel/control-panel.module').then(m => m.ControlPanelModule)
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
]

const isPledgeDomain: boolean = 
(window.location.hostname === 'pledge.estatex.eu') 
//|| true; // prod

@NgModule({
  imports: [
    RouterModule.forRoot(isPledgeDomain ? pledgeRouter : routes,{scrollPositionRestoration: 'enabled'})
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}