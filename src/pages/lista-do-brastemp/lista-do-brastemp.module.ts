import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaDoBrastempPage } from './lista-do-brastemp';

@NgModule({
  declarations: [
    ListaDoBrastempPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaDoBrastempPage),
  ],
})
export class ListaDoBrastempPageModule {}
