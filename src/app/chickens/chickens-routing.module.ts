import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChickensHomeComponent } from './chickens-home.component';

const routes: Routes = [
  {
    path: 'chickens',
    component: ChickensHomeComponent,
    data: { title: 'Chickens' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChickensRoutingModule { }
