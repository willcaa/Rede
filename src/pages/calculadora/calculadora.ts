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
  hExecucao: any;
  imposto: any;
  lucro: any;
  totalHoras: any;
  totalCustos: number = 0;
  totalInsumos: number = 0;
  totalAjudantes: number = 0;
  custosHora: number = 0;
  gMensais: number;
  hTrabalhadas: number;
  nCustoDesc: any;
  nCustoValor: any;
  nInsumoDesc: any;
  nInsumoValor: any;
  nAjudanteDesc: any;
  nAjudanteValor: any;
  pageId: any = 'calcHoras';
  custosFixos: any = [];
  custosInsumos: any = [];
  custosAjudantes: any = [];
  precoSugerido: number;

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

  addInsumos(){
    if(this.nInsumoDesc && this.nInsumoValor){
      var custoN = [];
      custoN['desc'] = this.nInsumoDesc;
      custoN['val'] = this.nInsumoValor;
      this.custosInsumos.push(custoN);
      this.totalInsumos = this.totalInsumos + parseInt(this.nInsumoValor);
      console.log(this.nInsumoValor, this.totalInsumos);
      this.nInsumoDesc = "";
      this.nInsumoValor = '';
    }
  }
  remInsumos(id){
    if(this.custosInsumos){
      this.custosInsumos =  this.custosInsumos.filter(function(el) { 
        return el !== id; 
      });
      this.totalInsumos = this.totalInsumos - parseInt(id.val);
      console.log(this.custosInsumos, this.totalInsumos);
    }
  }

  addAjudantes(){
    if(this.nAjudanteDesc && this.nAjudanteValor){
      var custoN = [];
      custoN['desc'] = this.nAjudanteDesc;
      custoN['val'] = this.nAjudanteValor;
      this.custosAjudantes.push(custoN);
      this.totalAjudantes = this.totalAjudantes + parseInt(this.nAjudanteValor);
      console.log(this.nAjudanteValor, this.totalAjudantes);
      this.nAjudanteDesc = "";
      this.nAjudanteValor = '';
    }
  }
  remAjudantes(id){
    if(this.custosAjudantes){
      this.custosAjudantes =  this.custosAjudantes.filter(function(el) { 
        return el !== id; 
      });
      this.totalAjudantes = this.totalAjudantes - parseInt(id.val);
      console.log(this.custosAjudantes, this.totalAjudantes);
    }
  }

  alterarTab(tabId){
    this.pageId = tabId;
    console.log(this.pageId);
  }
}
