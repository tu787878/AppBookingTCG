import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    loadChildren: () => import('./inc/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./inc/help/help.module').then( m => m.HelpPageModule)
  },
  {
    path: 'add-block-time',
    loadChildren: () => import('./inc/add-block-time/add-block-time.module').then( m => m.AddBlockTimePageModule)
  },
  
  
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
