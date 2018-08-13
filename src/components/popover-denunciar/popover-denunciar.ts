import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Generated class for the PopoverDenunciarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popover-denunciar',
  templateUrl: 'popover-denunciar.html'
})
export class PopoverDenunciarComponent {
  public perfilId: any;
  public userId: any;
  constructor(public viewCtrl: ViewController) {
    this.perfilId = this.viewCtrl.data.perfilId;
    this.userId = this.viewCtrl.data.userId;
  }

  sair(opt) {
    if(opt == 1) {
      this.viewCtrl.dismiss("denunciar");
    } else if(opt == 2) {
      this.viewCtrl.dismiss("bloquear");
    } else if(opt == 3) {
      this.viewCtrl.dismiss("cancelar");
    }else if(opt == 4){
      this.viewCtrl.dismiss("logout");
    }
  }

}
