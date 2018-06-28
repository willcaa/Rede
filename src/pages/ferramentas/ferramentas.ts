import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CodigoDeErroPage } from '../codigo-de-erro/codigo-de-erro';
import { OrcamentosPage } from '../orcamentos/orcamentos';
import { CalculadoraPage } from '../calculadora/calculadora';


@IonicPage()
@Component({
  selector: 'page-ferramentas',
  templateUrl: 'ferramentas.html',
})

export class FerramentasPage {
  userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userId = this.navParams.get("userId");
  }

  goErrorCode(){
    this.navCtrl.push(CodigoDeErroPage);
  }

  goOrcamentosPage(){
    this.navCtrl.push(OrcamentosPage);
  }
 
  goCalculadoraPage(){
    this.navCtrl.push(CalculadoraPage,{userId: this.userId});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FerramentasPage');
  }

}
