import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { EmailComponent } from './email/email.component';
// import { EmailComponent } from './email/email.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'file-manager', component:FileManagerComponent},
  { path: 'request-form', component:RequestFormComponent},
  { path: 'send-mail', component:EmailComponent},
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'docview/:doc', loadChildren: () => import('./docview/docview.module').then( m => m.DocviewPageModule)},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
