import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {WorkingPageComponent} from "./working-page/working-page.component"
import {StartPageComponent} from "./start-page/start-page.component"
const routes: Routes = [{path: '', component: StartPageComponent},
{path: 'draw', component: WorkingPageComponent}];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
