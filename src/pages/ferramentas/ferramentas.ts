import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CodigoDeErroPage } from '../codigo-de-erro/codigo-de-erro';
import { OrcamentosPage } from '../orcamentos/orcamentos';


@IonicPage()
@Component({
  selector: 'page-ferramentas',
  templateUrl: 'ferramentas.html',
})
export class FerramentasPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goErrorCode(){
    this.navCtrl.push(CodigoDeErroPage);
  }

  goOrcamentosPage(){
    this.navCtrl.push(OrcamentosPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FerramentasPage');
  }

}
