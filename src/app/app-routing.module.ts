import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticateGuard } from './auth/guards/is-authenticate.guard';

const routes: Routes = [
  {
    path:'auth',
    loadChildren:() => import('./auth/auth.module').then(m=>m.AuthModule)
  },
  {
    path:'dashboard',
    canActivate: [isAuthenticateGuard],
    loadChildren:() => import('./dashboard/dashboard.module').then(m=>m.DashboardModule)
  },
  {
    path:'**',
    redirectTo:'auth'  // Redirect to dashboard when route not found
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
