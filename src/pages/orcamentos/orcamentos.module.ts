import { NgModule, ErrorHandler } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrcamentosPage } from './orcamentos';

@NgModule({
  declarations: [OrcamentosPage],
  imports: [
    IonicPageModule.forChild(OrcamentosPage),
  ],
})
export class OrcamentosPageModule {}
