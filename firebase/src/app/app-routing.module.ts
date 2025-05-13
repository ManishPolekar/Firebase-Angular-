import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './Component/account/account.component';
import { LoginComponent } from './Component/account/login/login.component';

const routes: Routes = [
  {path: 'account', component: AccountComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent}
   ]  
  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
