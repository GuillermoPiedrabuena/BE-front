import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { TefComponent } from './components/tef/tef.component';

const routes: Routes = [
  {path : '', component : LoginComponent},
  {path : 'tef', component : TefComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
