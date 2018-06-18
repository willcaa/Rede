import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CalculadoraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calculadora',
  templateUrl: 'calculadora.html',
})
export class CalculadoraPage {
  totalHoras: any;
  totalCustos: number = 0;
  custosHora: number = 0;
  gMensais: number;
  hTrabalhadas: number;
  nCustoDesc: any;
  nCustoValor: any;
  custosFixos: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.totalHoras = 0;
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CalculadoraPage');
  }
  
  sumGanhos(){
    if(this.gMensais && this.hTrabalhadas){
      this.totalHoras = Math.trunc(this.gMensais / this.hTrabalhadas);
    }
  }

  addFixos(){
    if(this.nCustoDesc && this.nCustoValor){
      var custoN = [];
      custoN['desc'] = this.nCustoDesc;
      custoN['val'] = this.nCustoValor;
      this.custosFixos.push(custoN);
      this.totalCustos = this.totalCustos + parseInt(this.nCustoValor);
      console.log(this.custosFixos, this.totalCustos);
      this.nCustoDesc = "";
      this.nCustoValor = '';
      this.custosHora = Math.trunc(this.totalCustos / this.hTrabalhadas);
    }
  }
  remFixos(id){
    if(this.custosFixos){
      this.custosFixos =  this.custosFixos.filter(function(el) { 
        return el !== id; 
      });
      this.totalCustos = this.totalCustos - parseInt(id.val);
      this.custosHora = Math.trunc(this.totalCustos / this.hTrabalhadas);      
      console.log(this.custosFixos, this.totalCustos);
    }
  }
}
